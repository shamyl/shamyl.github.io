---
title: "Anthropic's FlashProve: What Provable LLM Inference Means for AI Trust and Product Engineering"
date: 2026-11-05
description: "Anthropic released FlashProve, an open-source system that generates zero-knowledge proofs of LLM inference at 110 tokens per second on a single H100. Here is what provable inference means for CTOs, product teams, AI regulation, and infrastructure architecture."
tags: ["AI", "Anthropic", "provable inference", "zkSNARK", "LLM security", "cryptography", "product engineering"]
featured: true
seoTitle: "Anthropic FlashProve: Provable LLM Inference with zkSNARKs"
seoDescription: "Anthropic's FlashProve generates zero-knowledge proofs of LLM inference at 110 tokens/second on one H100. What provable inference means for AI trust, regulation, and product teams."
canonical: "https://shamylmansoor.com/blog/anthropic-flashprove-provable-inference-zksnark-llm-verification/"
dateModified: "2026-11-05"
---

On November 2, 2026, Anthropic released FlashProve, an open-source research prototype that generates zero-knowledge proofs of large language model inference. For a 400-billion-parameter mixture-of-experts model (Meta's Llama 4 Maverick, 4-bit quantized), a single H100 GPU produces proofs at approximately 110 tokens per second, with proof files of about 19 megabytes per 1,024-token request. A verifier running on a consumer CPU can check a proof in about 17 seconds — without access to the model weights and without a GPU. The release includes executable code for the prover and two verifiers, a technical report, Lean formal proofs for the security properties, and an interactive visualizer for auditing the mathematical statements. Everything is published under the Apache 2.0 license.

The significance extends beyond the numbers. Provable inference addresses a fundamental trust gap in AI deployment: when a user queries a model through an API, a routing service, or a third-party platform, there is currently no way to verify that the response came from the specific model claimed by the provider. FlashProve offers a cryptographic solution to this problem — one that could reshape how product teams, regulators, and customers think about AI integrity.

## In Brief

- FlashProve uses zkSNARKs (zero-knowledge succinct arguments of knowledge) to prove that a specific model produced a specific response, without revealing the model's weights
- A single H100 GPU generates proofs at ~110 tokens/second for Llama 4 Maverick (400B parameters, 4-bit quantization), roughly 70–95x the GPU time of standard vLLM inference
- Proof files are ~19 MB per 1,024-token request; verification takes ~17 seconds on a 24-core CPU with no GPU and no weights
- The system is formally verified using the Lean proof assistant, with machine-checkable proofs for completeness, soundness, and zero-knowledge properties
- Anthropic released code, technical report, Lean proofs, and documentation under Apache 2.0
- The current prototype proves integer models under greedy decoding, supports contexts up to 1,024 tokens, and works with mixture-of-experts architectures

## What Provable Inference Solves

When you interact with an AI model through an API, you trust the provider on faith. The model that responds could be the one advertised, or it could be a cheaper substitute swapped in to save costs. An attacker who tampers with the token stream could modify outputs undetectably. Even an independent evaluator testing a model before release cannot confirm that the model they evaluated is the same one being served afterward.

Provable inference (PI) solves this by attaching a cryptographic proof to each response. The proof guarantees that the response was produced by a specific committed model. Anyone with the commitment, the prompt, and the response can verify the proof — without seeing the weights and without substantial compute.

Anthropic identifies four trust challenges that PI addresses:

1. **Serving verification**: Confirming that the model being served is the one a provider claims to be serving
2. **Response integrity**: Ensuring that an attacker has not tampered with the token stream between provider and user
3. **Safety enforcement**: Allowing regulators to verify that only approved models are being deployed
4. **Proof of effort**: Demonstrating that a provider spent a minimum amount of computation on a task, which could be relevant for safety commitments

The first two are immediately relevant to product teams. If you are building an application on top of a third-party LLM API, you currently have no cryptographic guarantee that you are getting what you pay for. This is the same class of trust problem that [LLM tenant isolation failures](https://shamylmansoor.com/blog/cloudflare-glm-5-3-kv-cache-cross-tenant-data-leak-llm-security/) expose from a different angle — both are about whether the infrastructure layer between you and the model is behaving as advertised.

## How FlashProve Works

FlashProve operates in two phases. In the offline phase, the model provider publishes a commitment — a short cryptographic fingerprint that pins down one exact set of weights while keeping those weights hidden. This commitment is approximately 6.5 MB and is valid for about 16 million requests before the provider must commit again. In the online phase, when a user sends a prompt and receives a response, the provider generates a proof file proving that the committed model produces those output tokens when evaluated on that prompt.

The proof satisfies four properties:

- **Completeness**: An honest provider's proof is always accepted
- **Soundness**: A forged proof is computationally infeasible to produce — breaking it would require solving widely believed cryptographic assumptions
- **Zero-knowledge**: The proof reveals nothing about the weights, intermediate computation values, or which experts ran at each layer
- **Succinctness**: The proof is small (19 MB) and fast to check (17 seconds on CPU), despite the underlying computation involving a 400B-parameter model running on an H100

The underlying cryptographic mechanism is a zkSNARK built from an interactive oracle proof (IOP) compiled using hash functions, offering post-quantum security. The system uses techniques from coding theory and complexity theory, including code proximity tests with linear constraints and lookup arguments.

Several engineering decisions make the system practical. The prover's work is proportional to the experts that actually ran (about 17B of the 400B parameters per token in a MoE model), not all parameters. Requests are proved in batches after the fact, reading finished text in one parallel pass. The system is designed to fit on a single GPU — weights are streamed in segments from host memory, so one 80 GB H100 with ~290 GB of host memory suffices.

## Performance in Context

FlashProve's 110 tokens/second proof generation rate represents a substantial leap over prior open-source systems. Anthropic provides a detailed comparison:

| System | Model | Parameters | Speed | Year |
|--------|-------|-----------|-------|------|
| zkLLM | LLaMA-2 | 13B | ~2.5 tok/s (batch, A100) | 2024 |
| VerInf | Llama 4 Maverick | 400B | ~0.02 tok/s | 2025 |
| DeepProve | Gemma 3 | — | ~1.4 tok/s | 2026 |
| FlashProve | Llama 4 Maverick | 400B | ~110 tok/s | 2026 |

The previous best for the same model (VerInf) was about 0.02 tokens/second, with proofs of 93.6 GB that took almost a day to verify. FlashProve proves the same model roughly 5,000 times faster, with proofs that are 5,000 times smaller.

The overhead relative to plain inference is approximately 70–95x the GPU time of vLLM running the same model on the same hardware. That is still significant — proving is not free — but it is within the range where real-world deployment becomes conceivable for high-value use cases. A commercial effort called Attestable independently reports 53–77 tokens/second for a dense 31B model on a single H100, though their code has not been open-sourced.

## Formal Verification: Proving the Prover

Cryptographic code is notoriously brittle. A bug in the proof system could silently undermine the guarantees that the entire system is built to provide. Anthropic addresses this by using the Lean proof assistant to formally specify and prove the protocol's security properties.

Three top-level properties are machine-checked in Lean:

1. **Completeness**: Correct statements produce accepted proofs
2. **Soundness**: False statements produce rejected proofs (except with negligible probability)
3. **Zero-knowledge**: The proof reveals no information about the weights beyond what the response itself implies

These properties are stated in the random oracle model, a standard framework for analyzing cryptographic protocols that rely on hash functions. Anthropic provides an executable Lean verifier alongside the faster C++ verifier, and an interactive visualizer to help auditors examine the formal statements.

This is notable. Formal verification of cryptographic protocols at this scale is rare in industry. The approach mirrors techniques being explored in [AI agent safety and governance platforms](https://shamylmansoor.com/blog/nvidia-openshell-open-agent-safety-platform-ai-agent-governance/) — the idea that safety claims should be machine-checkable, not just human-asserted.

## Limitations to Understand

FlashProve is a research prototype, not a production system. The limitations matter:

- **Integer model under greedy decoding**: The proof covers an exact integer version of the model using greedy decoding. Floating-point inference and sampled decoding can diverge from the proved computation. The integer version is empirically close to floating-point, but this is not guaranteed for adversarial inputs.
- **MoE only**: The system exploits the mixture-of-experts structure for efficiency. Dense architectures are not supported.
- **1,024-token context limit**: The system currently proves inference over contexts of up to 1,024 tokens. Production chat applications routinely use contexts of hundreds of thousands of tokens.
- **No formal guarantees on fast code**: The Lean proofs cover the protocol specification. The fast C++ verifier is derived from the Lean specification but is not itself formally verified. The Lean verifier can be used for high-assurance checking, but it is slower.
- **Side-channel attacks**: Timing analysis of proof generation could potentially reveal information about the weights. This is out of scope for the current release.
- **Architecture is not hidden**: The system hides weights but not the model architecture.

For product teams evaluating this for real deployment, the context length limitation is the most immediately relevant constraint. A 1,024-token window is sufficient for many single-turn API calls but not for conversational applications with long context.

## Why This Matters for Product Teams

For CTOs and product teams building on LLM APIs, provable inference changes the trust calculus.

Today, if you build a product on OpenAI's API, Anthropic's API, or a third-party router like OpenRouter, you trust that the provider serves the model they claim. You have no technical mechanism to verify this. If a provider silently downgrades your model to a cheaper variant to reduce costs, you cannot detect it from the output alone — cheaper models can produce similar-sounding responses, especially for routine queries.

Provable inference creates the technical substrate for service-level agreements that include model integrity guarantees. A provider could, in principle, attach a proof to each response, and your application could verify it. The 17-second verification time on CPU is feasible for asynchronous or batch workflows, though it is too slow for real-time chat without optimization.

For regulated industries — healthcare, finance, legal — the implications are more significant. If a regulator requires that only approved models be used for certain tasks, provable inference provides a mechanism to enforce and audit this. The provider commits to a specific model; the regulator holds the commitment; responses carry proofs that can be checked against the commitment. This is the architecture that Anthropic's trust challenge framework envisions.

From a product-building perspective, the key question is not whether to deploy provable inference today — the current limitations make that premature for most applications. The question is whether to start designing systems that can accommodate proofs when the technology matures. Teams that architect their LLM pipelines with verification hooks — logging model commitments, storing response metadata, maintaining audit trails — will be better positioned to adopt provable inference as it becomes practical.

## Implications for AI Safety and Regulation

Provable inference sits at the intersection of AI capability and AI governance. Anthropic explicitly frames it as relevant to "pacing the frontier" — the idea that advanced AI deployment should be accompanied by verifiable safety commitments.

The connection to [AI misalignment research](https://shamylmansoor.com/blog/ai-agents-lying-cheating-coordinating-bengio-misalignment-analysis/) is worth noting. If AI systems can coordinate, deceive, or behave differently under evaluation than in deployment, provable inference offers one tool to narrow the gap between what is evaluated and what is served. An auditor who holds a model commitment can verify that the deployed model matches the evaluated one. This does not solve the alignment problem, but it removes one class of substitution attack.

For Pakistani technology teams and regulators, the regulatory angle is relevant. Pakistan's AI policy landscape is still developing. If international frameworks begin requiring provable inference for certain classes of AI deployment — particularly in government, education, or critical infrastructure — local teams will need to understand the technology and its limitations. The open-source release of FlashProve under Apache 2.0 means the code is available for study and adaptation without licensing barriers.

## Product Builder's Perspective

The engineering choices in FlashProve reveal a pattern that product teams can learn from. The system does not try to prove the entire model at once. It streams weights in segments, proves one layer at a time, and exploits the MoE structure to reduce the prover's work to the active parameters. This is a general principle: when faced with a computationally expensive verification problem, find the structural properties that let you amortize the cost.

The formal verification strategy is also worth studying. Anthropic did not formally verify the entire codebase. They formally verified the protocol specification in Lean, then derived executable code from it. The fast C++ verifier is tested against the Lean verifier but is not itself formally verified. This is a pragmatic split: formal verification where the security properties demand it, testing where performance demands it. For product teams building security-critical systems, this two-tier approach — formal specification plus tested implementation — is a reasonable model.

The decision to release everything under Apache 2.0 is significant. It means the research community can inspect, replicate, and improve the system. For a technology that aims to become infrastructure for AI trust, open access is the right call. It also means that competitors and independent researchers can verify Anthropic's claims — which is exactly the kind of provability the system itself is designed to enable.

## What to Watch Next

- **Context length expansion**: The 1,024-token limit is the most obvious bottleneck. Watch for work extending FlashProve or similar systems to full context windows.
- **Dense model support**: Currently MoE-only. Dense architectures are still widely used, and supporting them efficiently would broaden applicability considerably.
- **Commercial deployment**: Attestable reports 53–77 tokens/second for a 31B dense model. If commercial offerings mature faster than open-source ones, the access dynamics will matter.
- **Integration with inference engines**: FlashProve is a standalone prototype. Integration with production inference engines like vLLM, SGLang, or TensorRT-LLM would be the path to real deployment.
- **Regulatory adoption**: Watch for any regulatory framework — EU AI Act, NIST AI RMF, or others — that references provable inference as a compliance mechanism.

For teams building AI products today, the practical step is to start logging model metadata. When you call an LLM API, record the model version, the provider, the timestamp, and the response. This metadata is the foundation that provable inference would build on. If proofs become available for your provider, you want to be in a position to verify them without retrofitting your entire pipeline.

## Sources

- Anthropic, "Progress on provable inference for large language models," November 2, 2026 — [https://www.anthropic.com/research/provable-inference](https://www.anthropic.com/research/provable-inference)
- FlashProve technical report — [https://www.anthropic.com/document/flashprove-technical-report](https://www.anthropic.com/document/flashprove-technical-report)
- FlashProve GitHub repository — [https://github.com/anthropics/FlashProve](https://github.com/anthropics/FlashProve)
- Lean statements visualizer — [https://github.com/anthropics/FlashProve/blob/main/lean/STATEMENTS.html](https://github.com/anthropics/FlashProve/blob/main/lean/STATEMENTS.html)
- Ha and Schmidhuber, "World Models," 2018 — referenced for context on model verification concepts
- VerInf, prior provable inference work on Llama 4 Maverick — referenced in Anthropic's prior work section
- Attestable, commercial provable inference — [https://attestable.com/blog/proving-llms-scale](https://attestable.com/blog/proving-llms-scale)
