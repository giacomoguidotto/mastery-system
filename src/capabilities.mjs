import { readFile } from "node:fs/promises";

const STATUS_VALUES = new Set(["Not assessed", "Developing", "Demonstrated", "Transferable"]);

function priorityRank(priority) {
  const normalized = priority.trim().toLowerCase();
  const ranks = { highest: 10, high: 20, foundation: 30, supporting: 40 };
  return ranks[normalized] ?? 100;
}

export async function readCapabilities(root) {
  const text = await readFile(`${root}/CAPABILITIES.md`, "utf8");
  const capabilities = [];
  for (const line of text.split("\n")) {
    if (!/^\| CAP-[^|]+\|/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map(cell => cell.trim());
    const [capability_id, label, priority_key, , capability_status] = cells;
    if (!STATUS_VALUES.has(capability_status)) {
      throw new Error(`Unknown Capability Status for ${capability_id}: ${capability_status}`);
    }
    capabilities.push({ capability_id, label, priority_key, priority_rank: priorityRank(priority_key), capability_status });
  }
  if (capabilities.length === 0) throw new Error("CAPABILITIES.md contains no Capability records");
  return capabilities;
}
