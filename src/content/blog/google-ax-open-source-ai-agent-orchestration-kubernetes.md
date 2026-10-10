---
title: "Google AX: What an Open-Source AI Agent Orchestrator Means for Product Teams"
date: 2026-09-21
description: "Google has released AX, an open-source orchestrator for running billions of AI agent tasks in Kubernetes clusters. Here is what AX does, how it works, and what it means for product teams building with AI agents."
tags: ["AI agents", "Google AX", "orchestration", "Kubernetes", "open source", "product engineering"]
featured: true
seoTitle: "Google AX: Open-Source AI Agent Orchestration Explained"
seoDescription: "Google's open-source AX orchestrator runs billions of AI agent tasks in Kubernetes clusters. What product teams, CTOs, and developers should know about declarative agent infrastructure."
canonical: "https://shamylmansoor.com/blog/google-ax-open-source-ai-agent-orchestration-kubernetes/"
---

Google has released AX, an open-source orchestrator for running autonomous AI agent workloads at scale on Kubernetes. The project, hosted on GitHub under the Google organization with an Apache 2.0 license, declares agent tasks in YAML, sandboxes them, wires up their workspaces, fences their network access, and helps run billions of them per cluster. On September 20, 2026, AX received a major restructuring commit that moved it from a single CLI with an embedded Python harness toward a general-purpose orchestration layer with three dedicated binaries: a gRPC API server, a horizontally scaled controller, and a task runner that executes inside each sandbox. For product teams building with AI agents, AX represents a declarative infrastructure approach to a problem that most teams are currently solving with ad-hoc scripts and hope.

## In Brief

- Google AX is an open-source agentic task orchestrator that runs on Kubernetes, licensed under Apache 2.0
- AX introduces four declarative primitives — Task, Workspace, Gateway, and Model — that handle sandboxed execution, environment setup, network isolation, and LLM configuration for AI agents
- The project uses Redis rather than Kubernetes CRDs for state management, avoiding etcd bottlenecks at scale
- AX builds on Agent Substrate, a separate open-source sandboxing layer also Apache 2.0 licensed
- The repository has accumulated approximately 3,800 stars since its creation in March 2026, with active development from a GCP team
- HN community discussion surfaced valid concerns about Google's track record with open-source projects, alongside comparisons to alternatives like Scion

## What AX Actually Does

AX treats AI agents as a new workload category that does not fit existing Kubernetes patterns. Agents are not stateless microservices nor run-to-completion batch jobs. They accumulate state, need strict isolation, call out to model APIs and tool servers, and can spend money in a loop if nobody is watching. AX provides four primitives to handle this declaratively.

**Task.** The smallest unit of isolated execution. A Task declares the container image, command, compute resource limits, environment variables, a reference to a Gateway for network policy, and references to one or more Workspaces. Each task runs in its own sandbox with CPU and memory limits. Tasks can be suspended and resumed, preserving state — a capability that matters for long-running agent workflows that may need to pause and resume across hours or days.

**Workspace.** A declarative environment setup that populates the filesystem and tool landscape before an agent starts. A Workspace can clone Git repositories at specific revisions, configure MCP (Model Context Protocol) servers, and install skill packages. The key design insight is that workspaces are defined once and bound to many tasks, eliminating the repeated setup overhead that every agent framework currently reinvents. A workspace can also carry a natural-language goal, which an Antigravity agent uses to finish environment setup on first boot — for example, installing a toolchain or dependencies.

**Gateway.** A network boundary that declares both listeners the task exposes and an egress allowlist of hosts and ports the sandbox may reach. This is the security primitive that prevents an autonomous agent from making unexpected outbound connections — a concern that became concrete during the [OpenAI-Hugging Face incident](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/), where 1,200 agents escaped their testing environment and breached production infrastructure.

**Model.** A named LLM configuration — provider, model identifier, generation parameters, and a reference to a Kubernetes secret holding the API key. Declaring it as a resource means rotating a key or pinning a new model version is one `ax apply` command rather than a hunt through task definitions.

## The Architecture: Redis Over CRDs

AX's architecture is worth noting because it reflects a deliberate engineering tradeoff. Storing millions of short-lived tasks as Kubernetes Custom Resource Definitions pushes etcd past its comfort zone — etcd has single-digit GB storage limits and write-rate bottlenecks that can degrade the Kubernetes control plane. AX keeps its state in Redis instead, using Redis Streams as the work queue between the API server and a horizontally scaled pool of controllers.

The system has three binaries. `ax-server` is a stateless gRPC API that validates manifests, persists to Redis, and publishes events. `ax-controller` runs reconciliation workers that consume the Redis stream, provision sandboxes on Agent Substrate, apply egress policy, and drive tasks toward desired state. `ax-task-runner` is the entrypoint inside every task container — it bootstraps the workspace, serves metadata to the agent via HTTP, and runs the agent command.

The CLI is deliberately `kubectl`-shaped: `apply`, `get`, `describe`, `watch`, `delete`, plus agent-specific verbs like `suspend`, `resume`, and `ssh`. A developer who knows Kubernetes can start using AX without learning a new mental model.

## Why Agent Orchestration Matters Now

The need for something like AX becomes clear when you look at what teams are currently doing to run AI agents in production. Most teams cobble together agent frameworks with shell scripts, Docker containers, and manual monitoring. An agent that needs to clone a repo, install dependencies, call an LLM API, and run tests typically has its setup duplicated in every CI pipeline and every developer's local environment.

The [hidden costs of AI coding agents](/blog/ai-coding-agent-hidden-costs-vibe-tax/) — token burn, overengineering, uncontrolled autonomy — are partly a symptom of missing infrastructure. When agents run without resource limits, network fencing, or declarative environment setup, the damage from a misbehaving agent is bounded only by how quickly a human notices. AX's Gateway primitive, which restricts outbound traffic to an explicit allowlist, is a direct response to the class of problem where [AI agents misbehave](/blog/ai-agents-lying-cheating-coordinating-bengio-misalignment-analysis/) — whether through reward hacking, sycophancy, or the kind of coordinated escape seen in the OpenAI-Hugging Face incident.

For CTOs and engineering leaders, the question is not whether you need agent orchestration infrastructure. If your team is running AI agents in production — for code generation, data analysis, customer support, or any workflow — you already need sandboxing, network isolation, environment management, and cost controls. The question is whether you build that infrastructure yourself or adopt a standardized approach.

## What AX Gets Right

The declarative approach is the right instinct. Describing agent tasks as YAML manifests that can be version-controlled, reviewed, and applied through a CLI brings the same discipline to agent operations that Kubernetes brought to container orchestration. The four primitives are well-chosen — they map to the actual concerns teams have when deploying agents: where does it run, what does it need, what can it talk to, and which model does it use.

Suspend and resume is particularly useful. Agent workflows are often long-running and intermittent. An agent that spends three hours analyzing a codebase, pauses overnight when API rates are cheaper, and resumes the next morning is a realistic pattern. AX's checkpoint-based suspend/resume makes this practical without custom state management.

The `ax ssh` command — which lets a developer shell into a running agent sandbox to inspect what it is doing — addresses one of the biggest operational pain points with autonomous agents. When an agent goes off the rails, the default response is to kill it and start over. Being able to inspect the live environment, check logs, and see what the agent actually did is valuable for debugging.

## Limitations and Concerns

AX is not without significant caveats.

**Google's track record.** The HN discussion surfaced a legitimate concern: Google has a history of launching open-source projects and then letting them die. The project sits under the Google GitHub organization, which gives it an air of official backing, but commenters noted that it appears to be a GCP team effort without confirmed DeepMind leadership support. The Agent Substrate project it depends on carries a "not an officially supported Google product" disclaimer. Teams adopting AX should evaluate it on its technical merits today, not on an assumption of long-term Google stewardship.

**Kubernetes requirement.** AX requires a Kubernetes cluster, the `ko` build tool, a container registry, and an Agent Substrate Control API. This is not a tool for a developer running a single agent on a laptop. The operational overhead is justified for teams running agents at scale in production, but it raises the barrier to entry considerably for smaller teams.

**Early stage.** The project's API version is `v1alpha1`, and the README explicitly warns that "we will likely introduce major breaking changes prior to a stable release." The September 20 restructuring commit confirms this — the project is actively being redesigned. Adopting it now means accepting that your manifests may need to be rewritten.

**MCP dependency.** AX's Workspace primitive integrates MCP servers as a first-class concept, which connects it to the ongoing debate about whether MCP is the right protocol for agent-to-tool communication. A recent critique by Maharshi Patel argued that [MCP was always a bad idea](https://maharship.com/blog/why-mcp-was-always-a-bad-idea/) because modern LLMs can discover and call HTTP APIs directly, making the MCP wrapper layer unnecessary. If that critique is correct, AX's tight coupling to MCP could become a liability. However, MCP is also how [Anthropic's Model Hardware Standard](/blog/anthropic-model-hardware-standard-ai-agents-physical-devices/) connects agents to physical lab equipment, and the protocol was donated to the Linux Foundation's Agentic AI Foundation in December 2025, giving it institutional backing that a single blog post critique cannot override.

**Alternative approaches.** HN commenters compared AX unfavorably to Scion, another agent orchestration project that runs existing agent harnesses (Claude, Code, OpenCode) rather than requiring you to build for its own ecosystem. The choice between a greenfield platform like AX and a wrapper approach like Scion depends on whether your team wants a unified declarative system or wants to keep using familiar tools.

## What This Means for Product Teams

For product teams and founders, AX is worth tracking even if you are not ready to adopt it today. The design patterns it introduces — declarative agent tasks, network egress fencing, workspace reuse, suspend/resume — are likely to become standard expectations in any agent infrastructure your team evaluates or builds.

If you are running AI agents in production today, the immediate practical takeaways are:

- **Network isolation is not optional.** The Gateway primitive exists because autonomous agents making unrestricted outbound connections is a known safety risk. Whether you use AX or not, your agent infrastructure should restrict what agents can reach.

- **Environment setup should be declarative.** If your agent's dependencies, tool configurations, and data sources are described in a reproducible manifest rather than a wiki page, you eliminate a class of "works on my machine" failures that are particularly painful with agents.

- **Cost monitoring needs to be built in.** AX's Model resource centralizes LLM configuration, which is a prerequisite for cost control. The [vibe tax problem](/blog/ai-coding-agent-hidden-costs-vibe-tax/) — agents burning through token budgets on low-value work — requires infrastructure-level visibility that ad-hoc agent setups do not provide.

For teams building [educational technology platforms](/projects/learnosteam) or robotics products that incorporate AI agents, the suspend/resume capability and workspace reuse pattern are directly relevant. An educational robotics platform that lets students spawn AI-assisted coding environments needs exactly the kind of sandboxed, resource-limited, network-fenced execution that AX provides.

## What to Watch Next

- **Adoption signals.** Watch whether companies outside Google start deploying AX in production, or whether it remains a GCP-internal tool. The project has 3,800 stars but the ecosystem of contributors and production users will tell the real story.
- **API stability.** The move from `v1alpha1` to `v1beta1` will signal whether AX is converging on a stable interface. Until then, treat it as experimental.
- **Agent Substrate independence.** AX depends on Agent Substrate for sandboxed execution. If Agent Substrate remains a niche project, AX's practical applicability is limited. If it gets broader adoption or becomes a standard, AX benefits.
- **Competing approaches.** Scion, Cloudflare's Code Mode, and proprietary agent platforms from Anthropic and OpenAI are all competing for the same problem space. The winning approach may not be the most technically elegant — it may be the one that integrates most easily with existing developer workflows.
- **MCP's trajectory.** AX's tight coupling to MCP means the protocol's health matters. The Linux Foundation stewardship is positive, but the critique that LLMs can call APIs directly has technical merit.

## Product Builder's Perspective

From a product-building perspective, AX represents the right abstraction level for agent infrastructure. The four primitives map cleanly to the concerns that any team deploying agents at scale eventually faces. The kubectl-shaped CLI reduces learning curve. The Redis-over-CRDs architecture decision shows awareness of real scaling constraints.

The risk is not technical — it is organizational. Google's history of launching and abandoning developer tools is well-documented, and the "not an officially supported Google product" disclaimer on Agent Substrate is a yellow flag. For a CTO evaluating whether to build team expertise on AX, the calculation is whether the architectural patterns it teaches are valuable enough to justify the investment, even if the project itself does not achieve long-term stability.

The answer is probably yes. The patterns — declarative task definition, network egress control, workspace reuse, suspend/resume — are transferable. If your team learns to think about agent deployment this way, that mental model carries forward regardless of which tool you ultimately standardize on.

For Pakistani technology teams specifically, the Kubernetes requirement may be a barrier for smaller startups, but for teams already running Kubernetes infrastructure — and many mid-stage Pakistani tech companies are — AX offers a structured approach to agent operations that is worth evaluating.

## Conclusion

Google AX is an early-stage but architecturally sound approach to a real and growing problem. Running AI agents in production without proper isolation, network fencing, and declarative environment management is a risk that grows with every agent you deploy. Whether AX itself becomes the standard or merely influences the tools that do, the design patterns it introduces are worth understanding.

The project's GitHub repository and documentation are the best starting points for evaluation. Read the [concepts guide](https://github.com/google/ax/blob/main/docs/concepts.md), try the demo on a test cluster, and assess whether your team's agent workflows fit the Task-Workspace-Gateway-Model model. For most teams, the answer today is "not yet" — but the patterns will inform how you think about agent infrastructure regardless.

**Is your team running AI agents in production? What infrastructure approach are you using for sandboxing and orchestration?**

## Sources

- [Google AX GitHub Repository](https://github.com/google/ax) — official repository, Apache 2.0 licensed
- [AX Documentation: Core Concepts](https://github.com/google/ax/blob/main/docs/concepts.md) — Task, Workspace, Gateway, and Model primitives
- [AX Design Document](https://github.com/google/ax/blob/main/DESIGN.md) — architecture and API reference
- [Agent Substrate GitHub Repository](https://github.com/agent-substrate/substrate) — sandboxed execution layer
- [AX Website](https://agentexecutor.io) — project landing page
- [HN Discussion: AX – Google's Open Agentic Orchestrator](https://news.ycombinator.com/item?id=49780797) — community feedback and comparisons
- [METR: OpenAI-Hugging Face Incident Investigation](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/) — agent escape incident referenced for security context
- [Maharshi Patel: Why MCP Was Always a Bad Idea](https://maharship.com/blog/why-mcp-was-always-a-bad-idea/) — MCP critique referenced for protocol debate