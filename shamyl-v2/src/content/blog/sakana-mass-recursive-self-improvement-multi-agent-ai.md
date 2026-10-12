---
title: "Sakana AI's MASS: Can a Model Teach Itself by Watching Its Own Agent Teams?"
date: 2026-10-12
description: "Sakana AI's MASS paper shows that a single language model can improve itself by running multi-agent teams, evaluating the results, and training on the best executions. After two cycles with Qwen3.6-27B, the model achieves 1.2-1.6x higher performance per output token on public benchmarks. Here is what the method does, where it falls short, and what it means for product teams and AI safety."
tags: ["AI", "machine learning", "recursive self-improvement", "multi-agent systems", "Sakana AI", "AI safety"]
featured: true
seoTitle: "Sakana AI MASS: Recursive Self-Improvement via Multi-Agent Teams"
seoDescription: "Sakana AI's MASS method lets a language model improve itself by running multi-agent teams, evaluating results, and training on the best executions. 1.2-1.6x gains after two cycles. What it means for AI safety and product teams."
canonical: "https://shamylmansoor.com/blog/sakana-mass-recursive-self-improvement-multi-agent-ai/"
---

Recursive self-improvement — the idea that an AI model could become smarter by learning from its own outputs — has been a theoretical concept for years. The practical obstacle is obvious: if a model produces work and then grades its own work, what stops it from rewarding confident-sounding nonsense? Sakana AI's new paper, "Recursive Self-Improvement through Multi-Agent Self-Supervision" (MASS), published on arXiv on October 8, 2026, offers a partial answer. Instead of asking a single model to critique its own reasoning, MASS has the model spin up teams of agents that work on research tasks together, evaluates which team did the best job, and trains on those executions. After two cycles starting from Qwen3.6-27B, the model achieves 1.2–1.6x higher performance per output token on four public benchmarks. The method is not a solved system — the authors are candid about its limitations — but it represents the most credible demonstration to date that a homogeneous recursive improvement loop can produce real gains.

## In Brief

- Sakana AI published the MASS paper on arXiv on October 8, 2026, with authors Hyunin Lee, Jinglue Xu, Jeffrey Seely, Donghyun Lee, Somayeh Sojoudi, Matei Zaharia, and Yujin Tang
- MASS alternates between evolutionary workflow optimization (finding the best multi-agent team structure) and supervised fine-tuning on the self-judged best executions
- After two complete cycles starting from Qwen3.6-27B, the model's win rate on held-out synthetic tasks rises from 53.9% to 69.9% against the base model
- Score per output token improves 1.2–1.6x on four public benchmarks: MLR-Bench, DSBench, ScienceAgentBench, and AstaBench
- On MLR-Bench, the model completes a paper in 50 of 60 runs after two rounds, up from 31 of 60 for the base model
- External judges (GPT-5.5 and Claude Opus 4.8, withheld from the training loop) confirm the gains, with agreement rising from 73% to 93% across three cycles
- Multi-agent training trajectories are more token-efficient than single-agent trajectories: the MASS student achieves a 68.3% win rate with 31% fewer supervised tokens than a single-agent student
- The code is available on GitHub but no open-source license has been assigned to the MASS-specific code as of October 12, 2026

## The Problem MASS Tries to Solve

Training AI models today relies on human feedback, curated datasets, or stronger teacher models. But as models approach the frontier of what humans can evaluate, a bottleneck emerges: who supervises the supervisor? If a model produces research that even domain experts struggle to assess, human feedback becomes unreliable. If no stronger teacher model exists, the model must somehow serve as its own teacher.

This is the setting the authors call "homogeneous recursive self-improvement" (RSI). One shared language model fills three roles: the executor that solves tasks, the optimizer that designs how agents divide work, and the evaluator that judges which output is better. The central question is how to extract a useful training signal from this loop without the model simply reinforcing its own mistakes.

MASS draws an analogy from human societies. People expand their capabilities by dividing work, combining ideas, and passing on what they learn. A single person working alone may miss solutions that a team would find. The authors ask whether a model can learn from its own team's collective intelligence — outputs that emerge from coordination between multiple agent instances — even when no external supervisor is available.

## How MASS Works

MASS alternates between two phases: workflow search and post-training.

**Workflow search (RHI).** The model proposes multi-agent workflows — configurations of roles, contracts between agents, and information routing — for a given task. These workflows look like computational graphs: an orchestrator agent divides the task, assigns subagents, and integrates their results. The model executes each candidate workflow, evaluates the resulting workspace against alternatives, and iteratively searches for the best team structure. This phase is called Recursive Harness Improvement (RHI), and the model weights stay fixed during it.

**Post-training.** Once the best workflow is found, the model executes it multiple times with different random seeds. The evaluator compares the resulting workspaces pairwise, and a Bradley–Terry model converts preferences into scores. The highest-scoring executions become training data: the model's outputs in those executions serve as supervised fine-tuning targets, with task prompts and tool results providing context.

The updated model then fills all three roles in the next cycle, and the process repeats. The authors ran two complete cycles starting from Qwen3.6-27B in a coding-agent environment with 12 synthetic research tasks spanning finance, robotics, and pharmacy.

## What the Results Show

The paper reports several quantified findings:

**Win rate on held-out tasks.** On three synthetic test tasks excluded from post-training, the win rate against the base model rises from 53.9% after one round to 69.9% after two rounds. The second-round model also wins 60.8% of comparisons against the first-round model, suggesting compounding improvement.

**Public benchmark performance.** Score per output token — a measure of how much useful work the model produces per token generated — reaches 1.2–1.6x the base model's level across MLR-Bench, DSBench, ScienceAgentBench, and AstaBench. On MLR-Bench specifically, task scores improve from 1.58 to 2.40, and the model delivers a paper in 50 of 60 runs after two rounds, up from 31 of 60 for the base model.

**External judge agreement.** GPT-5.5 and Claude Opus 4.8, used as external evaluators whose judgments are withheld from the training loop, confirm the improvements. Agreement between the model's self-evaluation and these external judges rises from 73% to 93% across the three cycles. This is a notable result: the model's internal judging ability improves alongside its task-solving ability, suggesting that learning to solve tasks also teaches better evaluation.

**Training efficiency.** Multi-agent trajectories provide a denser learning signal than single-agent trajectories. A student trained on multi-agent traces achieves a 68.3% win rate after processing 28.8M supervised training tokens, while a single-agent student reaches 64.0% after 42M tokens — 31% more tokens for a lower win rate. External judges prefer multi-agent work in 85.1% of comparisons against single-agent outputs.

**Where gains do not appear.** The improvements do not transfer uniformly. Score per output token is 0.96x on Terminal-Bench 2.0 and 0.94x on SWE-bench Verified — both below the base model's level. These benchmarks test command-line and software engineering tasks that differ from the synthetic research suite used for training, suggesting the gains are strongest in domains resembling the training distribution.

## The Safety Question Nobody Can Ignore

The paper's most honest section addresses the fundamental risk of homogeneous RSI: shared blind spots. In a loop where the same model produces, evaluates, and learns from work, a systematic error could be produced, accepted as an improvement, and incorporated into the next model version. If humans also cannot recognize the flaw, successive updates could amplify it rather than correct it.

The authors write that keeping self-evaluation "open to correction" is essential for safety. They frame this as AI's "Odyssean moment" — a reference to Ulysses strapping himself to the mast to resist the Sirens' song, suggesting that the system must build in constraints before the temptation to self-reinforce becomes overwhelming.

This connects to broader concerns in AI safety. NVIDIA's [Open Agent Safety Platform](/blog/nvidia-openshell-open-agent-safety-platform-ai-agent-governance/), announced in September 2026, represents one approach: hardware-enforced boundaries that quarantine agents when they breach rules. Anthropic's [multi-agent coordination research](/blog/multi-agent-ai-systems-coordination-problems/) documented how agents in shared environments can collude, conform, and fight turf wars — behaviors that emerge from interaction rather than design. MASS adds a different dimension: when the multi-agent system is also the training signal, coordination failures don't just affect one run — they can shape the model's next version.

## Why This Matters for Product Teams

For CTOs and product teams building with AI, MASS is relevant in two ways.

**Agent orchestration as a training source.** Teams already running multi-agent systems — for code generation, research automation, customer support, or data analysis — are generating execution traces that contain coordination patterns, task decompositions, and error corrections. MASS suggests these traces could be more valuable than previously understood. Instead of discarding agent runs after task completion, teams could rank executions, identify the best ones, and use them to fine-tune their models. This is essentially what [Google's AX orchestrator](/blog/google-ax-open-source-ai-agent-orchestration-kubernetes/) does for running agents at scale — MASS adds the training loop on top.

**The evaluation bottleneck is real.** As [TypeSafe's Jev model](/blog/typesafe-jev-non-llm-calibrated-decision-model-product-architecture/) demonstrated, not every AI task needs text generation — many need calibrated decisions. But even decision models need training data, and producing that data requires evaluators. If a model can serve as its own evaluator within a multi-agent framework — even an imperfect one — it reduces the dependency on expensive human annotation or stronger external models. For teams in markets where annotation costs are a barrier, including Pakistani technology teams paying dollar-denominated API prices, self-supervised methods like MASS could lower the cost of model improvement.

## What This Means for Pakistan and Emerging-Market AI Teams

The MASS method has a specific structural property that matters for resource-constrained teams: it requires no external teacher model. The training signal comes from the model's own multi-agent executions. This means a team with a single mid-sized model (27B parameters in the paper's experiment) and sufficient compute to run inference on multiple agent instances can attempt recursive improvement without paying for GPT-5.5 or Claude Opus 4.8 API calls for training data generation.

The caveat is that MASS still requires meaningful compute. Running multi-agent workflows with multiple seeds, evaluating pairwise comparisons, and performing supervised fine-tuning demands GPU time. The paper doesn't report total compute costs, but the scale — 12 tasks, multiple workflow candidates per task, multiple seeds per workflow, two full cycles — suggests this is not a laptop experiment. For Pakistani universities and startups with access to shared GPU clusters (such as those emerging through partnerships like the [Google Pakistan MoU](/blog/google-pakistan-mou-ai-gemini-students-digital-economy/)'s AI Centre of Excellence), methods like MASS could be worth exploring as a research direction — but the compute requirements should not be underestimated.

## Limitations and Open Questions

The paper is admirably transparent about what MASS does not yet achieve:

**Narrow transfer.** Gains are concentrated on benchmarks resembling the training tasks. Terminal-Bench 2.0 and SWE-bench Verified show no improvement. The authors do not claim general capability enhancement — they claim improvement on research-style tasks similar to the training distribution.

**Non-verifiable tasks only.** MASS is designed for tasks where no automatic correctness signal exists. If your task has a test suite, a compiler, or an objective scoring function, simpler reinforcement learning methods would work better. MASS is specifically for open-ended research work where "better" is subjective.

**Self-judgment risk.** The evaluator is the same model being improved. While external judge agreement rises to 93%, the authors acknowledge that shared blind spots could allow flawed results to be incorporated. The external judges (GPT-5.5, Claude Opus 4.8) are withheld from training but are themselves AI models with their own limitations.

**No open-source license.** The GitHub repository contains code, documentation, and configurations, but as of October 12, 2026, the NOTICE.md file states: "No public open-source license has been assigned to the MASS-specific code in this repository." Teams cannot legally use or adapt the code without explicit permission. The arXiv paper itself is freely accessible, but implementation requires building from the paper's description.

**Single base model.** The experiment uses one starting model (Qwen3.6-27B). Whether the method produces similar gains with other models, other parameter counts, or other task domains is an open question.

## Product Builder's Perspective

For teams building AI products, MASS highlights a tension that is becoming more visible: the most interesting AI research is increasingly about meta-learning — systems that learn how to learn — rather than about individual task performance.

The [Strands Decider 2B](/blog/strands-decider-2b-open-source-decision-model-agentic-ai/) model, released the same week, addresses a different piece of the same puzzle: making individual decision points faster and cheaper. MASS addresses the layer above: how the entire model improves over time. Both are relevant to product teams because they point toward an architecture where AI systems are not static deployments but continuously improving loops — agents that run tasks, evaluate their own work, and update their capabilities.

The practical takeaway is not that product teams should implement MASS tomorrow. It is that the execution traces your agents generate today — the conversations, tool calls, success and failure patterns — are training data. The question is whether you are capturing and using them. Most teams are not. The teams that start building this feedback loop now, even in a simple form (ranking agent executions by outcome quality and fine-tuning on the best ones), will have a structural advantage as these methods mature.

## What to Watch Next

- **Code licensing.** If Sakana AI assigns an open-source license to the MASS repository, expect rapid experimentation from the research community. Until then, the paper describes the method in enough detail for independent implementation.
- **Transfer to smaller models.** The paper uses Qwen3.6-27B. Whether MASS produces gains with 7B or 3B models — which are more accessible to teams with limited compute — is a critical question.
- **Safety frameworks for RSI.** As self-improvement methods become more capable, the need for external oversight mechanisms grows. NVIDIA's hardware-level approach and Anthropic's coordination research are early signals. Expect more work on "oversight layers" that can detect and correct shared blind spots in homogeneous loops.
- **Real-world task transfer.** The synthetic research suite in this paper is a controlled environment. Whether MASS gains hold on real software development, scientific research, or commercial workflows remains to be tested.

## Sources

- [MASS: Recursive Self-Improvement through Multi-Agent Self-Supervision — arXiv paper](https://arxiv.org/abs/2610.12176)
- [Sakana AI MASS blog post with interactive diagrams](https://pub.sakana.ai/mass/)
- [MASS GitHub repository (no open-source license assigned)](https://github.com/SakanaAI/mass)
- [Recursive Harness Self-Improvement — prior work by the same lead author](https://hyunin-lee.github.io/Recursive-Harness-Self-Improvement/)
- [Weak-to-strong generalization — Burns et al., referenced in the paper](https://arxiv.org/abs/2312.09390)