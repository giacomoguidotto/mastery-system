#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "README.md"
  "AGENTS.md"
  "PROGRAM.md"
  "CAPABILITIES.md"
  "CONTEXT.md"
  "main.mjs"
  "package.json"
  "LICENSE"
  "SECURITY.md"
  ".github/CONTRIBUTING.md"
  ".github/CODE_OF_CONDUCT.md"
  ".github/CODEOWNERS"
  ".github/PULL_REQUEST_TEMPLATE.md"
  ".github/ISSUE_TEMPLATE/bug_report.md"
  ".github/ISSUE_TEMPLATE/feature_request.md"
  ".github/ISSUE_TEMPLATE/learning_cycle.md"
  ".github/workflows/ci.yml"
  ".github/workflows/release.yml"
  "scripts/bump-version.sh"
  "templates/WEEKLY_REVIEW.md"
  "docs/agents/issue-tracker.md"
  "docs/agents/triage-labels.md"
  "docs/agents/domain.md"
  "docs/interfaces.md"
  "docs/adr/0002-capability-led-project-grounded-program.md"
  "docs/adr/0003-standalone-mastery-system-interfaces.md"
  "skills/public/setup-mastery-system/SKILL.md"
  "skills/public/setup-mastery-system/resources/setup.mjs"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

retired_files=(
  "ROADMAP.md"
  "PROGRESS.md"
  "ARTIFACTS.md"
  "IDEAS.md"
  "templates/MODULE_CONTRACT.md"
)

for file in "${retired_files[@]}"; do
  if [[ -e "$file" ]]; then
    echo "Retired duplicate control file was reintroduced: $file" >&2
    exit 1
  fi
done

if ! grep -q "Mastery System" README.md; then
  echo "README.md must name Mastery System" >&2
  exit 1
fi

if ! grep -q "scripts/bump-version.sh" .github/workflows/release.yml; then
  echo "Release workflow must use the independent version script" >&2
  exit 1
fi

if ! grep -q "gh release create" .github/workflows/release.yml; then
  echo "Release workflow must publish a stable GitHub release" >&2
  exit 1
fi

if ! grep -q -- "--verify-tag" .github/workflows/release.yml; then
  echo "Release workflow must verify the source tag before publication" >&2
  exit 1
fi

for file in README.md AGENTS.md .github/CONTRIBUTING.md; do
  if ! grep -q "bash scripts/validate.sh" "$file"; then
    echo "$file must mention the canonical validation command" >&2
    exit 1
  fi
done

if find tracks -type f -print -quit 2>/dev/null | grep -q .; then
  echo "Permanent track/module workspaces are retired; use Learning Cycle issues" >&2
  exit 1
fi

node --test

echo "Mastery System repo validation passed."
