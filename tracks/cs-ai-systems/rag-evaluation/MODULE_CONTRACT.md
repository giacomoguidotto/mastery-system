# Module Contract: RAG Evaluation for Program Docs

## Capability

I can build a small, reproducible RAG evaluation harness for a known document corpus, define expected answers and failure categories, run retrieval and answer-quality experiments, and explain which failures come from retrieval, chunking, prompting, generation, or missing source material.

The first corpus is this PMP repo's own program docs: `AGENTS.md`, `PROGRAM.md`, `ROADMAP.md`, `CONTEXT.md`, `PROGRESS.md`, and `ARTIFACTS.md`.

## Prerequisites

Must already know:

- Basic Python scripting.
- Basic command-line workflow.
- Basic meaning of embeddings, retrieval, and LLM prompting.

Learn just in time:

- RAG evaluation vocabulary: context precision, context recall, context relevancy, answer relevancy, faithfulness, groundedness, and answer correctness.
- The difference between retrieval evaluation, generation evaluation, and end-to-end RAG evaluation.
- How curated datasets, reference answers, LLM-as-judge metrics, and manual error labels complement each other.
- Current practical tooling for LLM/RAG evals.

## Outputs

- A tiny PMP-docs evaluation dataset with questions, expected facts, expected source files, and failure labels.
- A transparent baseline Python harness that loads docs, chunks them, retrieves candidate chunks, records outputs, and emits repeatable results.
- A DeepEval integration using the same or closely related dataset.
- A failure taxonomy for the observed errors.
- A short tool tradeoff note comparing DeepEval, Ragas, Phoenix, LangSmith, and Langfuse for this module's use case.
- A written synthesis explaining what the harness can and cannot prove.

## Sources

Mirror these into `RESOURCES.md` before serious lessons begin.

- DeepEval RAG evaluation docs: https://deepeval.com/guides/guides-rag-evaluation
- DeepEval quickstart and CI-oriented test workflow: https://deepeval.com/docs/getting-started
- DeepEval RAGAS metric docs: https://deepeval.com/docs/metrics-ragas
- Ragas metrics docs: https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/
- RAGAS paper: https://arxiv.org/abs/2309.15217
- Phoenix RAG relevance eval docs: https://arize.com/docs/phoenix/evaluation/running-pre-tested-evals/retrieval-rag-relevance
- LangSmith evaluation docs: https://docs.langchain.com/langsmith/evaluation

Before implementing the industry-tool integration, run a fresh current-tool scan. As of 2026-06-16, DeepEval is the default hands-on tool target, with Ragas used as the RAG-specific metric lineage and comparison point.

## Feedback

- retrieval practice
- immediate corrective feedback
- process feedback
- rubric feedback
- external oracle feedback
- oral exam
- self-regulation feedback

## Assessment Mix

- closed-book recall
- implementation task
- debugging task
- written synthesis
- benchmark or eval
- project integration
- public artifact review

## Completion Rubric

- Not yet: I can repeat definitions or run a tool demo, but I cannot explain failures or reproduce an eval loop on a known corpus.
- Pass: I can build the baseline harness, run a small PMP-docs eval dataset, classify failures, and explain the retrieval/generation split.
- Strong: I can compare baseline and DeepEval results, explain metric tradeoffs, identify false positives or false negatives, and propose concrete harness improvements.
- Distinction: I can turn the harness into a reusable eval layer for the first portfolio AI backend system, justify tool choice against alternatives, and document limitations clearly enough for an external engineer to critique.

## Public Artifact

A validated artifact: a small RAG evaluation harness over PMP docs, plus a compact write-up describing the dataset, metrics, failures, tool choice, and next integration path into the portfolio AI backend system.

This does not need to be polished as broad public proof unless the artifact is strong enough after review.

## Expected Effort

Planned range: 12-16 focused hours.

Testing should trigger when readiness signals appear, not only when the time-box expires.
