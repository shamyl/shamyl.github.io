---
title: "OpenAI's Jagged Frontier: What AI Agent Success Rates Reveal About Research and Product Development"
date: 2026-11-23
description: "OpenAI's internal data shows AI agents now complete 46% of two-to-four-hour research tasks autonomously, but success rates vary wildly by task type — from 79% for monitoring to 25% for writing inference code. Here is what the jagged frontier means for CTOs, product teams, educators, and Pakistani technology companies."
tags: ["AI agents", "OpenAI", "research", "product development", "CTO", "AI safety"]
featured: true
seoTitle: "OpenAI Jagged Frontier: AI Agent Research Acceleration Data"
seoDescription: "OpenAI's internal data shows AI agents complete 46% of 2-4 hour research tasks, but success varies from 79% for monitoring to 25% for inference code. What it means for product teams and educators."
canonical: "https://shamylmansoor.com/blog/openai-jagged-frontier-ai-agent-research-acceleration/"
dateModified: 2026-11-23
---

OpenAI published a detailed report on November 18, 2026, titled "Research acceleration: The jagged frontier," revealing that its internal AI coding agents now complete nearly half of two-to-four-hour research tasks without human intervention. The report is the most granular look yet at how AI agents are reshaping research inside a frontier AI lab. But the headline number obscures a critical detail: success rates vary wildly depending on the type of work. Agents succeed 79% of the time when monitoring training runs, but only 25% when writing code for inference and serving stacks. This unevenness — what OpenAI calls the "jagged frontier" — has implications that extend well beyond AI research labs, reaching into product teams, education systems, and technology industries in developing economies.

## In Brief

- OpenAI's November 18, 2026 report shows autonomous agent success on two-to-four-hour research tasks rose from 23% in March 2026 to 46% in October 2026
- Success rates are deeply uneven: 79% for monitoring training runs, 72% for answering technical questions, but only 25% for writing inference and serving code, and 29% for building evaluation and RL environments
- Median researcher daily agent spend reached $2,400 at API list prices in October, up 62% from September; the 90th percentile reached $23,000 per day
- Researchers reported they would trade 40% of team headcount or 30% of team compute to retain access to frontier coding agents for three months
- Safety and Alignment research saw the largest absolute increase in documented workweeks, growing 77% from January to September 2026, with a notable inflection after the July 2026 Hugging Face incident
- An independent assessment by METR, published November 5, 2026, estimates that Anthropic is improving model capabilities at roughly twice the historical rate, with AI-assisted R&D as a primary driver
- OpenAI's Chief Scientist Jakub Pachocki proposed on November 22, 2026 that perplexity — a measure of how well a model predicts text — should become a shared industry metric for pacing AI development and establishing safety standards

## What the Data Actually Shows

The OpenAI report, authored by the company's research organization, builds on an earlier report published September 6, 2026. Together, they provide a longitudinal view of how coding agents have changed internal research workflows over eight months.

The core finding is that agents are becoming measurably more capable of completing research tasks autonomously. From March to October 2026, the estimated zero-intervention success rate for tasks requiring two to four hours of human work rose from 23% to 46%. For tasks requiring four to eight hours, success rose from 13% to 35%. These are tasks that a human researcher would complete — writing code to instrument an experiment, debugging a training pipeline, analyzing results — and the agent is doing them without human correction.

But the aggregate numbers hide sharp variation. Using a taxonomy developed by Epoch AI called O*NET AI R&D, OpenAI categorized tasks and measured success rates by type. From August through October 2026:

| Task Category | Estimated Success Rate |
|---|---|
| Communicate (documentation, reports) | 69% |
| Analyze (data analysis, evaluation) | 58% |
| Build (code implementation) | 43% |

At the individual task level, the spread is even wider:

| Task | Estimated Success Rate |
|---|---|
| Monitoring training runs for issues | 79% |
| Answering technical questions | 72% |
| Monitoring runs (general) | 69% |
| Writing code for inference and serving stacks | 25% |
| Building evaluation, RL, and agent environments | 29% |

This is the "jagged frontier" — the boundary between what AI agents can do reliably and what they cannot is not a smooth line moving steadily upward. It is a jagged edge where some capabilities are nearly automated while others remain stubbornly human.

## Agent Usage Is Surging — and So Is the Cost

The report documents exponential growth in agent usage. The median researcher now uses agents at a rate equivalent to $2,400 per day at API list prices, up 62% from $1,500 in September. The 90th percentile researcher uses $23,000 per day, more than double the previous month.

Agent workdays — defined as eight hours of agent runtime — have increased elevenfold, from 0.5 to 5.7 per researcher per day. On pretraining and posttraining teams, the average is roughly eight agent workdays per researcher per calendar day, meaning agents are running around the clock on multiple concurrent tasks. By mid-October, more than two-thirds of researchers averaged at least four concurrent agents, and over 10% averaged sixteen or more.

The API-equivalent value of agent usage is now about twice OpenAI's non-equity research compensation costs. When researchers were asked what they would trade to keep frontier coding agents for three months, the median answer was 40% of team headcount or 30% of team compute. In a separate October survey, 27 of 28 researchers said they would choose the latest internal model over working with a mid-career human research engineer and a 2024-era model like o1-preview.

These numbers signal that for the researchers closest to the technology, AI agents are not an experimental tool. They are infrastructure that researchers would give up significant other resources to keep.

## Where Agents Still Fail

The report is candid about limitations. Through interviews with ten researchers, five themes emerged:

**Agents have poor research taste.** They struggle to generate well-posed problems, produce repetitive data when asked to generate examples, and lack the judgment to distinguish promising directions from dead ends. One researcher noted: "The model generally can't one-shot come up with well-posed problems that it cannot solve itself."

**Agents produce low-quality output that requires supervision.** Researchers described agents writing "AI slop" PRs, rabbit-holing on unnecessary steps, producing unusable data artifacts, and making invalid analysis assumptions. One researcher adapted by switching from "do all of these" to "do one, let me review, then do the rest" — a pattern that mirrors the [agent.md approach to constraining AI coding behavior](https://shamylmansoor.com/blog/ai-coding-agent-hidden-costs-vibe-tax/) that Fabien Sanglard developed.

**Humans remain central to idea generation.** For both GPT-6 Astra and GPT-6.2 Astra releases, posttraining and safety monitoring researchers said that all key ideas originated from people, with models helping implement them. For GPT-6.2 Astra, pretraining researchers described developing ideas in conversation with Codex — one credited Codex with identifying a key insight, another said a Codex suggestion made their idea work. But the initial conceptual leap was consistently human.

**Researchers expect bottlenecks to shift.** Several researchers predicted that AI would soon improve in the areas where it is currently weakest. One said: "I do think I have more taste in terms of the ideas. But I have no confidence that will continue to be true for any significant period of time."

**Scale tasks are where agents shine.** Researchers described using models to scan thousands of data samples, diagnose experiment issues, flag concerning model behavior, and build datasets — tasks that would be "super painful" manually but are well-suited to agent-style batch processing.

## The METR Assessment: Anthropic Is Accelerating Too

The OpenAI report is not an isolated data point. On November 5, 2026, METR — a nonprofit that studies advanced AI agents — published an independent assessment of AI R&D acceleration at Anthropic, based on unprecedented access to internal data from August through October 2026.

METR's key conclusion: Anthropic is likely improving model capabilities on well-specified tasks at approximately twice the rate observed between March 2024 and October 2025. The organization attributes a majority of this acceleration to Anthropic's extensive use of AI in R&D, though with significant uncertainty — the true figure could be anywhere from 1.3x to 3x the historical rate.

METR noted that Anthropic redacted a majority of the evidence METR found most informative, describing the redactions as "aimed at removing confidential information that could accelerate other AI developers." This limits the public's ability to independently evaluate METR's conclusions. But the assessment aligns with the direction of OpenAI's data: AI-assisted research is not a future possibility but a present reality at frontier labs.

This also extends the picture from [Anthropic's own employment study](https://shamylmansoor.com/blog/anthropic-employment-study-ai-agents-restructuring-work-hiring/), published October 16, 2026, which documented that agent hours outnumber human hours 6 to 1 at the company and that junior technical hiring has dropped from 27% to 9%.

## The Perplexity Proposal: A Shared Metric for Safety

Three days after the research acceleration report, on November 22, 2026, OpenAI Chief Scientist Jakub Pachocki published a post titled "Perplexity and Intelligence" that proposes a framework for managing the risks that acceleration creates.

Pachocki argues that perplexity — a technical metric measuring how well a model predicts the next token on a held-out dataset — should serve as a shared industry benchmark for comparing model developers and establishing safety standards. Lower perplexity means better predictions, and OpenAI's data shows that transformative capabilities have emerged at specific perplexity thresholds: GPT-3.5 (log-perplexity ~0.99) enabled fluent conversation, GPT-4 (~0.91) enabled chain-of-thought reasoning, and at losses below 0.8, capabilities in cybersecurity and mathematics emerged.

Pachocki's proposal is that frontier model developers should agree on common limits — measured by perplexity and other metrics — that they will not cross until specific safety milestones are achieved, such as developing a successor to chain-of-thought monitoring. He acknowledges the challenges: different labs use different evaluation datasets, perplexity does not directly correspond to any specific task, and it does not account for advances outside of pretraining like chain-of-thought reasoning. But he argues that perplexity has "stood the test of time" as a predictor of general intelligence and could provide a shared scientific basis for industry-wide pacing.

The proposal is notable for its transparency: OpenAI published its internal perplexity measurements, which Pachocki acknowledged gives competitors a clearer picture of where the company stands. He argues that this concern is outweighed by the urgency of establishing shared safety measures.

## Why This Matters for Product Teams

For CTOs and product leaders, the jagged frontier has a practical implication: AI agents are not a uniform productivity multiplier. They are a tool with dramatically different effectiveness depending on the task.

The tasks where agents excel — monitoring, scanning, communication, analysis — are exactly the tasks that consume significant human time in product development. Code review, test monitoring, log analysis, documentation, data quality checks: these are areas where agents can plausibly handle a large share of the work today.

The tasks where agents struggle — building complex infrastructure, designing evaluation systems, writing production-grade serving code — are the tasks where senior engineering judgment matters most. The jagged frontier suggests that the value of experienced engineers is not diminishing but concentrating. As agents take over the routine work, the remaining human work is disproportionately the work that requires taste, judgment, and the ability to define well-posed problems.

For product teams thinking about [developer skill development in an AI-assisted world](https://shamylmansoor.com/blog/ai-coding-tools-developer-skill-atrophy/), this means the curriculum for junior engineers should explicitly include the skills that agents lack: problem framing, evaluation design, and the ability to supervise and correct agent output. The [hidden costs of AI coding agents](https://shamylmansoor.com/blog/ai-coding-agent-hidden-costs-vibe-tax/) — token burn, overengineering, unnecessary test generation — are the predictable result of deploying agents in the jagged frontier without understanding where they succeed and where they waste resources.

## What This Means for Pakistan's Technology Sector

Pakistan's IT exports crossed $4.5 billion in FY2026 with over 20% year-on-year growth, driven largely by software services and freelancing. The country's competitive advantage has been cost-effective technical labor — a workforce that can implement, maintain, and extend software systems at rates competitive with global alternatives.

The jagged frontier data suggests that this advantage is being reshaped from two directions. First, the tasks most susceptible to AI agent automation — boilerplate code generation, test writing, monitoring, documentation — overlap significantly with the entry-level work that many Pakistani developers currently perform. Second, the tasks that remain human — architectural decisions, problem framing, evaluation design, safety-critical code — are the tasks where experience and judgment matter most, and where Pakistan's talent market is thinner.

But there is also an opportunity. The cost of deploying AI agents has fallen dramatically, and Pakistani companies that learn to orchestrate agents effectively can compete on output rather than headcount. A five-person team in Islamabad that uses agents to handle monitoring, testing, and documentation while focusing human effort on architecture and client requirements can plausibly match the output of a fifteen-person team working traditionally. The [Google-Pakistan partnership](https://shamylmansoor.com/blog/google-pakistan-mou-ai-gemini-students-digital-economy/), which includes 150,000 Career Certificates and free Gemini access for students, provides infrastructure for this transition — but the education system needs to teach agent orchestration, not just programming fundamentals.

For educators working on [AI curriculum initiatives like Punjab's Class 1-12 plan](https://shamylmansoor.com/blog/punjab-ai-curriculum-schools-implementation-challenges/), the jagged frontier offers a framework for what to teach. The skills that agents do well — syntax, implementation, pattern matching — should be taught as things students need to understand and supervise, not master through repetition. The skills that agents do poorly — problem decomposition, evaluation design, systems thinking, ethical judgment — are the skills that deserve the most classroom time.

## Product Builder's Perspective

From a product-building perspective, the OpenAI report validates a pattern that many teams are already discovering empirically:

**The bottleneck has shifted from writing code to directing code.** When agents can implement a well-specified feature in hours instead of days, the competitive advantage is in the specification — the ability to define what to build, why it matters, and how to evaluate whether it works. This is fundamentally a product management and design challenge, not an engineering one.

**Concurrent agents change team structure.** When a single researcher can run eight agent workdays simultaneously, the limiting factor is not coding capacity but review capacity — the ability to evaluate, redirect, and integrate agent output. Teams that build strong review pipelines — automated testing, continuous integration, staged reviews — will scale agent usage faster than those that rely on ad hoc human review.

**Safety investment is growing, not shrinking.** The 77% increase in Safety and Alignment workweeks at OpenAI, accelerating after the Hugging Face incident, suggests that AI safety is not a compliance overhead but a core engineering discipline. For product teams deploying AI agents in production, [agent safety platforms like NVIDIA's OpenShell](https://shamylmansoor.com/blog/nvidia-openshell-open-agent-safety-platform-ai-agent-governance/) are becoming prerequisites, not optional infrastructure.

## What to Watch Next

- Whether the jagged frontier smooths out as models improve, or whether new capability gaps emerge as agents tackle harder tasks — OpenAI's researchers expect the latter
- Whether perplexity gains adoption as a shared industry metric, and whether other frontier labs publish comparable numbers
- How Pakistani IT services firms adapt delivery models as agent-assisted development reduces the labor arbitrage advantage — the shift from billing hours to billing outcomes
- Whether university computer science programs incorporate agent orchestration and supervision into their curricula, or whether [project-based STEAM platforms](https://shamylmansoor.com/projects/learnosteam) fill the gap first
- The next METR assessment cycle, which may provide comparative data across multiple frontier labs

## Conclusion

OpenAI's jagged frontier report is not a victory lap. It is a data-rich description of an uneven transition where AI agents handle some research tasks with near-human reliability and others with a failure rate that would be unacceptable in any production environment. The implication for the rest of us is not that AI will replace researchers or developers, but that the shape of the work is changing. The tasks that agents do well are becoming commoditized. The tasks they do poorly are becoming more valuable. And the gap between the two is where the next generation of product builders, researchers, and educators needs to position itself.

For technology teams in Pakistan and other developing economies, the strategic question is not whether to adopt AI agents but where to deploy them for maximum leverage — and where to invest in the human judgment that agents cannot yet provide.

## Sources

- OpenAI. "Research acceleration: The jagged frontier." November 18, 2026. [https://openai.com/index/research-acceleration-jagged-frontier/](https://openai.com/index/research-acceleration-jagged-frontier/)
- OpenAI. "Research acceleration: The view inside OpenAI." September 6, 2026. [https://openai.com/index/research-acceleration-view-inside-openai/](https://openai.com/index/research-acceleration-view-inside-openai/)
- Pachocki, Jakub. "Perplexity and Intelligence." OpenAI, November 22, 2026. [https://openai.com/index/perplexity-and-intelligence/](https://openai.com/index/perplexity-and-intelligence/)
- Cunningham, Tom, Nate Rush, Parker Whitfill, and Hjalmar Wijk. "Independent Assessment of AI R&D Acceleration at Anthropic in October 2026." METR, November 5, 2026. [https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/)
- OpenAI. "Managing frontier AI risk: From training to deployment." November 18, 2026. [https://openai.com/index/managing-frontier-ai-risk/](https://openai.com/index/managing-frontier-ai-risk/)
