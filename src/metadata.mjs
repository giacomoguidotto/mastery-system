const START = "<!-- mastery-cycle:v1";
const END = "mastery-cycle:end -->";

export function parseCycleMetadata(body = "") {
  const start = body.indexOf(START);
  const end = body.indexOf(END, start);
  if (start === -1 || end === -1) return null;
  const raw = body.slice(start + START.length, end).trim();
  try {
    const value = JSON.parse(raw);
    if (value.schema !== "mastery.cycle/v1" || typeof value.mapping_key !== "string") return null;
    return value;
  } catch {
    return null;
  }
}

export function renderCycleBody(item, lifecycle = "proposal", issueBody = "") {
  const metadata = {
    schema: "mastery.cycle/v1",
    origin: "agentic-os.upskill",
    mapping_key: item.mapping_key,
    lifecycle,
    primary_capability_id: item.primary_capability_id,
    project_ref: item.project_ref,
    managed_prerequisite_mapping_keys: [...(item.prerequisite_mapping_keys ?? [])].sort()
  };
  const block = `${START}\n${JSON.stringify(metadata)}\n${END}`;
  const existing = parseCycleMetadata(issueBody);
  if (!existing) return `${block}\n\n## Why now\n\n${item.rationale ?? "Proposed from an approved Upskill Mapping."}\n`;
  const start = issueBody.indexOf(START);
  const end = issueBody.indexOf(END, start) + END.length;
  return `${issueBody.slice(0, start)}${block}${issueBody.slice(end)}`;
}
