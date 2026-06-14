<p align="center"><em>Logo slot: add <code>assets/logo.svg</code> when the identity settles.</em></p>

<h1 align="center">Personal Mastery Program</h1>

<p align="center"><strong>A self-directed graduate-level curriculum tailored to your goals.</strong></p>

<p align="center">
  Current track: CS/AI Systems for AI-native backend and product infrastructure engineering.
</p>

<p align="center">
  <a href="https://github.com/giacomoguidotto/personal-mastery-program/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/giacomoguidotto/personal-mastery-program/actions/workflows/ci.yml/badge.svg"></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

## Why this exists

Personal Mastery Program is a public training system for building graduate-level capability without treating a degree as the only valid path. It uses agents as tutors, planners, examiners, and critics, while grounding the curriculum in textbooks, university courses, papers, official docs, source code, benchmarks, and real projects.

The first track, CS/AI Systems, is aimed at becoming an AI-native software engineer who can build and operate serious backend systems for LLM and agentic products.

## What this is not

This is not an accredited credential, a content course, or a promise that private studying is enough. The program only works if it produces evidence: repositories, demos, essays, benchmarks, reproductions, pull requests, architecture notes, and project milestones.

## Operating model

- Capability first, legibility second.
- Agents teach and examine; sources are authorities.
- Every module produces evidence, but not every module has to become public performance.
- Module work happens in small `/teach` workspaces with explicit contracts.
- Program-level progress is reviewed from the Git delta.

## Current structure

- [PROGRAM.md](./PROGRAM.md) defines the mission, principles, scope, and constraints.
- [ROADMAP.md](./ROADMAP.md) tracks active phases, tracks, and candidate modules.
- [PROGRESS.md](./PROGRESS.md) records module progress and weekly review outcomes.
- [ARTIFACTS.md](./ARTIFACTS.md) indexes public proof and validated evidence.
- [IDEAS.md](./IDEAS.md) captures future tracks, essays, modules, and experiments.
- [CONTEXT.md](./CONTEXT.md) defines the domain language agents should use.

## Validation

Run the canonical local check before claiming the repo is valid:

```sh
bash scripts/validate.sh
```

CI runs the same validation command.

## Contributing

This is primarily a personal curriculum in public, reusable second. Suggestions are welcome when they improve the training system, evidence quality, source quality, or reproducibility. See [.github/CONTRIBUTING.md](./.github/CONTRIBUTING.md).
