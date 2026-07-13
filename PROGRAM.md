# Program

## Mission

Build graduate-level, publicly auditable capability for AI-native backend and product systems work. Use real projects as laboratories, and use PMP as the control plane for priorities, teaching, and assessment.

A formal Master's remains optional. The immediate goal is stronger judgment and production evidence, not curriculum completion for its own sake.

## Operating model

PMP has five core objects:

- **Capability:** a durable ability worth demonstrating across more than one task or project.
- **Learning Cycle:** a temporary, bounded effort to improve or assess one capability through a real decision or use case.
- **Project Lab:** an external project where the decision, implementation, and operational consequences are real.
- **Evidence:** a link to observable work in its owning project.
- **Assessment:** PMP's explicit judgment of what that evidence demonstrates.

Capabilities outlive cycles. Cycles close. Project artifacts stay in project repos. PMP stores links and judgments, not copies.

## The loop

1. Choose a capability gap and a timely project seam.
2. Open a PMP learning-cycle issue using the issue template.
3. Diagnose the starting level and define evidence that could change the assessment.
4. Work in the project repo using its normal shaping and delivery flow.
5. Before settling a high-cost domain decision, run domain reconnaissance against primary authorities. Reopen it later if implementation or review invalidates a load-bearing assumption.
6. Pull in teaching, exercises, or prototypes only when they resolve a demonstrated gap.
7. Review the project evidence, record the assessment in the cycle, and close it.
8. Update [CAPABILITIES.md](./CAPABILITIES.md) only when priority, project mapping, or assessed status changes.

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

## Portfolio strategy

The highest-leverage target is production-shaped work that combines several current gaps without forcing unrelated technology into one project. Strong evidence may span multiple projects.

Prioritize:

1. cloud, Kubernetes, and infrastructure as code
2. production agents, tool calling, retrieval, and evaluation
3. technical discovery and end-to-end delivery
4. observability, SLOs, and incident ownership
5. data, retrieval, and distributed-systems depth
6. target ecosystems, domain fluency, performance engineering, and senior-scope evidence

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

- **Evidence:** rough proof that learning or work happened.
- **Validated Evidence:** checked against tests, sources, benchmarks, operational behavior, or review and worth indexing.
- **Public Proof:** validated evidence packaged for an external audience.

Public proof is optional. Validated evidence is required for a capability assessment to advance.

## Cadence

The working budget is 15-20 focused hours per week. Reviews start from Git history and linked project evidence, not memory. Most weeks should advance one dominant cycle; supporting study is pulled in only when it helps that cycle.
