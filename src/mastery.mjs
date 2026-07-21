import { createHash } from "node:crypto";
import { readCapabilities } from "./capabilities.mjs";
import { parseCycleMetadata, renderCycleBody } from "./metadata.mjs";

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}

function token(value) {
  return createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}

function lifecycleOf(issue, metadata) {
  if (["active", "completed", "declined", "withdrawn"].includes(metadata.lifecycle)) return metadata.lifecycle;
  return issue.state === "closed" ? "completed" : "proposal";
}

async function readState(client, root) {
  const capabilities = await readCapabilities(root);
  const issues = (await client.listIssues()).filter(issue => !issue.pull_request);
  const managed = [];
  const cycles = [];
  for (const issue of issues) {
    const metadata = parseCycleMetadata(issue.body);
    if (!metadata && !/^cycle:/i.test(issue.title)) continue;
    const dependencies = await client.listBlockedBy(issue.number);
    if (!metadata) {
      const capability = issue.body.match(/CAP-\d+/)?.[0] ?? null;
      const project_ref = issue.body.match(/https:\/\/github\.com\/[^\s)]+/)?.[0] ?? null;
      cycles.push({
        issue_ref: issue.html_url,
        origin: "mastery-system",
        lifecycle: issue.state === "closed" ? "completed" : "active",
        primary_capability_id: capability,
        project_ref,
        dependencies: dependencies.map(value => value.html_url).sort()
      });
      continue;
    }
    managed.push({
      issue,
      metadata,
      record: {
        issue_ref: issue.html_url,
        origin: metadata.origin,
        mapping_key: metadata.mapping_key,
        lifecycle: lifecycleOf(issue, metadata),
        primary_capability_id: metadata.primary_capability_id,
        project_ref: metadata.project_ref,
        dependencies: dependencies.map(value => value.html_url).sort()
      }
    });
  }
  managed.sort((a, b) => a.metadata.mapping_key.localeCompare(b.metadata.mapping_key));
  cycles.push(...managed.map(value => value.record));
  cycles.sort((a, b) => a.issue_ref.localeCompare(b.issue_ref));
  const issue_revisions = issues
    .filter(issue => cycles.some(cycle => cycle.issue_ref === issue.html_url))
    .map(issue => ({ id: issue.id, updated_at: issue.updated_at }))
    .sort((a, b) => a.id - b.id);
  const revision_token = token({ capabilities, cycles, issue_revisions });
  return { capabilities, managed, cycles, revision_token };
}

export async function snapshotCycles(client, root, clock = () => new Date()) {
  const state = await readState(client, root);
  return {
    schema: "mastery.cycles.snapshot/v1",
    capability: "mastery.cycles.snapshot",
    revision_token: state.revision_token,
    observed_at: clock().toISOString(),
    capabilities: state.capabilities,
    cycles: state.cycles
  };
}

function validateRequest(request) {
  if (request?.schema !== "mastery.cycles.reconcile.request/v1") throw new Error("Unsupported reconcile request schema");
  if (typeof request.expected_revision_token !== "string") throw new Error("expected_revision_token is required");
  if (!Array.isArray(request.cycles)) throw new Error("cycles must be an array");
  const seen = new Set();
  for (const item of request.cycles) {
    if (!item.mapping_key || seen.has(item.mapping_key)) throw new Error(`Duplicate or missing mapping_key: ${item.mapping_key ?? ""}`);
    seen.add(item.mapping_key);
    if (!item.primary_capability_id || !item.project_ref || !item.title) throw new Error(`Incomplete cycle ${item.mapping_key}`);
    if (!(["proposal", "withdrawn"].includes(item.desired_lifecycle ?? "proposal"))) throw new Error(`Invalid desired_lifecycle for ${item.mapping_key}`);
  }
}

function resultItem(item, issue, reason) {
  return { mapping_key: item.mapping_key, issue_ref: issue?.html_url ?? null, reason };
}

function cyclicMappingKeys(items) {
  const graph = new Map(items.map(item => [item.mapping_key, (item.prerequisite_mapping_keys ?? []).filter(key => items.some(candidate => candidate.mapping_key === key))]));
  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  const cyclic = new Set();
  function visit(key) {
    if (visiting.has(key)) {
      const start = stack.indexOf(key);
      for (const member of stack.slice(start)) cyclic.add(member);
      return;
    }
    if (visited.has(key)) return;
    visiting.add(key);
    stack.push(key);
    for (const dependency of graph.get(key) ?? []) visit(dependency);
    stack.pop();
    visiting.delete(key);
    visited.add(key);
  }
  for (const key of graph.keys()) visit(key);
  return cyclic;
}

export async function reconcileCycles(client, root, request, clock = () => new Date()) {
  const result = { schema: "mastery.cycles.reconcile.result/v1", capability: "mastery.cycles.reconcile", status: "completed", created: [], updated: [], unchanged: [], withdrawn: [], preserved: [], blocked: [], failed: [] };
  try {
    validateRequest(request);
  } catch (error) {
    result.status = "failed";
    result.failed.push({ mapping_key: null, issue_ref: null, reason: `invalid-request:${error.message}` });
    result.revision_token = null;
    result.observed_at = clock().toISOString();
    return result;
  }
  let state = await readState(client, root);
  if (state.revision_token !== request.expected_revision_token) {
    result.status = "blocked";
    result.blocked.push({ mapping_key: null, issue_ref: null, reason: "mastery-revision-drift" });
    result.revision_token = state.revision_token;
    result.observed_at = clock().toISOString();
    return result;
  }

  const capabilityIds = new Set(state.capabilities.map(value => value.capability_id));
  const cyclic = cyclicMappingKeys(request.cycles);
  const byKey = new Map();
  for (const value of state.managed) {
    if (byKey.has(value.metadata.mapping_key)) {
      result.failed.push({ mapping_key: value.metadata.mapping_key, issue_ref: value.issue.html_url, reason: "duplicate-managed-mapping-key" });
    } else byKey.set(value.metadata.mapping_key, value);
  }
  if (result.failed.length) {
    result.status = "failed";
    result.revision_token = state.revision_token;
    result.observed_at = clock().toISOString();
    return result;
  }

  for (const item of request.cycles) {
    let current = byKey.get(item.mapping_key);
    if (!capabilityIds.has(item.primary_capability_id)) {
      result.blocked.push(resultItem(item, current?.issue, "unknown-capability"));
      continue;
    }
    const desired = item.desired_lifecycle ?? "proposal";
    if (!current && desired === "withdrawn") {
      result.unchanged.push(resultItem(item, null, "proposal-absent"));
      continue;
    }
    if (!current) {
      const issue = await client.createIssue({ title: item.title, body: renderCycleBody(item) });
      current = { issue, metadata: parseCycleMetadata(issue.body), record: { lifecycle: "proposal" } };
      byKey.set(item.mapping_key, current);
      result.created.push(resultItem(item, issue, "proposal-created"));
      continue;
    }
    current.previousManagedPrerequisiteKeys = [...(current.metadata.managed_prerequisite_mapping_keys ?? [])];
    const lifecycle = lifecycleOf(current.issue, current.metadata);
    if (["active", "completed", "declined"].includes(lifecycle)) {
      result.preserved.push(resultItem(item, current.issue, `lifecycle-${lifecycle}-preserved`));
      continue;
    }
    if (desired === "withdrawn") {
      if (lifecycle === "withdrawn") result.unchanged.push(resultItem(item, current.issue, "already-withdrawn"));
      else {
        const body = renderCycleBody(item, "withdrawn", current.issue.body);
        current.issue = await client.updateIssue(current.issue.number, { body, state: "closed" });
        current.metadata = parseCycleMetadata(body);
        result.withdrawn.push(resultItem(item, current.issue, "proposal-withdrawn"));
      }
      continue;
    }
    const recoveryKeys = [...new Set([
      ...(current.metadata.managed_prerequisite_mapping_keys ?? []),
      ...(item.prerequisite_mapping_keys ?? [])
    ])].sort();
    const body = renderCycleBody({ ...item, prerequisite_mapping_keys: recoveryKeys }, "proposal", current.issue.body);
    const changed = current.issue.title !== item.title || current.issue.body !== body;
    if (changed) {
      current.issue = await client.updateIssue(current.issue.number, { title: item.title, body });
      current.metadata = parseCycleMetadata(body);
      result.updated.push(resultItem(item, current.issue, "managed-fields-updated"));
    } else result.unchanged.push(resultItem(item, current.issue, "already-converged"));
  }

  for (const item of request.cycles) {
    const current = byKey.get(item.mapping_key);
    if (!current || lifecycleOf(current.issue, current.metadata) !== "proposal") continue;
    if (cyclic.has(item.mapping_key)) {
      result.blocked.push(resultItem(item, current.issue, "cyclic-prerequisite-graph"));
      continue;
    }
    const desiredKeys = new Set();
    let blocked = false;
    for (const key of item.prerequisite_mapping_keys ?? []) {
      const prerequisite = byKey.get(key);
      if (!prerequisite) {
        result.blocked.push(resultItem(item, current.issue, `missing-prerequisite:${key}`));
        blocked = true;
      } else if (["declined", "withdrawn"].includes(lifecycleOf(prerequisite.issue, prerequisite.metadata))) {
        result.blocked.push(resultItem(item, current.issue, `terminal-prerequisite:${key}`));
        blocked = true;
      } else if (lifecycleOf(prerequisite.issue, prerequisite.metadata) !== "completed") desiredKeys.add(key);
    }
    if (blocked) continue;
    const actual = await client.listBlockedBy(current.issue.number);
    const managedBefore = new Set(current.metadata.managed_prerequisite_mapping_keys ?? []);
    const byIssueId = new Map([...byKey.values()].map(value => [value.issue.id, value]));
    try {
      for (const dependency of actual) {
        const dependencyCycle = byIssueId.get(dependency.id);
        if (dependencyCycle && managedBefore.has(dependencyCycle.metadata.mapping_key) && !desiredKeys.has(dependencyCycle.metadata.mapping_key)) {
          await client.removeDependency(current.issue.number, dependency.id);
        }
      }
      const actualIds = new Set(actual.map(value => value.id));
      for (const key of desiredKeys) {
        const prerequisite = byKey.get(key);
        if (!actualIds.has(prerequisite.issue.id)) await client.addDependency(current.issue.number, prerequisite.issue.id);
      }
    } catch (error) {
      result.failed.push(resultItem(item, current.issue, `dependency-write-failed:${error.message}`));
      continue;
    }
    const verified = await client.listBlockedBy(current.issue.number);
    const verifiedManagedKeys = new Set(verified
      .map(dependency => byIssueId.get(dependency.id)?.metadata.mapping_key)
      .filter(key => key && managedBefore.has(key)));
    const expectedManagedKeys = [...desiredKeys].sort();
    if (JSON.stringify([...verifiedManagedKeys].sort()) !== JSON.stringify(expectedManagedKeys)) {
      result.failed.push(resultItem(item, current.issue, "dependency-post-check-drift"));
      continue;
    }
    const finalBody = renderCycleBody(item, "proposal", current.issue.body);
    if (finalBody !== current.issue.body) {
      current.issue = await client.updateIssue(current.issue.number, { body: finalBody });
      current.metadata = parseCycleMetadata(finalBody);
      if (!result.created.some(value => value.mapping_key === item.mapping_key) && !result.updated.some(value => value.mapping_key === item.mapping_key)) {
        result.unchanged = result.unchanged.filter(value => value.mapping_key !== item.mapping_key);
        result.updated.push(resultItem(item, current.issue, "managed-dependencies-updated"));
      }
    }
  }

  const finalState = await readState(client, root);
  const duplicates = new Set();
  const finalKeys = new Set();
  for (const value of finalState.managed) {
    if (finalKeys.has(value.metadata.mapping_key)) duplicates.add(value.metadata.mapping_key);
    finalKeys.add(value.metadata.mapping_key);
  }
  if (duplicates.size) {
    result.failed.push(...[...duplicates].map(mapping_key => ({ mapping_key, issue_ref: null, reason: "duplicate-managed-mapping-key-post-check" })));
    result.status = "failed";
  } else {
    const finalByKey = new Map(finalState.managed.map(value => [value.metadata.mapping_key, value]));
    for (const item of request.cycles) {
      const final = finalByKey.get(item.mapping_key);
      if (!final) {
        if ((item.desired_lifecycle ?? "proposal") !== "withdrawn" && !result.blocked.some(value => value.mapping_key === item.mapping_key)) {
          result.failed.push(resultItem(item, null, "post-check-missing-cycle"));
        }
        continue;
      }
      const lifecycle = lifecycleOf(final.issue, final.metadata);
      const wasPreserved = result.preserved.some(value => value.mapping_key === item.mapping_key);
      if (!wasPreserved) {
        const desired = item.desired_lifecycle ?? "proposal";
        const metadataMatches = final.metadata.primary_capability_id === item.primary_capability_id
          && final.metadata.project_ref === item.project_ref
          && JSON.stringify(final.metadata.managed_prerequisite_mapping_keys ?? []) === JSON.stringify([...(item.prerequisite_mapping_keys ?? [])].sort());
        if (lifecycle !== desired || !metadataMatches) result.failed.push(resultItem(item, final.issue, "post-check-managed-state-drift"));
      }
      if (lifecycle === "proposal" && !result.blocked.some(value => value.mapping_key === item.mapping_key)) {
        const finalDependencyRefs = new Set(final.record.dependencies);
        for (const key of item.prerequisite_mapping_keys ?? []) {
          const prerequisite = finalByKey.get(key);
          if (prerequisite && !["completed", "declined", "withdrawn"].includes(lifecycleOf(prerequisite.issue, prerequisite.metadata)) && !finalDependencyRefs.has(prerequisite.issue.html_url)) {
            result.failed.push(resultItem(item, final.issue, `post-check-missing-dependency:${key}`));
          }
        }
      }
    }
    if (result.failed.length) result.status = "failed";
    else if (result.blocked.length) result.status = result.created.length || result.updated.length || result.withdrawn.length ? "incomplete" : "blocked";
  }
  result.revision_token = finalState.revision_token;
  result.observed_at = clock().toISOString();
  return result;
}
