import assert from "node:assert/strict";
import test from "node:test";
import { reconcileCycles, snapshotCycles } from "../src/mastery.mjs";
import { renderCycleBody } from "../src/metadata.mjs";

const root = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const clock = () => new Date("2026-07-21T00:00:00.000Z");

class FakeGitHub {
  constructor(issues = [], dependencies = new Map()) {
    this.issues = structuredClone(issues);
    this.dependencies = new Map([...dependencies].map(([key, value]) => [key, new Set(value)]));
    this.writes = [];
    this.nextId = Math.max(0, ...issues.map(issue => issue.id)) + 1;
  }
  async listIssues() { return structuredClone(this.issues); }
  async listBlockedBy(number) {
    const ids = this.dependencies.get(number) ?? new Set();
    return structuredClone(this.issues.filter(issue => ids.has(issue.id)));
  }
  async createIssue({ title, body }) {
    const issue = this.issue({ id: this.nextId++, number: this.nextId + 10, title, body });
    this.issues.push(issue);
    this.writes.push(["create", issue.number]);
    return structuredClone(issue);
  }
  async updateIssue(number, fields) {
    const issue = this.issues.find(value => value.number === number);
    Object.assign(issue, fields, { updated_at: `2026-07-21T00:00:${String(this.writes.length + 1).padStart(2, "0")}Z` });
    this.writes.push(["update", number]);
    return structuredClone(issue);
  }
  async addDependency(number, issueId) {
    if (!this.dependencies.has(number)) this.dependencies.set(number, new Set());
    this.dependencies.get(number).add(issueId);
    this.writes.push(["add-dependency", number, issueId]);
  }
  async removeDependency(number, issueId) {
    this.dependencies.get(number)?.delete(issueId);
    this.writes.push(["remove-dependency", number, issueId]);
  }
  issue(overrides = {}) {
    return {
      id: 1,
      number: 1,
      title: "Cycle",
      body: "",
      state: "open",
      updated_at: "2026-07-21T00:00:00Z",
      html_url: `https://github.test/issues/${overrides.number ?? 1}`,
      ...overrides
    };
  }
}

function proposal(mapping_key, overrides = {}) {
  return {
    mapping_key,
    title: `Cycle: ${mapping_key}`,
    primary_capability_id: "CAP-03",
    project_ref: `project:${mapping_key}`,
    rationale: "Current evidence exposes a learning gap.",
    prerequisite_mapping_keys: [],
    ...overrides
  };
}

async function requestFor(client, cycles) {
  const snapshot = await snapshotCycles(client, root, clock);
  return { schema: "mastery.cycles.reconcile.request/v1", expected_revision_token: snapshot.revision_token, cycles };
}

test("snapshot is versioned, capability-scoped, and revision-stable", async () => {
  const client = new FakeGitHub();
  const first = await snapshotCycles(client, root, clock);
  const second = await snapshotCycles(client, root, clock);
  assert.equal(first.schema, "mastery.cycles.snapshot/v1");
  assert.equal(first.capability, "mastery.cycles.snapshot");
  assert.equal(first.revision_token, second.revision_token);
  assert.ok(first.capabilities.some(value => value.capability_id === "CAP-03"));
});

test("reconcile materializes proposals and native dependencies, then performs a zero-write rerun", async () => {
  const client = new FakeGitHub();
  const cycles = [proposal("mapping-a"), proposal("mapping-b", { prerequisite_mapping_keys: ["mapping-a"] })];
  const first = await reconcileCycles(client, root, await requestFor(client, cycles), clock);
  assert.equal(first.status, "completed");
  assert.equal(first.created.length, 2);
  assert.equal(client.writes.filter(([kind]) => kind === "add-dependency").length, 1);

  client.writes.length = 0;
  const second = await reconcileCycles(client, root, await requestFor(client, cycles), clock);
  assert.equal(second.status, "completed");
  assert.equal(second.unchanged.length, 2);
  assert.deepEqual(client.writes, []);
});

test("a completed lifecycle is preserved with no writes", async () => {
  const item = proposal("mapping-complete");
  const factory = new FakeGitHub();
  const issue = factory.issue({ state: "closed", body: renderCycleBody(item), html_url: "https://github.test/issues/1" });
  const client = new FakeGitHub([issue]);
  const result = await reconcileCycles(client, root, await requestFor(client, [item]), clock);
  assert.equal(result.status, "completed");
  assert.equal(result.preserved[0].reason, "lifecycle-completed-preserved");
  assert.deepEqual(client.writes, []);
});

test("revision drift blocks before writes", async () => {
  const client = new FakeGitHub();
  const result = await reconcileCycles(client, root, {
    schema: "mastery.cycles.reconcile.request/v1",
    expected_revision_token: "stale",
    cycles: [proposal("mapping-a")]
  }, clock);
  assert.equal(result.status, "blocked");
  assert.equal(result.blocked[0].reason, "mastery-revision-drift");
  assert.deepEqual(client.writes, []);
});

test("malformed requests return a versioned failed result", async () => {
  const result = await reconcileCycles(new FakeGitHub(), root, { schema: "wrong" }, clock);
  assert.equal(result.schema, "mastery.cycles.reconcile.result/v1");
  assert.equal(result.status, "failed");
  assert.match(result.failed[0].reason, /^invalid-request:/);
});

test("snapshot includes independently created Learning Cycles", async () => {
  const factory = new FakeGitHub();
  const issue = factory.issue({
    title: "cycle: evaluate production retrieval",
    body: "## Primary capability\n\nCAP-03\n\n## Project lab\n\nhttps://github.com/example/project/issues/42"
  });
  const snapshot = await snapshotCycles(new FakeGitHub([issue]), root, clock);
  assert.equal(snapshot.cycles[0].origin, "mastery-system");
  assert.equal(snapshot.cycles[0].lifecycle, "active");
  assert.equal(snapshot.cycles[0].primary_capability_id, "CAP-03");
});

test("cyclic prerequisites produce scoped blockers and no dependency writes", async () => {
  const client = new FakeGitHub();
  const cycles = [
    proposal("mapping-a", { prerequisite_mapping_keys: ["mapping-b"] }),
    proposal("mapping-b", { prerequisite_mapping_keys: ["mapping-a"] })
  ];
  const result = await reconcileCycles(client, root, await requestFor(client, cycles), clock);
  assert.equal(result.status, "incomplete");
  assert.equal(result.blocked.length, 2);
  assert.equal(client.writes.filter(([kind]) => kind.includes("dependency")).length, 0);
});

test("manual dependencies remain when managed dependencies change", async () => {
  const a = proposal("mapping-a");
  const b = proposal("mapping-b", { prerequisite_mapping_keys: ["mapping-a"] });
  const factory = new FakeGitHub();
  const issueA = factory.issue({ id: 10, number: 10, body: renderCycleBody(a), html_url: "https://github.test/issues/10" });
  const issueB = factory.issue({ id: 11, number: 11, body: renderCycleBody(b), html_url: "https://github.test/issues/11" });
  const manual = factory.issue({ id: 12, number: 12, title: "Manual issue", html_url: "https://github.test/issues/12" });
  const client = new FakeGitHub([issueA, issueB, manual], new Map([[11, [10, 12]]]));
  const desired = [a, proposal("mapping-b")];
  const result = await reconcileCycles(client, root, await requestFor(client, desired), clock);
  assert.equal(result.status, "completed");
  assert.deepEqual([...client.dependencies.get(11)], [12]);
});
