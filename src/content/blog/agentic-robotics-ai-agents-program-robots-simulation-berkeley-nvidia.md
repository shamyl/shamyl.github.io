---
title: "Agentic Robotics: How AI Agents Are Learning to Program Robots Without Massive Datasets"
date: 2026-11-10
description: "UC Berkeley roboticist Ken Goldberg and NVIDIA's Spencer Huang have introduced 'agentic robotics' — a framework where AI agents generate, test, and refine robot-control programs in simulation. Presented at CoRL 2026, the approach bypasses the data bottleneck that has slowed robotics for years."
tags: ["robotics", "AI", "agentic-robotics", "NVIDIA", "simulation", "CoRL"]
featured: true
seoTitle: "Agentic Robotics: AI Agents Program Robots Without Massive Datasets"
seoDescription: "UC Berkeley and NVIDIA's 'agentic robotics' framework lets AI agents generate, test, and refine robot programs in simulation. Presented at CoRL 2026, it bypasses the robotics data bottleneck."
canonical: "https://shamylmansoor.com/blog/agentic-robotics-ai-agents-program-robots-simulation-berkeley-nvidia/"
dateModified: 2026-11-10
---

Robotics has a data problem. While large language models trained on trillions of words from the internet can write code, answer questions, and reason through problems, robots need physical data — demonstrations, sensor readings, trial-and-error interactions with real objects — and there is no internet-scale repository of that data to train on. On November 9, 2026, UC Berkeley roboticist Ken Goldberg and NVIDIA's Spencer Huang presented a framework they call "agentic robotics" at the Conference on Robot Learning (CoRL). The approach uses AI agents to generate robot-control programs, test them in simulation, identify failures, and iteratively refine the code — all without requiring the massive datasets that have traditionally bottlenecked robotics development. Early results from Berkeley's lab and industrial partner Ambi Robotics suggest the method could compress what used to take months of engineering into hours.

## In Brief

- Ken Goldberg (UC Berkeley) and Spencer Huang (NVIDIA) introduced "agentic robotics" at CoRL 2026 on November 9, 2026, combining AI agents with simulation to generate and refine robot-control programs
- The framework, called Graph-as-Policy, segments robot tasks into modular skills that AI agents compose, test in NVIDIA Isaac simulation, and iteratively improve
- OpenAI's Astra model was used to create a physics simulation from a short video clip in under an hour, including realistic deformation modeling
- Ambi Robotics applied the method to its parcel-sorting robots, reporting increased capacity of over 15,000 packages sorted annually per robot, now deployed across 30% of its U.S. fleet
- The researchers released open-source code built on NVIDIA's Isaac framework and an industry-standard benchmark for evaluating robot performance

## The Data Problem in Robotics

For years, the gap between AI software and robotics has come down to data. Language models and image generators can be trained on the essentially infinite text and images available online. Robots need something different: physical interaction data showing what happens when a gripper closes on an object at a certain angle, or when a manipulator arm moves through a specific trajectory encountering obstacles.

Goldberg, a professor of engineering who was recently inducted into the National Academy of Engineering, put a number on this gap last year. He estimated that a "100,000-year data gap" would prevent robots from gaining real-world skills as quickly as AI agents have achieved language fluency. The math is straightforward: the text data used to train modern language models represents billions of human-hours of output. There is no comparable repository for physical interactions.

According to Goldberg, the traditional approaches each have a fundamental limitation. Model-based robotics — where engineers directly program robot perception, planning, and control — requires extensive hand-engineering for every new task. Model-free robotics, where robots learn from demonstrations through imitation learning, needs enormous datasets that are expensive and time-consuming to collect.

Agentic robotics, Goldberg says, offers "a missing link between model-based and model-free methods" that does not require additional data collection.

## How Graph-as-Policy Works

The core technical innovation is a framework called Graph-as-Policy. Instead of writing a monolithic program that controls a robot end-to-end, robot tasks are broken into modular skills: finding an object, planning a grasp, moving the gripper without collisions. Goldberg likens these to building blocks that can be composed into larger programs.

AI agents then take over the composition and testing process. The agents generate robot programs by connecting these skill modules, run the programs in NVIDIA's Isaac simulation environment across multiple task variations, identify where failures occur, and revise the code. The cycle repeats until the program works reliably in simulation. Only then is it deployed on a real robot.

This matters because simulation is cheap, fast, and parallelizable. A robot program that would take days to test on physical hardware — where each trial takes real time and failures can damage equipment — can be tested thousands of times in simulation in minutes. The bottleneck has always been the gap between simulation and reality: a program that works in simulation often fails on a real robot because the simulation does not perfectly model physics, friction, mass distribution, or material properties.

Agentic robotics addresses this by making the simulation itself improvable. When the Berkeley team gave OpenAI's Astra model access to their simulation interface and a short video of a real robot using a sponge to wipe ink off a metal bar, Astra created and fine-tuned a physics simulation that accurately reproduced the video — including realistic deformations of the sponge — in less than an hour. The AI-generated simulation was then used as the training environment for the Graph-as-Policy framework.

When the resulting code ran on a real robot, it worked. In one trial, the robot pushed over the metal bar because it did not correctly infer the bar's mass. But here is where the agentic approach shows its advantage: the AI could use video of the failed attempt to improve its simulation, revise the control program, and test a new approach — all without human intervention.

"This is when I got goosebumps," Goldberg said.

## The Industrial Validation: Ambi Robotics

Lab demonstrations are one thing. Production deployments are another. Berkeley-based Ambi Robotics, which builds robotics systems for logistics and warehouse order fulfillment, applied the agentic robotics method earlier in 2026 to analyze parcel-sorting data and test updates to robot behavior.

According to Jeff Mahler, Ambi Robotics' co-founder and CTO, the results were concrete: tests showed an increased capacity of over 15,000 packages sorted annually per robot. The update is now deployed across 30% of Ambi's U.S. fleet.

"Agentic robotics converted production data into robot behavior updates, increasing throughput across our U.S. fleet while keeping engineers in control," Mahler said, according to the Berkeley announcement.

The phrase "while keeping engineers in control" is important. One concern with AI-generated robot programs is the black-box problem: if an AI writes the control code, how do engineers verify it will behave safely? The Graph-as-Policy framework addresses this by keeping the program structure interpretable. Engineers can see which skill modules the AI selected, how they are connected, and where modifications were made. This is structurally different from end-to-end neural network policies, where the decision-making process is opaque.

## Open Source and Benchmarks

Goldberg's team released open-source code for other roboticists to experiment with, built on NVIDIA's Isaac open simulation framework. They also released an industry-standard benchmark for evaluating robot performance across industrial tasks.

The open-source release is significant for the broader robotics community. It means that small robotics teams, university labs, and companies in emerging markets can experiment with agentic robotics without building the infrastructure from scratch. The NVIDIA Isaac connection is also relevant — Isaac has been evolving steadily as a platform, and the [NVIDIA Isaac ROS 5.0 release discussed at ROSCon 2026](/blog/nvidia-isaac-ros-5-0-ai-agents-robotics-development-roscon-2026/) represents a maturing ecosystem for simulation-based robot development.

The benchmark matters because robotics has historically lacked standardized evaluation. If one team reports that their robot picks objects at 95% success rate and another reports 98%, comparing those numbers is meaningless unless the tasks, objects, and conditions are identical. A shared benchmark lets the community measure progress honestly.

## Why This Matters

The implications extend beyond the specific results from Berkeley and Ambi Robotics.

**For robotics builders**, agentic robotics could reduce the engineering effort required to deploy robots in new environments. Instead of months of programming for each new warehouse layout or manufacturing task, AI agents could generate and test programs in simulation, with engineers reviewing and approving the results. This does not eliminate the need for robotics engineers — but it could change what they spend their time on, shifting from writing perception and planning code to designing task specifications and verifying safety.

**For the [humanoid robot companies racing to commercialize](/blog/goldman-sachs-humanoid-robot-forecast-2035-market-analysis/)**, the data bottleneck is a direct constraint on how quickly their robots can learn new tasks. Agility Robotics, which [went public on Nasdaq on November 5](/blog/agility-robotics-spac-first-public-humanoid-robot-company-nasdaq-aglt/), has disclosed a pipeline of over 30 prospective customers across manufacturing, logistics, and other sectors. Each new customer environment requires the robot to learn new tasks. If agentic robotics can compress that learning timeline, it directly affects the commercial scalability of humanoid robots.

**For educational robotics**, the implications are more nuanced but potentially significant. The [challenge of choosing educational robotics platforms](/blog/choosing-educational-robotics-platform-schools-guide/) often comes down to the trade-off between hardware and simulation. If AI agents can generate and refine robot programs in simulation more efficiently, simulation-based robotics education becomes more powerful. Students could focus on defining what they want a robot to do rather than struggling with the low-level implementation details that often frustrate beginners.

## What Are the Limitations?

The Berkeley results are promising, but several caveats are worth noting.

**Simulation fidelity remains a constraint.** While Astra's ability to generate a physics simulation from a video is impressive, not all physical interactions are as well-captured as a sponge wiping a bar. Deformable materials, fluid dynamics, and contact-rich manipulation remain challenging to simulate accurately. The gap between simulation and reality — the "sim-to-real" transfer problem — has not been solved, only narrowed.

**Industrial settings are relatively controlled.** Goldberg himself noted that the implications are "already promising in industrial settings, where tasks are repetitive and at-scale." He cautioned against expecting home robots to fold laundry any time soon. Industrial environments offer structured lighting, consistent object placement, and repeatable task definitions. Home environments are far more variable.

**The Astra dependency is a variable.** The most striking result — AI generating a simulation from video in under an hour — depends on OpenAI's Astra model, which is a proprietary system. The open-source code released by Goldberg's team is built on NVIDIA Isaac, but the most advanced simulation-generation capabilities may depend on commercial AI models that are not equally accessible to all researchers.

**Scale of validation.** Ambi Robotics' deployment across 30% of its U.S. fleet is meaningful, but it is one company in one application domain (parcel sorting). Whether similar gains translate to manufacturing assembly, food handling, or other domains remains to be tested.

## Product Builder's Perspective

From a product-building perspective, agentic robotics addresses one of the most expensive parts of deploying robotics systems: the per-customer engineering cost. Every new warehouse, factory, or deployment environment has unique layouts, object types, and task requirements. Traditionally, each deployment requires engineering teams to reconfigure or rewrite robot programs. This is why robotics-as-a-service business models have gained traction — they bundle the engineering cost into an ongoing subscription rather than charging for it upfront.

If AI agents can generate and test robot programs in simulation with minimal human intervention, the per-deployment cost drops. This does not mean robots become trivial to deploy — safety validation, physical integration, and edge-case handling still require human judgment — but the economics improve. For robotics companies operating in emerging markets like Pakistan, where engineering talent is available but budgets are constrained, tools that reduce per-deployment engineering time could make robotics accessible to smaller businesses that cannot afford large integration projects.

The open-source release is particularly relevant here. A Pakistani robotics team could experiment with the Graph-as-Policy framework using NVIDIA Isaac simulation tools without licensing fees for the core software. The barrier becomes compute hardware and AI model access rather than proprietary software licenses.

## What to Watch Next

- **CoRL 2026 papers and workshops** — The full proceedings and additional results from other research groups using agentic approaches will appear in the coming weeks
- **NVIDIA Isaac roadmap** — As NVIDIA continues to develop its Isaac platform, tighter integration with agentic AI workflows seems likely. The [Isaac Groot reference platform for humanoid robot research](/blog/nvidia-isaac-groot-reference-humanoid-robot-academic-research/) already provides simulation infrastructure that could complement Graph-as-Policy
- **Physical Intelligence and other foundation model companies** — The [Physical Intelligence Pi API](/blog/physical-intelligence-api-robotics-foundation-model-fine-tuning/) offers cloud-hosted inference for robotics foundation models. Combining agentic code generation with foundation model policies could be a powerful integration
- **Ambi Robotics scaling** — Whether the parcel-sorting gains translate to other logistics tasks and whether other companies report similar results will determine if this approach generalizes

## Conclusion

Agentic robotics does not eliminate the need for physical data, engineering judgment, or safety validation. But it offers a credible path to reducing the data and engineering bottleneck that has kept robotics deployment slow and expensive. Goldberg's comparison to the World Wide Web in 1993 and ChatGPT in 2022 is a strong claim, but the underlying logic — that AI agents can now compose, test, and refine robot programs in simulation at a pace that was not previously possible — is grounded in demonstrated results, not just theory. For anyone building, deploying, or teaching robotics, this is a development worth tracking closely.

**What task would you want a robot to learn autonomously?** The answer to that question may determine where agentic robotics creates value first.

## Sources

- [UC Berkeley News: "Recent advances in AI are creating a 'paradigm shift' for robotics"](https://news.berkeley.edu/2026/11/09/recent-advances-in-ai-are-creating-a-paradigm-shift-for-robotics/) — November 9, 2026
- [NVIDIA Isaac Simulation Platform](https://developer.nvidia.com/isaac-sim) — NVIDIA Developer
- [Ambi Robotics](https://www.ambirobotics.com/) — Company website
- [Conference on Robot Learning (CoRL)](https://www.corl.org/) — Official conference site
