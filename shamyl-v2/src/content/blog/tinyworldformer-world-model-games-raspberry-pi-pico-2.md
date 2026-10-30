---
title: "TinyWorldformer: How a 26K-Parameter World Model Runs Five Games on a Raspberry Pi Pico 2 W"
date: 2026-10-30
description: "A developer built a looped transformer world model with as few as 26,000 parameters that generates and plays five classic games simultaneously on a Raspberry Pi Pico 2 W. Here is what the architecture does, how int8 quantization makes it fit on a $1 microcontroller, and what it means for edge AI, creative coding, and education."
tags: ["edge-ai", "world models", "Raspberry Pi", "creative coding", "quantization", "open-source", "game development"]
featured: true
seoTitle: "TinyWorldformer: World Model Games on Raspberry Pi Pico 2 W"
seoDescription: "A looped transformer world model with 26K-131K parameters generates and plays five games on a Raspberry Pi Pico 2 W using int8 quantization. Architecture, results, and implications for edge AI and education."
canonical: "https://shamylmansoor.com/blog/tinyworldformer-world-model-games-raspberry-pi-pico-2/"
dateModified: "2026-10-30"
---

A developer who goes by SheepSeb on GitHub has published TinyWorldformer, a project that trains a looped transformer as a world model for five classic games — Breakout, Doom-lite, Flappy Bird, Pong, and Pac-Man — and runs the entire system on a Raspberry Pi Pico 2 W. The world model predicts what the next game frame looks like given the current frame and a player action. A second network, a streaming reinforcement learning agent, plays inside that dreamed simulation. Both networks run on the RP2350 microcontroller's core 1, using int8 quantized weights, while core 0 handles USB output and an optional display. The smallest model, for Breakout, uses 26,000 parameters. The largest, for Pac-Man, uses 131,000. The project was published on GitHub on October 22, 2026, and reached the front page of Hacker News on October 29, 2026.

## In Brief

- TinyWorldformer uses a single looped transformer block (1–4 passes with shared weights) as a world model that predicts next game frames from current frames and actions
- A streaming reinforcement learning agent (Stream AC(λ)) plays inside the world model's dreamed frames, learning on-device with no replay buffer
- Five games are implemented: Breakout (26K params), Doom-lite (55K), Flappy Bird (46K), Pong (46K), and Pac-Man (131K)
- All weights are int8 quantized; the Breakout firmware fits in 361 KB of flash and 299 KB of RAM — well within the Pico 2 W's 4 MB flash and 520 KB SRAM
- The same no_std Rust engine compiles to WebAssembly, producing identical dreamed episodes frame-for-frame
- The project demonstrates that world models can be shrunk by orders of magnitude while remaining functional, with direct implications for edge AI, robotics simulation, and education

## What a World Model Does

A world model is a neural network trained to predict how an environment changes in response to actions. Instead of running the actual game engine, the model generates the next frame from the current frame and the player's input. An agent then plays inside this generated dream rather than the real game.

The concept draws on work by Ha and Schmidhuber, whose 2018 World Models paper showed that agents could be trained entirely inside a learned simulation and still transfer to real environments. The idea has since been extended by projects like NVIDIA's GameNGen, which trained a diffusion model to predict Doom frames, and World Labs' Atlas, a multimodal world model for spatial intelligence that generates 3D environments from sparse images.

What makes TinyWorldformer notable is the scale reduction. Where Atlas operates on high-resolution images and camera poses with hundreds of millions of parameters, TinyWorldformer works on grids of 20×16 to 48×48 token cells with models small enough to run on a microcontroller that costs about one dollar.

## The Architecture: One Transformer Block, Reused

The world model is a single transformer block — attention plus a ReLU MLP — with one set of weights, applied between one and four times. The input is added back before every pass, so increasing the loop count trades speed for accuracy. On the Pico 2 W, the system uses two loops to maintain a playable frame rate.

Each game frame is split into square patches: 2×2 cells for Breakout, 4×4 for the others, producing 36 to 80 tokens per frame. A patch's embedding is the sum of learned vectors per cell, with a separate table for each position inside the patch to preserve cell order. Every token also gets a position vector and an action vector.

The model is trained against the next frame at every loop pass, so at inference time the loop count can be adjusted. One pass of the Doom-lite model produces 92 wrong cells out of 768; four passes reduce that to zero. The system uses two loops on the Pico, which gives 99.99% exact frame accuracy for Breakout, 100% for Flappy Bird, and 99.45% for Pong.

Decoding the model's output turned out to be as important as the model itself. Three rules govern how predicted scores become a frame: background cells (walls, bricks, pellets) each take their most likely token independently; singletons (the ball, the player, each ghost) are placed with one global choice over all cell-token pairs so there is always exactly one; and after random events like a serve or respawn, the choice is sampled among candidates within 2.2 logits of the best, preventing the model from averaging outcomes it cannot predict.

The second network is the actor — a small MLP with two hidden layers of 64 units (32 on the Pico) using Stream AC(λ), a streaming reinforcement learning algorithm from Elsayed, Vasan & Mahmood (2024). It learns from one transition at a time: no replay buffer, no batches, no target network. Eligibility traces carry credit back through time, and ObGD shrinks any step that would overshoot the TD target. On the Pico, a fresh agent can learn to play Flappy Bird from scratch inside the dream, averaging 6 pipes per episode after 25,000 steps and over 300 after 250,000.

## Quantization: Making 26K Parameters Fit on a Microcontroller

Every matrix in the world model is int8 with one scale per output row. Activations are int8 too, with one scale per tensor and per loop index. Matmuls sum int8 × int8 into int32 — the RP2350's SMLAD instruction does two multiply-adds in a single cycle — and then apply one float multiply by the two scales. Softmax uses a 1024-entry exp table with probabilities stored as uint8. Norms, residuals, and embeddings stay in float32 since the RP2350 has an FPU.

Training applies the same int8 rounding during training (quantization-aware training with a straight-through estimator), so the int8 model is not an approximation of the trained model — it is the model that was trained. The Rust firmware reproduces the Python integer spec bit for bit, verified with cargo test golden vectors.

The memory breakdown tells the story:

| Game | int8 Weights | float32 (embeddings, norms, scales) | Game Data | Agent (float32) | Flash | RAM |
|------|-------------|--------------------------------------|-----------|-----------------|-------|-----|
| Breakout | 19.7 KB | 31.6 KB | 1.1 KB | 54.1 KB | 361 KB | 299 KB |
| Doom-lite | 33.9 KB | 91.9 KB | 12.0 KB | 61.3 KB | 471 KB | 357 KB |
| Flappy Bird | 30.1 KB | 69.5 KB | 10.1 KB | 50.8 KB | 409 KB | 287 KB |
| Pong | 30.1 KB | 70.4 KB | 10.9 KB | 52.6 KB | 414 KB | 244 KB |
| Pac-Man | 63.0 KB | 138 KB | 20.0 KB | 74.2 KB | 600 KB | 460 KB |

The Pico 2 W has 4 MB of flash and 520 KB of SRAM. Even Pac-Man, the largest game, fits comfortably. Most of the RAM goes to scratch buffers for the forward pass and per-cell score arrays, not to weights.

## How the Dream Is Checked

Accuracy on recorded data is not enough. An agent playing inside the dream drives the world model into states the training data never covered, and any mistake there is something the agent can exploit.

The project's main verification check runs while an agent plays the dream: read the game state back off the dreamed frame, apply the real game rules to that state and the agent's action, and compare the result with the next dreamed frame. Across 5,000 dreamed steps per game at two loops, Flappy Bird had zero wrong game states and zero wrong rewards. Pong had one wrong state. Doom-lite averaged 1.5 wrong cells per step. Pac-Man, the most complex game, had 742 wrong states out of 5,000 steps — roughly 85% accuracy — with 38 wrong rewards.

Several exploits emerged during training and were fixed iteratively. A Breakout agent in the dream scored 154 points with 26 bricks remaining because the world model did not remove corner bricks when hit. Doom-lite agents learned to snipe enemies from five cells away, scoring 210 in the dream where the real maximum is 56. Each collect-and-fine-tune round closed the specific exploit the agent had found. As Ha and Schmidhuber's World Models paper predicts, agents trained only in the dream can exploit the dream's inaccuracies — but the gap narrows with each round of data collection and fine-tuning.

## Why This Matters

TinyWorldformer is not a product. It is a research demonstration, but it changes the frame for what world models can be.

**World models can be very small.** The Breakout world model has 26,000 parameters. For comparison, GPT-2 Small has 124 million. The efficiency comes from three design choices: a looped architecture that reuses one transformer block instead of stacking many layers, a token-based representation that compresses game frames into grids of categorical tokens rather than pixels, and int8 quantization that is applied during training rather than after.

**Edge AI is not just for inference.** Most edge AI projects focus on running a pre-trained model on constrained hardware. TinyWorldformer goes further: a fresh agent learns to play from scratch on the device itself, using a streaming RL algorithm that requires no replay buffer. The Pico 2 W is both the inference engine for the world model and the training environment for the agent.

**The same code runs on three platforms.** The no_std Rust engine compiles to the Pico 2 W firmware, a native desktop binary, and WebAssembly. With the same random seed, the WebAssembly build dreams the same episodes as the native build, frame for frame. This portability matters for education, where a student might start in a browser, move to a desktop, and eventually flash a physical board.

## For Educators and Makers

For STEAM educators, TinyWorldformer is a compact demonstration of several concepts that are usually taught in isolation: transformers, reinforcement learning, quantization, and embedded systems. The five games provide graduated complexity — Breakout is a 20×16 grid with 26K parameters; Pac-Man is a 48×48 grid with 131K — so a curriculum could start simple and increase difficulty.

The project's reliance on a $1 microcontroller matters for education in Pakistan and similar markets. Access to NVIDIA Jetson boards, Coral TPUs, or even Raspberry Pi 5 computers is limited by cost and import availability. The Pico 2 W is available through local distributors at a fraction of the cost. A student who can flash a firmware image and watch an AI agent learn to play Flappy Bird on a 320×240 display gets a hands-on experience of world models, quantization, and on-device learning that would otherwise require a GPU.

For makers, the project shows that creative coding and AI are converging on microcontroller-class hardware. The same hardware that runs LED patterns or motor controllers can now run a neural network that dreams a game and learns to play it. This is relevant to anyone building educational robotics platforms or interactive installations where AI behavior needs to run without cloud connectivity.

## Product Builder's Perspective

From a product-building perspective, TinyWorldformer illustrates three patterns worth noting.

First, looped transformers are a practical architecture for resource-constrained AI. Instead of stacking many transformer layers — the standard approach that drives parameter counts into the billions — a single block applied multiple times with shared weights achieves useful results with orders of magnitude fewer parameters. This is directly relevant to anyone building AI features into products that need to run on embedded hardware.

Second, quantization-aware training is not a post-training optimization. It is the training method. The int8 model is not an approximation of a float32 model — it is what was trained from the start. This eliminates the accuracy gap that usually appears when compressing models for edge deployment. For product teams, this means quantization should be a training-time decision, not a deployment-time afterthought.

Third, the project's verification methodology — checking the dream by reading game state from predicted frames and comparing against ground truth — is a pattern that applies beyond games. Any team building a simulation or predictive model should have an automated check that compares predicted outcomes against ground truth in the states the model is actually driven into, not just held-out test data. The exploit discovery cycle (agent finds an inaccuracy, exploits it, data is collected, model is fine-tuned) is a practical loop for improving any learned simulation.

## What to Watch Next

- **Olmam Labs and multi-agent environments.** The YC Labs project running 50 GPT-6.1 agents in Minecraft demonstrates multi-agent dynamics at a much larger scale. As world models shrink, running multiple agents inside a dreamed environment on constrained hardware becomes feasible.
- **World models for robotics.** If a world model can dream a game on a Pico, the same architecture could potentially dream simplified physics for robot training. This connects to ongoing work in learned simulators for robotics, where the gap between simulation and reality is the central challenge.
- **On-device learning for educational robotics.** The Stream AC(λ) algorithm's ability to learn from single transitions without a replay buffer is well-suited to educational robots that need to adapt in real-time. A robot that learns a simple policy on-device, without cloud compute, would be a natural extension of this work.
- **Open-source licensing.** The TinyWorldformer repository does not currently include a license file, which technically means the code is all-rights-reserved. Anyone intending to build on it should contact the author or wait for an explicit license to be added.

## Conclusion

TinyWorldformer takes an idea that has been demonstrated on million-dollar GPU clusters — a neural network that learns to simulate an environment and an agent that learns to play inside that simulation — and makes it run on a one-dollar microcontroller. The result is not a production system, but it is a proof that world models, quantization-aware training, and on-device reinforcement learning can be compressed into hardware that fits in a pocket. For educators, makers, and product teams working with constrained resources, that proof matters.

What would you build if your microcontroller could dream?

---

## Sources

- [TinyWorldformer GitHub repository](https://github.com/SheepSeb/tinyworldformer) — SheepSeb, published October 22, 2026
- [Hacker News discussion](https://news.ycombinator.com/item?id=50295450) — October 29, 2026
- [World Models (Ha & Schmidhuber, 2018)](https://worldmodels.github.io/) — David Ha and Jürgen Schmidhuber
- [Raspberry Pi Pico 2 and RP2350 specifications](https://www.raspberrypi.com/products/raspberry-pi-pico-2/) — Raspberry Pi Foundation
- [YC Labs: Agents in Games](https://labs.ycombinator.com/projects/games/index.html) — October 2026