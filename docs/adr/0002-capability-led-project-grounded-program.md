# Capability-Led, Project-Grounded Program

![Status: Accepted](https://img.shields.io/badge/status-accepted-brightgreen)

Status: Accepted
Date: 2026-07-13
Supersedes: 0001-public-program-operating-system.md
Superseded by: None

## Decision

PMP is a public, capability-led portfolio control plane. Durable Capabilities replace permanent curriculum Modules as the main organizing unit. Temporary Learning Cycles bind a Capability to a real decision or use case in an external Project Lab.

PMP owns priorities, project mappings, teaching, and assessment. Each project repo owns reconnaissance, design, delivery, and operational artifacts. PMP records links and evidence-bounded judgments instead of copying project material.

## Rationale

Permanent module workspaces duplicate missions, sources, progress, and evidence while separating learning from the decisions where knowledge matters. That creates maintenance cost and drift without guaranteeing better judgment.

Real projects expose consequential constraints and produce stronger evidence. A separate program layer is still useful for choosing which abilities matter, diagnosing knowledge gaps, and assessing whether project work demonstrates them.

## Consequences

- `CAPABILITIES.md` is the sole durable registry for priorities, project bindings, assessed status, and validated evidence.
- Active Learning Cycles live as GitHub Issues and close when their assessment is complete.
- Specs, ADRs, code, tests, benchmarks, deployments, and incident evidence remain in their owning project.
- Domain reconnaissance occurs before high-cost unfamiliar decisions and may reopen when later work invalidates an assumption.
- Lessons and exercises are created on demand, not as mandatory permanent scaffolds.
- The former RAG evaluation module and the track hierarchy are retired.
- Public proof remains useful, but capability and validated evidence remain primary.
