---
title: "Figure's Helix 2.5: What Zero-Shot Generalization in 30 Homes Means for Humanoid Robotics"
date: 2026-09-22
description: "Figure's Helix 2.5 humanoid robot completed household tasks in 30 unseen homes without environment-specific training. Here is what the zero-shot generalization result means for robotics builders, educators, and the path to home robots."
tags: ["robotics", "humanoid-robot", "Figure", "Helix", "AI", "machine-learning"]
featured: true
seoTitle: "Figure Helix 2.5: Zero-Shot Humanoid Robot Home Generalization"
seoDescription: "Figure's Helix 2.5 humanoid robot performed household tasks zero-shot in 30 unseen homes. Index pretraining raised success from 9% to 56%. What it means for robotics, AI, and home automation."
canonical: "https://shamylmansoor.com/blog/figure-helix-2-5-zero-shot-humanoid-robot-home-generalization/"
---

On September 17, 2026, Figure released results from what it describes as the first demonstration of zero-shot whole-body generalization at scale on a humanoid robot. The company's Figure 03 robot, running the Helix 2.5 neural network, tidied living rooms, folded towels, and made beds in 30 Bay Area homes it had never encountered — using objects and furniture that did not appear in its task-training data. The result offers the first quantitative evidence that the pretrain-then-finetune paradigm driving language model progress may extend to physical AI.

## In Brief

- Figure's Helix 2.5 humanoid robot performed three whole-body household tasks — tidying, towel folding, and bed making — across 30 previously unseen homes with zero environment-specific data collection or fine-tuning
- A single Index-pretrained foundation model produced all three behaviors, using one fixed checkpoint across all 30 homes
- Index pretraining alone raised zero-shot success from 9% (random weights) to 56% — a more than sixfold improvement — with all other variables held constant
- Helix 2.5 matched the success rate of the previous Helix 02 system while using half as much task-specific data, then generalized across 30 unseen environments
- Figure reports the first human-to-humanoid transfer scaling law: doubling Index pretraining data improved downstream robot-action prediction smoothly enough to forecast the largest training run's loss to four decimal places
- Index is now generating roughly 35 minutes of new human experience every second, with $3.5 billion committed to compute for Helix training

## What Makes Zero-Shot Generalization Hard

Most robot learning happens in one of two ways. Either a robot is trained in the exact environment where it will work, using data collected on-site, or it is trained in a simulation that approximates that environment. Both approaches share a fundamental limitation: the robot's competence is tied to the place where it learned.

Humans do not work this way. A person walking into an unfamiliar home can make a bed, fold a towel, or tidy a room without needing to rehearse in that specific space first. Our understanding of physical objects and manipulation skills transfers across environments. Figure's announcement frames this as the core problem: can a humanoid enter a home it has never seen and immediately get to work, with its whole body, on its own?

The challenge is compounded by the humanoid form factor. Unlike a tabletop robotic arm that operates in a fixed workspace, a humanoid robot must move through cluttered, unpredictable home environments — navigating tight corners, shifting its stance to reach objects, and coordinating perception, locomotion, and manipulation simultaneously. Every task becomes a whole-body problem.

Zero-shot generalization raises the bar further. The robot has not seen the room, layout, or objects during training. It cannot adapt after arriving. It must solve the full perception-and-control problem using only what it already knows.

## How Figure Designed the Evaluation

Figure's experimental design is notably rigorous for a company announcement. The evaluation covered three tasks across 30 unseen Bay Area homes:

- **Living Room Tidy**: Pick up 13–15 scattered toys and place them in a basket, with a one-minute timeout per toy
- **Towel Folding**: Pick up, fold, and place each towel in a basket, with fold quality graded on corner alignment and a three-minute timeout per towel
- **Bed Making**: Place both pillows and both comforter corners in the top third of the bed with the comforter pulled smooth, with one-minute timeouts per pillow and per comforter side

"Zero-shot" refers to both the evaluation environments and the objects being manipulated. No data was collected in any evaluation home. No evaluation toy, towel, or bedding appeared in the task-specification data. The robot used each home's existing furniture. Evaluation objects were set aside before experiments began, and an AI model followed by human review verified they did not appear in training data.

Each task used a single fixed checkpoint across all 30 homes. No weights were adapted to evaluation homes or objects. Success required completing the entire task — no partial credit. Any human intervention for safety aborted the rollout and marked it as failed.

This is a demanding evaluation protocol. The fact that it was designed and reported by the company itself rather than an independent third party is worth noting, but the methodology is described in enough detail to assess.

## The Index Pretraining Result

The most scientifically interesting finding is the controlled experiment Figure ran to isolate the contribution of its Index dataset. Index is Figure's global-scale collection of human behavior data, built through a network of paid contributors who record everyday tasks using a provided device. According to Figure, Index is now generating roughly 35 minutes of new human experience every second.

Figure trained two policies on identical task-specification data — one initialized with random weights, the other initialized from the Index-pretrained Helix 2.5 model. Architecture, optimization, hyperparameters, downstream data, and evaluation were all held fixed. The only experimental variable was Index pretraining.

The results: the from-scratch policy succeeded on 9% of zero-shot trials. The Index-pretrained policy succeeded on 56%. Because pretraining was the only difference, Figure says the gap directly measures Index's contribution.

No single evaluation task accounts for more than 1.90% of the Index pretraining dataset, which means the model is not simply memorizing the evaluation scenarios. The transfer is genuinely broad.

## A Scaling Law for Human-to-Robot Transfer

Perhaps the most technically significant result is what Figure describes as the first human-to-humanoid transfer scaling law. Scaling laws — which show that model performance improves predictably with more data and compute — were central to the development of large language models. They allow researchers to forecast the performance of large training runs from smaller ones, making it possible to plan compute investments rationally.

Figure trained four models on nested subsets of Index spanning an 8× increase in pretraining data, holding model size and downstream training fixed. Loss fell predictably with each doubling of Index. Using only the smaller runs, Figure could predict its largest run's test loss to four decimal places before training began, with forecasting error at just 0.54% of the variation across the full 8× data range.

This is a preliminary result — it measures data scaling only, with model size fixed — but it suggests that the relationship between human experience data and robot capability may follow a pattern similar to the relationship between text data and language model capability. If that holds, it has profound implications for how the robotics industry allocates capital between data collection, compute, and model training.

## Why This Matters

The Helix 2.5 result matters for three distinct reasons.

**It changes the economics of robot deployment.** If every robot needed to be trained in every environment where it would work, deployment at scale would be economically impossible. Figure's claim that Helix 2.5 matched the previous system's success rate with half the task-specific data — then generalized across 30 unseen homes — suggests the marginal cost of deploying a robot in a new environment is falling. This connects directly to the [Goldman Sachs humanoid robot forecast](/blog/goldman-sachs-humanoid-robot-forecast-2035-market-analysis/) of 6.5 million units by 2035: that forecast assumes cost reduction and capability improvement, and Helix 2.5 provides early evidence that both are happening.

**It validates the data-scaling thesis for robotics.** The robotics industry has debated whether progress would come from better algorithms, better hardware, or more data. Figure's controlled experiment suggests that broad pretraining on human behavior data — analogous to text pretraining in language models — accounts for most of the zero-shot capability. This is the same thesis that drove the transition from task-specific machine learning to foundation models in NLP. If it holds for robotics, it means the companies with the largest behavioral datasets will have a durable advantage.

**It shifts the frontier from manufacturing to intelligence.** While [XPENG's recent production line commissioning](/blog/xpeng-iron-humanoid-robot-production-line-manufacturing/) demonstrates that humanoid robots can be manufactured, Figure's result demonstrates that the AI controlling them can generalize. Both are necessary for a viable humanoid robotics industry, and they are progressing in parallel. The manufacturing problem and the intelligence problem are being solved simultaneously by different teams.

## Product Builder's Perspective

From a product-building perspective, several aspects of Figure's announcement deserve scrutiny.

**The 56% success rate is a starting point, not a finish line.** A robot that succeeds at household tasks 56% of the time is not ready for consumer deployment. Figure is transparent about this: "The point is not that general humanoid robotics is solved." But the rate of improvement matters more than the absolute number. If the scaling law holds, doubling Index data should continue to improve generalization. The question is how many doublings are needed to reach a commercially viable success rate — 90%? 95%? — and how long that takes given Index's current growth rate.

**The evaluation is self-reported.** Figure designed the tasks, selected the homes, ran the evaluations, and reported the results. The methodology is detailed and appears rigorous, but independent verification would strengthen the claims significantly. This is standard for company announcements in the AI industry — OpenAI, Google, and Anthropic all self-report benchmarks — but it is a limitation worth noting.

**The home environment is still constrained.** The three tasks — tidying, folding, bed making — involve rigid and semi-deformable objects in relatively structured indoor spaces. They do not test the robot's ability to handle fragile objects, cook food, clean spills, navigate multi-story homes with stairs, or interact with pets and children. The leap from these tasks to general household utility is large.

**The compute requirement is enormous.** Figure has committed $3.5 billion of compute to Helix training, through a [partnership with Nscale](https://www.figure.ai/news/figure-and-nscale-sign-strategic-partnership) deploying up to 100,000 NVIDIA Vera Rubin GPUs starting in the second half of 2027. This is a level of capital investment that very few companies in the world can match. It suggests that the frontier of humanoid robotics intelligence will be pushed by a small number of extremely well-funded teams, with smaller players competing on niche applications or open-source alternatives.

**The data collection model is unusual.** Index pays contributors by the minute to record everyday tasks using a provided device. This is a human-data supply chain, and its quality depends on the diversity and representativeness of contributors. If most contributors are in one geographic region or demographic, the model's "understanding" of household tasks will reflect that bias. Figure has not disclosed the geographic or demographic distribution of Index contributors.

## Relevance for Education and Makers

For STEAM educators and robotics program builders, the Helix 2.5 result has practical implications.

The pretrain-then-finetune paradigm is becoming the standard approach in robotics, just as it did in NLP. Students learning robotics today should understand this paradigm — not just how to train a model on a specific task, but how transfer learning and pretraining work. Platforms like [RoboSim](/projects/robosim/), which lets students program virtual robots in a 3D environment, are well-suited for teaching these concepts because they allow experimentation with simulation-to-reality transfer in a controlled setting.

The scaling law result also has educational value. It provides a concrete, real-world example of how scaling laws work in practice — something students can analyze and discuss. The fact that Figure could predict its largest training run's performance from smaller runs is a powerful demonstration of why scaling laws matter for AI research and product planning.

For makers and hobbyists, the open-source robotics ecosystem is moving in a parallel but different direction. While Figure builds proprietary foundation models trained on massive datasets, projects like the [$399 Microduck open-source biped](/blog/microduck-open-source-biped-robot-reinforcement-learning/) demonstrate that affordable, programmable robots with sim-to-real RL capabilities are reaching individual makers. These are not the same capability class, but they represent the democratization of the same underlying ideas: learn in simulation, deploy in reality, and let the robot improve through experience.

## What to Watch Next

- **Independent evaluation.** Whether independent researchers can reproduce Figure's zero-shot results on different robot platforms or in different environments will be a key test of the findings' generality.
- **Success rate trajectory.** If Figure publishes follow-up results showing continued improvement as Index grows, the scaling law thesis gains credibility. Watch for periodic updates.
- **Nscale deployment timeline.** The $3.5 billion compute commitment depends on Nscale deploying up to 100,000 GPUs starting in H2 2027. Any delay in that infrastructure would slow Helix's training trajectory.
- **Competitive response.** Other humanoid robotics companies — Tesla, XPENG, Agility, Unitree — are pursuing different approaches to the intelligence problem. Whether they adopt similar pretraining strategies or find alternative paths to generalization will shape the industry.
- **Home deployment timeline.** Figure has not announced when consumer home deployments will begin. The gap between a 56% zero-shot success rate in controlled evaluations and a commercially viable home robot product is significant.
- **Regulatory and safety frameworks.** As humanoid robots move closer to home deployment, safety certification for residential use will become a critical bottleneck — distinct from the industrial safety standards that [Agility Robotics' Digit 5](/blog/robotics-2026-08-11/) is pursuing for warehouse environments.

## Conclusion

Figure's Helix 2.5 result is the strongest evidence yet that the pretraining paradigm driving language model progress transfers to physical AI. The controlled experiment showing a sixfold improvement from Index pretraining, the demonstration of a human-to-robot scaling law, and the zero-shot generalization across 30 unseen homes together represent a meaningful step toward humanoid robots that can work in unfamiliar environments without per-site training.

The caveats are equally important. A 56% success rate is not a product. The evaluation is self-reported. The compute requirements are beyond the reach of most organizations. And the tasks, while genuinely challenging, represent a narrow slice of household work.

What Figure has demonstrated is not that the problem is solved, but that the approach works. If the scaling law holds — if each doubling of human experience data produces a predictable improvement in robot capability — then the path from here to useful home robots is a question of data and compute, not a question of whether the paradigm is correct. That is a fundamentally different situation from where the industry was a year ago.

For product builders, educators, and technology teams watching this space, the implication is clear: the robotics intelligence layer is beginning to behave like the language model intelligence layer. The companies that accumulate the most diverse behavioral data and deploy the most compute will likely lead. Everyone else will build on top of their foundations — or find niches where the general-purpose approach is not yet good enough.

---

*What would it take for you to trust a humanoid robot in your home? For builders and educators, that question is the real product specification — and Figure just moved the timeline forward.*

## Sources

- [Figure — "Helix 2.5: Zero-Shot 30-Home Generalization," September 17, 2026](https://www.figure.ai/news/helix-2-5-zero-shot-30-home-generalization)
- [Figure — "Figure and Nscale Sign Strategic Partnership For Up to 100,000 GPUs on the NVIDIA Vera Rubin Platform," September 3, 2026](https://www.figure.ai/news/figure-and-nscale-sign-strategic-partnership)
- [Figure — Helix product page](https://www.figure.ai/helix)
- [Figure — Figure 03 product page](https://www.figure.ai/figure)
- [Figure — Index app page](https://www.figure.ai/index-app)
- [Unite.AI — "Figure Introduces Helix 2.5, Tested Zero-Shot in 30 Unseen Homes," September 2026](https://www.unite.ai/figure-introduces-helix-2-5-tested-zero-shot-in-30-unseen-homes/)