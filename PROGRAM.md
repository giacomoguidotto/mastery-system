# Program

## Mission

Build graduate-level, publicly auditable capability for AI-native backend and product systems work. Use real projects as laboratories, and use PMP as the control plane for priorities, teaching, and assessment.

A formal Master's remains optional. The immediate goal is stronger judgment and production evidence, not curriculum completion for its own sake.

## Operating model

PMP coordinates Capabilities, Learning Cycles, Project Labs, Evidence, and Assessments as defined in [CONTEXT.md](./CONTEXT.md).

Capabilities outlive cycles. Cycles close. Project artifacts stay in project repos. PMP stores links and judgments, not copies.

## The loop

A cycle diagnoses a gap, binds it to a real project seam, and defines evidence that could change an assessment. Work then follows the owning project's normal shaping and delivery flow. Teaching and prototypes are pulled in only when they resolve a demonstrated gap. The executable agent workflow lives in [AGENTS.md](./AGENTS.md).

## Project boundary

PMP owns:

- capability strategy and career-gap priorities
- project-to-capability mapping
- diagnostics, teaching, oral defense, and assessment
- the curated index of validated evidence

Each project repo owns:

- product direction and use cases
- reconnaissance packets and design decisions
- issues, ADRs, prototypes, specs, tickets, code, tests, and reviews
- deployment and operational evidence

The project agent follows the project's existing workflow. PMP does not become an approval service for routine engineering decisions.

For active project labs, add this thin instruction to the project's agent guidance:

> Before settling a high-cost decision involving unfamiliar domain constraints, use `domain-reconnaissance` and treat its decision packet as input to shaping. Trigger it again if implementation or review reveals that a load-bearing assumption may be wrong. Keep the decision and all downstream artifacts in this project.

A candidate project becomes an active Project Lab only when this instruction is installed in that project and a PMP Learning Cycle links to the owning project issue. Candidate mappings alone do not activate PMP behavior.

## Portfolio strategy

The highest-leverage target is production-shaped work that combines several current gaps without forcing unrelated technology into one project. Strong evidence may span multiple projects.

The current ordering and project hypotheses live only in [CAPABILITIES.md](./CAPABILITIES.md).

Select technology because the product and domain require it. A résumé checkbox is not sufficient justification.

## Assessment

Assessment asks whether linked evidence demonstrates the capability under realistic constraints. Depending on the capability, use some combination of:

- oral defense or closed-book explanation
- design review and trade-off analysis
- implementation or debugging task
- benchmark, eval, or operational observation
- incident exercise or failure analysis
- external review or project integration

An artifact can be useful without changing the assessed status. Claims should be narrower than the evidence, never broader.

## Evidence levels

Use the evidence levels defined in [CONTEXT.md](./CONTEXT.md). Public Proof is optional. Validated Evidence is required for a Capability assessment to advance.

## Cadence

The working budget is 15-20 focused hours per week. Reviews start from Git history and linked project evidence, not memory. Most weeks should advance one dominant cycle; supporting study is pulled in only when it helps that cycle.
