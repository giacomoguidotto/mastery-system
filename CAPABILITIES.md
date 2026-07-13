# Capabilities

This is PMP's durable portfolio registry. It tracks priorities, suitable project labs, assessed status, and links to validated evidence. Active learning cycles and uncommitted ideas belong in GitHub Issues.

## Status scale

- **Not assessed:** no defensible judgment yet.
- **Developing:** evidence shows progress, but the capability is not yet reliable under realistic constraints.
- **Demonstrated:** validated evidence supports independent performance in a realistic project.
- **Transferable:** evidence across contexts supports adapting the capability to unfamiliar situations and guiding others.

## Registry

| ID | Capability | Priority | Candidate project labs | Status | Validated evidence |
| --- | --- | --- | --- | --- | --- |
| CAP-01 | Discover authoritative domain constraints before committing to load-bearing designs | Foundation | Every active project | Not assessed | — |
| CAP-02 | Design and operate cloud-native systems with Kubernetes and infrastructure as code | Highest | Orray; other infrastructure projects | Not assessed | — |
| CAP-03 | Build production agent systems with safe tool use, retrieval where justified, and versioned evaluations | Highest | Tempo; a production-shaped AI service | Not assessed | — |
| CAP-04 | Define observability, SLOs, failure handling, and incident ownership for production services | High | Orray; Tempo; deployed services | Not assessed | — |
| CAP-05 | Design data, retrieval, and distributed workflows with explicit consistency and failure trade-offs | High | Tempo; data-intensive services | Not assessed | — |
| CAP-06 | Turn ambiguous customer needs into an end-to-end technical delivery with measurable acceptance criteria | High | Select per discovery opportunity | Not assessed | — |
| CAP-07 | Choose and operate an appropriate application stack across Node/TypeScript, Postgres/Redis, Ruby, and React Native ecosystems | Supporting | Tempo; matching active projects | Not assessed | — |
| CAP-08 | Diagnose and improve systems at lower levels using profiling, Rust/C++, and performance models where justified | Supporting | Select when a real performance boundary appears | Not assessed | — |
| CAP-09 | Provide architectural direction, reviewable decisions, and mentoring evidence across project work | Supporting | Cross-project | Not assessed | — |

## Project bindings

Project bindings are hypotheses, not curriculum obligations. A project becomes a lab only when it has a real use case that can produce relevant evidence.

| Project | Likely capability surface | Next binding decision |
| --- | --- | --- |
| Orray | CAP-01, CAP-02, CAP-04, CAP-05 | Bind a cycle to a consequential controller or platform-design decision, not generic Kubernetes study. |
| Tempo | CAP-01, CAP-03, CAP-04, CAP-05, CAP-07 | Bind a cycle to the target agentic day-tracker flow; do not optimize around the temporary alarm prototype. |
| Other projects | Any capability with a genuine product seam | Add only when the project supplies a better laboratory than an artificial exercise. |

## Portfolio objective

Develop production-shaped AI service evidence covering tool calling, justified retrieval, versioned evals, OpenTelemetry, durable data, deployment, SLOs, and customer-style delivery. This can emerge from one coherent product or from a small set of projects; product fit decides the boundary.

## Current state

The previous RAG evaluation module was retired during the capability-led refactor. No learning cycle is active until a real project decision is selected and opened as an issue.
