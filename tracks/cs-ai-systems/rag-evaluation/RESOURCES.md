# RAG Evaluation Resources

Current source scan: 2026-06-16.

## Knowledge

- [Paper: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" - Lewis et al.](https://arxiv.org/abs/2005.11401)
  Seminal RAG paper introducing the combination of parametric model memory with non-parametric retrieved memory for generation. Use for: the high-level reason RAG exists, especially provenance, updateability, and knowledge-intensive tasks.
- [LangChain RAG tutorial](https://docs.langchain.com/oss/python/langchain/rag)
  Practical overview of building question-answering over a specific source corpus. Use for: the system shape of loading documents, splitting, retrieving, and answering from context.
- [DeepEval RAG evaluation guide](https://deepeval.com/guides/guides-rag-evaluation)
  Primary hands-on source for this module. Use for: splitting retriever and generator evaluation, contextual precision/recall/relevancy, answer relevancy, faithfulness, and CI-style RAG checks.
- [DeepEval quickstart and tracing workflow](https://deepeval.com/docs/getting-started)
  Official setup path for small datasets, test runs, saved results, and component-level tracing. Use for: turning a local harness into repeatable tests.
- [DeepEval RAGAS metric docs](https://deepeval.com/docs/metrics-ragas)
  Shows how DeepEval exposes RAGAS-style metrics and how those differ from DeepEval's native RAG metrics. Use for: the DeepEval vs Ragas comparison note.
- [Ragas metrics docs](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/)
  Official metric inventory for RAG, agent, and comparison use cases. Use for: vocabulary, metric lineage, and checking which RAG dimensions Ragas exposes.
- [Paper: "Ragas: Automated Evaluation of Retrieval Augmented Generation" - Es, James, Espinosa-Anke, Schockaert](https://arxiv.org/abs/2309.15217)
  Foundational paper for reference-free RAG assessment across retrieval and generation dimensions. Use for: why RAG eval needs more than answer correctness.
- [Phoenix retrieval relevance eval docs](https://arize.com/docs/phoenix/evaluation/pre-built-metrics/retrieval-rag-relevance)
  Official Phoenix retrieval relevance template. Use for: comparing retrieval-focused LLM-as-judge evaluation and noting current legacy/document-relevance guidance.
- [LangSmith evaluation docs](https://docs.langchain.com/langsmith/evaluation)
  Official LangSmith overview for offline datasets, evaluators, experiments, online monitoring, and feedback loops. Use for: platform comparison and production-facing workflow language.
- [Langfuse evaluation overview](https://langfuse.com/docs/evaluation/overview)
  Official Langfuse overview for repeatable checks, datasets, experiments, online/offline evaluation, and score tracking. Use for: tool tradeoff note.
- [Langfuse LLM-as-a-Judge docs](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)
  Official rubric-based judge workflow. Use for: understanding configurable score types, production observation-level evaluators, and dataset experiments.

## Wisdom (Communities)

- [DeepEval GitHub repository](https://github.com/confident-ai/deepeval)
  Use for: issue searches when DeepEval metrics, CLI behavior, or CI workflow examples do not match the docs.
- [Ragas GitHub repository](https://github.com/vibrantlabsai/ragas)
  Use for: implementation details, open issues, and migration friction around Ragas metrics.
- [Phoenix GitHub repository](https://github.com/Arize-ai/phoenix)
  Use for: current Phoenix eval and tracing behavior, especially when docs mention legacy evaluators.
- [LangChain forum](https://forum.langchain.com/)
  Use for: LangSmith workflow questions that need practitioner answers beyond official docs.

## Gaps

- Need a fresh current-tool scan immediately before the industry-tool integration lesson, especially for DeepEval, Ragas, Phoenix, LangSmith, and Langfuse APIs.
- Need a module-local example dataset format after the first baseline harness lesson.
