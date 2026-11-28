---
title: "Cloudflare's GLM-5.3 KV Cache Leak: What LLM Tenant Isolation Failures Mean for Product Teams"
date: 2026-11-02
description: "A configuration mismatch and an SGLang bug let Cloudflare Workers AI users see other customers' data in GLM-5.3 responses. 155 responses were affected. Here is what happened, how it was fixed, and what it means for CTOs and product teams relying on shared LLM infrastructure."
tags: ["AI", "LLM security", "Cloudflare", "SGLang", "GLM-5.3", "data privacy", "product engineering"]
featured: true
seoTitle: "Cloudflare GLM-5.3 KV Cache Leak: LLM Tenant Isolation Failure"
seoDescription: "A KV cache misconfiguration and SGLang bug exposed cross-tenant data in Cloudflare's GLM-5.3 Workers AI model. 155 responses leaked. What product teams and CTOs should learn from it."
canonical: "https://shamylmansoor.com/blog/cloudflare-glm-5-3-kv-cache-cross-tenant-data-leak-llm-security/"
dateModified: "2026-11-02"
---

On September 8, 2026, security researcher Gadi Evron from Knostic reported a tenant isolation failure in Cloudflare's Workers AI platform: prompts sent to the GLM-5.3 model could return text belonging to other users. The root cause was a combination of a configuration mismatch — the model's context window was larger than the GPU memory allocated for its KV cache — and a bug in SGLang, the open-source inference engine Cloudflare uses, that allowed rejected requests to pass through to the decode stage with stale cache pages intact. Between August 27 and September 9, 2026, 155 responses contained data from other customers' sessions. Cloudflare took the model offline within 40 minutes of confirming the issue, patched the engine, and restored service the same day. The coordinated disclosure, published by Cloudflare and SGLang on October 26, 2026, reveals a class of vulnerability that every team building on shared LLM infrastructure should understand.

## In Brief

- Cloudflare's GLM-5.3 Workers AI model exposed cross-tenant data between August 27 and September 9, 2026, affecting 155 responses to prompts longer than 681,280 tokens
- The cause was twofold: a KV cache pool smaller than the configured context window, and an SGLang bug that let rejected requests proceed through the disaggregated prefill/decode handoff
- The decode node read stale KV cache pages from previous users' sessions instead of the current request's data, producing responses that contained other customers' prompts and partial generations
- Researcher Gadi Evron reported the issue via HackerOne; Cloudflare reproduced it in 25 minutes using two independent accounts and took the model offline
- SGLang released fixes in versions v0.5.20, v0.5.21, and v0.5.22; Cloudflare recommends all disaggregated SGLang operators upgrade to v0.5.22 or later
- Cloudflare is now working with SGLang on page-level KV cache ownership tags and formal verification of the RDMA transfer protocol
- No evidence of deliberate exploitation was found; affected requests were consistent with ordinary long-context use

## What Is KV Cache and Why It Matters for LLM Security

Large language models process text in two phases: prefill, where the input prompt is processed into an intermediate representation called the KV (key-value) cache, and decode, where the model generates output tokens one at a time using that cache. The KV cache is a tensor stored in GPU memory — it represents everything the model "remembers" about the current conversation.

In a multi-tenant serving setup like Cloudflare Workers AI, hundreds of users share the same GPU infrastructure. Each request gets allocated pages of KV cache memory, uses them during processing, and releases them when finished. The next request reuses those same pages. This is standard practice across inference engines — zeroing memory between requests would be too slow — but it places the entire burden of data isolation on the inference engine's bookkeeping.

If that bookkeeping fails, the consequences are exactly what happened here: one user's response contains fragments of another user's prompt. In a coding agent context, where prompts might include source code, API keys, internal documentation, or proprietary business logic, the impact of such a leak is significant.

## How the Leak Happened

Cloudflare serves GLM-5.3 using SGLang in a disaggregated configuration: one pool of GPUs handles prefill (processing the prompt), then transfers the resulting KV cache via RDMA (Remote Direct Memory Access) to a separate pool of decode GPUs that generate the response. This architecture, which Cloudflare has written about publicly, allows them to optimize each phase independently.

Two overlapping issues caused the exposure:

**Configuration mismatch.** GLM-5.3 was deployed with a context window of 1,048,576 tokens, but the KV cache pool on the prefill GPUs could only hold 681,280 tokens. Cloudflare was aware of this mismatch before launch. According to the company, pre-launch testing showed successful HTTP responses at long contexts, so they assumed the engine would handle the overflow gracefully. It did not.

**SGLang rejection-path bug.** When a prompt exceeded the KV cache pool size, SGLang's scheduler rejected it. In single-node mode, this worked correctly: the rejected request was replaced with a one-token placeholder, the batch finished, and the client received an error. In disaggregated mode, the rejection path broke down. The rejection was stored in a field that the admission queue did not check — it tested `finished()`, which still returned `False` for rejected requests. So the rejected request passed through prefill, which processed only the one-token placeholder, then sent a "transfer complete" signal to decode. The decode node had reserved 8 pages for the request based on the original prompt length, but prefill had only written to page 1. Pages 2 through 8 still held data from earlier requests. Decode then generated a response attending over all 8 pages — reading other users' content.

According to Cloudflare's report, the client received HTTP 200 instead of HTTP 400. The `prompt_tokens` count matched the original long prompt. The response was coherent. It arrived faster than an 8-page prefill should take. And it contained content from other users' KV pages.

This bug had been reported to SGLang by another user as issue #30233 on July 6, 2026, two months before the Cloudflare incident. Cloudflare had been flagging related KV cache lifetime issues with SGLang since v0.5.10.

## The Response Timeline

Cloudflare's incident timeline, published in their report, shows a rapid response once the issue was confirmed:

| Time (UTC) | Event |
|---|---|
| Aug 27, 2026 | GLM-5.3 launched on Workers AI with the mismatched configuration |
| Sep 8, 2026 — 23:11 | Report received via HackerOne from Gadi Evron |
| Sep 9, 2026 — 08:00 | Cloudflare begins verifying the report |
| Sep 9, 2026 — 13:22 | Security incident declared; reproduced in 25 minutes with two accounts |
| Sep 9, 2026 — 14:00 | GLM-5.3 set to private; requests return HTTP 400 |
| Sep 9, 2026 — 14:35 | Root cause identified; canary node with larger pool confirmed not susceptible |
| Sep 9, 2026 — 14:52 | All prefill nodes rolled to corrected configuration |
| Sep 9, 2026 — 19:04 | Full deployment rebuilt with patched engine; validated against reproduction script |
| Sep 9, 2026 — 19:40 | Model restored to public access |
| Oct 26, 2026 | Coordinated disclosure published with SGLang and the researcher |

The fix had two layers. First, Cloudflare adjusted the GLM-5.3 configuration so the prefill KV pool holds approximately 2.04 million tokens — roughly twice the context length. Second, they patched the engine so rejected requests are retired at the disaggregation admission queue before any KV transfer happens, with the decode node verifying that the number of tokens transferred matches what was reserved.

## What SGLang Fixed Upstream

SGLang, maintained by the team at RadixArk (formerly LMSYS), merged a series of fixes across three releases. The most important changes:

- **#36988 (v0.5.20):** Retires aborted prefill requests when their result reaches decode, stopping the exposure path
- **#38935 (v0.5.21):** Rejects over-length requests at admission, before any bootstrap, allocation, or KV transfer — following Cloudflare's proposed approach in #38704
- **#39500 (v0.5.21):** Adds `--disaggregation-enable-kv-checksum`, letting decode verify a checksum of transferred KV cache before generating
- **#41023 (v0.5.21):** Enables deferred KV release by default, holding pages until transfers are confirmed complete
- **#32758 (v0.5.20):** Caps Mooncake transfer batch sizes so a single timed-out RDMA call cannot leave an unbounded tail of writes

SGLang also published their own [security disclosure post](https://lmsys.org/blog/2026-10-26-cf-security) covering the technical details from the engine side.

## Why This Matters for Product Teams

For CTOs and product teams building on shared LLM infrastructure — whether Cloudflare Workers AI, OpenAI, Anthropic, or any platform that multi-tenants GPU resources — this incident exposes a category of risk that is not covered by standard API security thinking.

When you send a prompt to a hosted LLM, you are trusting not just the model provider's API authentication and access controls, but the entire inference stack: the engine that schedules requests, the memory management that isolates tenants, and the distributed system that moves data between GPUs. A bug in any of these layers can expose your data to other customers — or their data to you — without any error message, authentication failure, or detectable anomaly.

Cloudflare's testing gap illustrates this. They tested HTTP response codes and performance at long contexts. They did not validate model output coherence. The responses looked correct — HTTP 200, matching token counts, coherent text — because the model was generating real responses. It was just generating them using a mix of the current user's data and previous users' data.

For product teams, the practical implications are:

**Classify what goes into prompts.** Source code, API keys, customer data, internal documentation, and proprietary business logic are all candidates for prompt content in agentic workflows. A cross-tenant leak of this information has the same impact as a data breach. Teams should understand what their AI workflows are sending to third-party inference infrastructure.

**Consider self-hosted alternatives for sensitive workloads.** The [open-source decision model movement](https://shamylmansoor.com/blog/strands-decider-2b-open-source-decision-model-agentic-ai/) and tools like SGLang make it increasingly viable to run models on your own infrastructure. For Pakistani technology teams dealing with dollar-denominated API costs and data sovereignty concerns, self-hosting eliminates an entire category of multi-tenant risk — though it shifts the burden of security and operations to your team.

**Watch for the next class of bug.** Cloudflare's report describes this as part of a broader category of KV cache memory-safety bugs. Pages can be freed, reused, or read while something else still holds a claim on them. The company had already fixed related issues in decode offload and grammar error paths before this incident. The next bug will have a different shape, but the same result: one user's data in another user's response.

## What This Means for Pakistani Technology Teams

Pakistani teams building AI products face a compound challenge here. Most rely on international cloud providers for LLM inference because local GPU infrastructure is scarce and expensive. When a cross-tenant vulnerability like this surfaces, there is no contractual recourse for a small Pakistani startup against a global infrastructure provider — the terms of service typically limit liability to the cost of the API calls.

For teams building EdTech products — where student data, assessment content, or proprietary curriculum might flow through LLM prompts — the stakes are specific. A leak of student-generated content through a shared inference infrastructure could violate local data protection expectations, even if the model provider's terms technically disclaim responsibility.

The [hidden costs of AI coding agents](https://shamylmansoor.com/blog/ai-coding-agent-hidden-costs-vibe-tax/) extend beyond token bills. They include the risk profile of whatever information your agents send to shared infrastructure. Teams should treat prompt content with the same classification rigor they apply to database storage and network traffic.

## What Cloudflare Is Doing Next

Cloudflare is pursuing two longer-term fixes:

**Page-level KV cache ownership tags.** Every physical KV page carries a tag that changes when the page is reallocated. Each request records the tags it expects, and the mapping is checked before decode reads the cache. Cloudflare built a prototype over the summer that cost under 1% in throughput and tail latency. They are now working with SGLang to build a production version that works across all model architectures.

**Formal verification of the RDMA transfer protocol.** Cloudflare is applying its experience with formal methods — previously used for DNS IP selection (Topaz) and consensus protocols (QuePaxa) — to model and prove the safety of the KV cache transfer system. The goal is to mathematically demonstrate that a bug like this cannot occur, rather than relying on testing and configuration checks.

## What to Watch Next

- SGLang v0.5.22 includes all critical fixes. If you operate disaggregated SGLang, upgrade. Cloudflare's report includes a checklist: measure KV pool against context length on every node, enable deferred release, bound transfer batches, and turn on corruption detection.
- Other inference engines (vLLM, TensorRT-LLM) may have similar disaggregated rejection-path issues. The bug class is not specific to SGLang — it is a distributed systems consistency problem that any engine serving prefill and decode on separate hardware must handle.
- The researcher's report, when published, may reveal additional details about discovery methodology. Gadi Evron's reproduction used two independent accounts, which is a model for how teams can test their own LLM providers for tenant isolation.
- Watch for adoption of KV checksum verification across inference engines. SGLang's `--disaggregation-enable-kv-checksum` is a first step, but it does not yet cover every model architecture.

## Conclusion

The Cloudflare GLM-5.3 incident is the most detailed public account of a cross-tenant data leak in LLM serving infrastructure. It was caused by a configuration mismatch and a distributed systems bug — not a cryptographic failure, an authentication bypass, or a model-level vulnerability. The fix was straightforward once identified. The lesson is structural: multi-tenant LLM inference relies on memory management assumptions that are easy to violate and hard to test. Product teams building on shared LLM infrastructure should understand what their prompts contain, classify that content accordingly, and consider whether self-hosted inference is appropriate for sensitive workloads. The next vulnerability in this class will not look exactly like this one, but it will have the same shape: a bookkeeping failure in a system that was assumed to be safe.

**What is your team doing to classify and protect the content that flows through your LLM prompts?**

## Sources

- [Cloudflare: Cross-request KV cache exposure in the GLM-5.3 Workers AI model](https://blog.cloudflare.com/kv-cache-exposure-remediation/) — Kevin Flansburg and Michelle Chen, October 26, 2026
- [SGLang: Security update improving request isolation](https://lmsys.org/blog/2026-10-26-cf-security) — SGLang Team, October 26, 2026
- [Cloudflare Workers AI GLM-5.3 model documentation](https://developers.cloudflare.com/workers-ai/models/glm-5.3/)
- [SGLang GitHub repository](https://github.com/sgl-project/sglang)