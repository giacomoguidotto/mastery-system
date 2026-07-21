# Standalone Mastery System Interfaces

![Status: Accepted](https://img.shields.io/badge/status-accepted-brightgreen)

Status: Accepted
Date: 2026-07-21
Supersedes: 0002-capability-led-project-grounded-program.md
Superseded by: None

## Decision

Mastery System is the canonical public identity and remains usable without
Agentic OS. It owns Capability and Cycle semantics, setup, revisioned Cycle
snapshots, and Cycle reconciliation through stable native capabilities.
The capability-led, project-grounded boundary remains: Project Labs own delivery
artifacts while Mastery System links and assesses their evidence.

Setup exposes read-only `check` and idempotent `reconcile` modes. Cycle Proposal
identity is a stable external `mapping_key`. Reconciliation writes only managed
proposal state and managed native dependency edges. Human lifecycle decisions and
manual dependency edges are preserved.

## Consequences

- `mastery.setup`, `mastery.cycles.snapshot`, and `mastery.cycles.reconcile` are
  independently versioned native interfaces.
- A fresh revision token is required before reconciliation.
- Active, completed, and declined cycles are never reversed automatically.
- A completed identical rerun changes no issue or dependency state.
- Cross-system selection and ranking remain outside Mastery System.
