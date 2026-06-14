#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "README.md"
  "AGENTS.md"
  "PROGRAM.md"
  "ROADMAP.md"
  "PROGRESS.md"
  "ARTIFACTS.md"
  "IDEAS.md"
  "CONTEXT.md"
  "LICENSE"
  "SECURITY.md"
  ".github/CONTRIBUTING.md"
  ".github/CODE_OF_CONDUCT.md"
  ".github/CODEOWNERS"
  ".github/PULL_REQUEST_TEMPLATE.md"
  ".github/ISSUE_TEMPLATE/bug_report.md"
  ".github/ISSUE_TEMPLATE/feature_request.md"
  ".github/workflows/ci.yml"
  "templates/MODULE_CONTRACT.md"
  "templates/WEEKLY_REVIEW.md"
  "docs/agents/issue-tracker.md"
  "docs/agents/triage-labels.md"
  "docs/agents/domain.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

if ! grep -q "Personal Mastery Program" README.md; then
  echo "README.md must name Personal Mastery Program" >&2
  exit 1
fi

for file in README.md AGENTS.md .github/CONTRIBUTING.md; do
  if ! grep -q "bash scripts/validate.sh" "$file"; then
    echo "$file must mention the canonical validation command" >&2
    exit 1
  fi
done

while IFS= read -r mission; do
  module_dir="$(dirname "$mission")"
  if [[ ! -f "$module_dir/MODULE_CONTRACT.md" ]]; then
    echo "Module with MISSION.md is missing MODULE_CONTRACT.md: $module_dir" >&2
    exit 1
  fi
  if [[ ! -f "$module_dir/RESOURCES.md" ]]; then
    echo "Module with MISSION.md is missing RESOURCES.md: $module_dir" >&2
    exit 1
  fi
done < <(find tracks -name MISSION.md -type f 2>/dev/null)

echo "PMP repo validation passed."
