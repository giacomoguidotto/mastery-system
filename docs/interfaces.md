# Native interfaces

Mastery System exposes provider-independent JSON interfaces through `main.mjs`.
The capability identifier is stable; each payload declares its own schema major.

## Setup

`node main.mjs setup-mastery-system [check|reconcile]` implements `mastery.setup` and returns
`mastery.setup.result/v1`. `check` writes nothing. `reconcile` may enable GitHub
Issues and converge the five declared triage labels, then performs a fresh check.

## Cycle snapshot

`node main.mjs mastery.cycles.snapshot` returns
`mastery.cycles.snapshot/v1`. Its opaque `revision_token` covers Capability data,
managed Cycle state, and native dependency state. `observed_at` is audit context
and is not part of the revision.

Managed cycles carry a hidden `mastery.cycle/v1` block in their GitHub issue body.
The `mapping_key` is stable identity across proposal, active, completed, declined,
and withdrawn lifecycle states. Titles remain display-only.

## Cycle reconciliation

`node main.mjs mastery.cycles.reconcile --input <path|->` accepts:

```json
{
  "schema": "mastery.cycles.reconcile.request/v1",
  "expected_revision_token": "opaque-token-from-a-fresh-snapshot",
  "cycles": [
    {
      "mapping_key": "mapping:stable-key",
      "title": "Cycle: production agent evaluation",
      "primary_capability_id": "CAP-03",
      "project_ref": "https://github.com/example/project/issues/42",
      "rationale": "Current evidence exposes this learning seam.",
      "prerequisite_mapping_keys": [],
      "desired_lifecycle": "proposal"
    }
  ]
}
```

The result declares `mastery.cycles.reconcile.result/v1`. Revision drift blocks
before writes. Reconciliation creates at most one issue per `mapping_key`, updates
only machine-managed proposal fields, materializes managed native GitHub `blocked
by` edges, and preserves manual edges. Active, completed, and declined lifecycle
states are never reversed. Withdrawal is allowed only from proposal.

After safe independent actions, Mastery System rereads the complete managed issue
graph. Duplicate identities or claimed writes that remain drifted fail the result.
An identical completed rerun reports managed items as unchanged and writes nothing.
