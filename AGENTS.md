# Agent Instructions

This repo is the public operating system for the Personal Mastery Program.

## Source of truth

- Notion contains canonical cross-project context. Check it narrowly when the request clearly needs current project conventions.
- The Notion `build` page is canonical for shared OSS repo conventions.
- The Notion `Personal Mastery Program` page is canonical for high-level positioning unless this repo has since been intentionally updated.
- Do not write to Notion without explicit approval.
- In this repo, agents are teachers, planners, examiners, and critics. Textbooks, university courses, papers, official docs, source code, benchmarks, and project behavior are the authorities.

## Program rules

- Optimize for capability first and legibility second.
- Keep docs short, agent-operational, and easy to update.
- Use Conventional Commits for all commits.
- Run `bash scripts/validate.sh` before claiming the repo is validated.
- Treat public output as evidence, not performance theater.
- Keep root docs low-churn: track phases, active modules, weekly review outcomes, validated artifacts, and public proof. Do not mirror lesson-level progress in root files.
- Publish progress before ending: when an agent creates a lesson, learning record, reference page, or other concrete progress artifact, run validation, stage the intended files, commit with a Conventional Commit, and push. Do not leave completed work merely staged or local unless the user explicitly asks for that.
- Distinguish artifact levels:
  - Evidence: rough proof that learning happened.
  - Validated artifact: checked and worth indexing.
  - Public proof: polished enough to show externally.

## `/teach` overlay

When `/teach` is used inside a PMP module workspace:

1. Ensure `MODULE_CONTRACT.md` exists before normal `/teach` lesson work begins.
2. If it is missing, interview briefly and create it from `templates/MODULE_CONTRACT.md`.
3. Then create or update the normal `/teach` files: `MISSION.md`, `RESOURCES.md`, `lessons/`, `reference/`, `learning-records/`, and `NOTES.md`.
4. Keep one coherent mission per module workspace.
5. Lessons must be grounded in named sources from `RESOURCES.md`.
6. The module exam or assessment mix must follow the module contract, not a universal template.

## Weekly review

Weekly reviews start from Git history, not memory.

Use:

```sh
git log --oneline --since="1 week ago"
git diff --stat HEAD@{1.week.ago}..HEAD 2>/dev/null || true
git status --short
```

Then update `reviews/YYYY-MM-DD.md`, `PROGRESS.md`, and `ROADMAP.md` as needed. Update `ARTIFACTS.md` only when there is a new validated artifact or public proof.

## Agent skills

### Issue tracker

Issues and PRDs live in this repo's GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo: read root `CONTEXT.md` and relevant ADRs in `docs/adr/`. See `docs/agents/domain.md`.
