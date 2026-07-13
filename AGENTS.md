# Agent Instructions

This repo is the public control plane for the Personal Mastery Program.

## Source of truth

- Notion contains canonical cross-project context. Check it narrowly when current project context is necessary.
- The Notion `build` page is canonical for shared OSS repo conventions.
- The Notion `Personal Mastery Program` page is canonical for high-level positioning unless this repo has since been intentionally updated.
- Do not write to Notion without explicit approval or copy canonical Notion knowledge into this repo.
- Read `PROGRAM.md`, `CAPABILITIES.md`, `CONTEXT.md`, and relevant accepted ADRs before changing the operating model.
- Agents may teach, plan, examine, and critique. Official docs, standards, textbooks, papers, source code, benchmarks, and observed behavior are the authorities.

## Program model

- `CAPABILITIES.md` is the only durable capability, priority, project-binding, and validated-evidence registry.
- Active Learning Cycles are GitHub Issues created from the learning-cycle template.
- A Project Lab owns its reconnaissance, decisions, issues, ADRs, prototypes, specs, tickets, code, tests, reviews, and operational evidence.
- PMP links to project artifacts and assesses them. Do not copy their content here.
- Teaching is pull-based. Create a lesson or exercise only when a cycle exposes a specific learning gap; do not create permanent module scaffolding by default.
- Keep root docs short and low-churn. Put review history in `reviews/`, active state in issues, and project state in project repos.

## Learning-cycle behavior

1. Bind one primary Capability to a real Project Lab decision or use case.
2. Record the starting diagnostic, knowledge risk, evidence target, and assessment method in the PMP issue.
3. In the project repo, follow its normal shaping-to-delivery workflow.
4. Use `domain-reconnaissance` before settling a high-cost decision involving unfamiliar domain constraints. Trigger it again if implementation or review challenges a load-bearing assumption.
5. Keep the reconnaissance packet and resulting decisions in the project repo.
6. Return to PMP for teaching, oral defense, evidence review, and assessment.
7. Close the cycle. Update `CAPABILITIES.md` only if its priority, binding, status, or validated evidence changed.

Do not make PMP a blocking approval step for routine project work.

## Evidence rules

- Evidence: rough proof that learning or work happened.
- Validated Evidence: checked and worth indexing.
- Public Proof: validated evidence packaged for external readers.

Assess only what the linked evidence supports. Never advance a capability from plans, prose, or unverified agent output alone.

## Weekly review

Start from evidence, not memory:

```sh
git log --oneline --since="1 week ago"
git diff --stat HEAD@{1.week.ago}..HEAD 2>/dev/null || true
git status --short
```

Then inspect open learning-cycle issues and the linked project commits, decisions, tests, deployments, or reviews. Create `reviews/YYYY-MM-DD.md` from the template. Update `CAPABILITIES.md` only when the review changes a durable judgment.

## Repository operations

- Use Conventional Commits.
- Run `bash scripts/validate.sh` before claiming the repo is validated.
- When an agent completes a review, assessment, lesson, or capability-registry change, validate, stage only the intended files, commit, and push unless the user explicitly asks to keep the work local.
- Project artifacts follow the owning project's publication rules.

## Agent skills

- Issues and PRDs use GitHub Issues. See `docs/agents/issue-tracker.md`.
- Use the five-label vocabulary in `docs/agents/triage-labels.md`.
- Read the domain guidance in `docs/agents/domain.md`.
