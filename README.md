<p align="center">
  <img src="assets/logo.svg" alt="Mastery System logo" width="160" />
</p>

<h1 align="center">Mastery System</h1>

<p align="center">
  <strong>A capability system grounded in real software projects.</strong><br>
  <sub>Learn what a consequential design decision requires, apply it in its owning project, then assess the evidence.</sub>
</p>

<p align="center">
  <a href="https://github.com/giacomoguidotto/mastery-system/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/giacomoguidotto/mastery-system/actions/workflows/ci.yml/badge.svg"></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

## Purpose

Mastery System builds graduate-level engineering capability without separating study from real work. Agents help plan, research, teach, examine, and critique. Official documentation, textbooks, papers, source code, benchmarks, and observed system behavior remain the authorities.

The program is career-directed, but capability comes before portfolio theater. Its current center of gravity is AI-native backend and product systems: cloud platforms, production agents, reliability, data systems, and technical delivery.

## How it works

Mastery System binds a durable Capability to timely work in a Project Lab, then assesses the evidence produced there. The detailed operating model lives in [PROGRAM.md](./PROGRAM.md); agent execution rules live in [AGENTS.md](./AGENTS.md).

Mastery System does not copy project documentation or require a permanent course workspace for every learning need.

## Standalone interfaces

No Agentic OS checkout is required.

```sh
node main.mjs setup-mastery-system check
node main.mjs setup-mastery-system reconcile
node main.mjs mastery.cycles.snapshot
node main.mjs mastery.cycles.reconcile --input request.json
```

Setup is read-only in `check` mode and safely reconciles only repository issue
settings and declared triage labels in `reconcile` mode. The native Cycle
interfaces return revisioned, capability-scoped JSON. See
[docs/interfaces.md](./docs/interfaces.md) for their contracts.

## Repo map

- [PROGRAM.md](./PROGRAM.md): stable mission, operating model, and boundaries.
- [CAPABILITIES.md](./CAPABILITIES.md): priorities, project bindings, and assessed evidence.
- [CONTEXT.md](./CONTEXT.md): canonical program vocabulary.
- [reviews/](./reviews/): Git-backed review and assessment decisions.
- [GitHub Issues](https://github.com/giacomoguidotto/mastery-system/issues): active Learning Cycles and proposed changes.

## Validation

```sh
bash scripts/validate.sh
```

## Release model

Mastery System uses Conventional Commits and independent semantic-version
releases. Release versions identify immutable source provenance and do not
assert compatibility with other Systems.

See [.github/CONTRIBUTING.md](./.github/CONTRIBUTING.md) for contribution boundaries.
