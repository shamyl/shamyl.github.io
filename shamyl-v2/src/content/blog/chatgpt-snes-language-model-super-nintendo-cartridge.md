---
title: "ChatGPT for SNES: How a 2.2M-Parameter Language Model Runs on a Super Nintendo Cartridge"
date: 2026-11-20
description: "Benj Edwards built a ChatGPT-style chatbot that runs entirely on a Super NES cartridge's Super FX 2 chip. The 2.2 million-parameter language model generates text one word at a time on 1990s console hardware, with no internet connection. Here is what it does, how it works, and what it means for creative coding, education, and constrained-platform AI."
tags: ["retro-gaming", "language-model", "SNES", "creative-coding", "AI", "constrained-computing"]
featured: true
seoTitle: "ChatGPT for SNES: Language Model on a Super Nintendo Cartridge"
seoDescription: "A 2.2M-parameter language model runs on the Super NES's Super FX 2 chip, generating text one word at a time. How Benj Edwards built ChatGPT for SNES and what it means for constrained AI."
canonical: "https://shamylmansoor.com/blog/chatgpt-snes-language-model-super-nintendo-cartridge/"
dateModified: "2026-11-20"
---

A ChatGPT-style chatbot running on a Super Nintendo is the kind of project that sounds like a joke until you see it work. Benj Edwards, a tech journalist and historian who served as Senior AI Reporter at Ars Technica from 2022 to 2026, has built exactly that. ChatGPT for SNES, now at version 0.7, runs a language model with approximately 2.2 million parameters entirely on the Super FX 2 chip inside a Super NES cartridge. It generates text one word at a time, knows about 8,000 words, and never touches the internet. The project is playable in a browser-based emulator and runs on real SNES hardware with a flash cartridge. It is not a useful assistant — but it is a remarkably clear demonstration of what language models actually are, stripped of the cloud infrastructure that usually obscures their mechanics.

## In Brief

- ChatGPT for SNES runs a ~2.2 million-parameter language model on the Super FX 2 chip found in Super NES cartridges like Star Fox
- The project was designed by Benj Edwards (BX Foundry) and coded by AI agents; training conversations were written by gpt-oss-120b, OpenAI's open-weight model
- Version 0.7 was released on November 2, 2026
- The model knows approximately 8,000 words and generates answers one word at a time on the console hardware
- A second build adds a "fact book" — opening sentences of 150,000 Simple English Wikipedia articles stored in the cartridge's MSU-1 data file — letting the model look up facts before responding
- The project runs on real SNES hardware with a flash cart (FXPak Pro or sd2snes) and in a browser-based Snes9x emulator
- Edwards also built Séance, a horror chat game for the NES that runs a recurrent language model on the console's 6502 processor

## What ChatGPT for SNES Actually Does

When you load ChatGPT for SNES, you see a chat interface rendered in the console's native 256×224 resolution. You type on an on-screen keyboard using a controller (or your computer keyboard in the browser emulator), and the model responds one word at a time. Each word takes a moment to appear because the Super FX 2 chip is doing all the inference work — matrix multiplications across 2.2 million parameters — using the cartridge's onboard processor.

The Super FX 2 is the same chip that powered Star Fox and Doom on the Super NES. It runs at approximately 21 MHz, a significant upgrade over the SNES's main Ricoh 5A22 CPU at 3.58 MHz, but still less processing power than a modern microcontroller. The fact that a language model — even a tiny one — can run at all on this hardware is the project's central point.

According to the BX Foundry page, the model's training conversations were written by gpt-oss-120b, OpenAI's open-weight model. The project explicitly states it is not made or endorsed by OpenAI, and the ChatGPT name is used unofficially. There are two builds: a "pure" build where every word comes from the model (~4 MB), and a "fact book" build (~19 MB) where the model can decide to look something up in a compressed encyclopedia derived from 150,000 Simple English Wikipedia articles stored via the MSU-1 expansion chip.

## The Super FX Chip: A Brief Hardware Primer

To understand why this project is interesting, it helps to know what the Super FX chip actually is. When Nintendo released the Super NES in 1990 (1991 in North America), its main CPU was a 16-bit Ricoh 5A22 running at up to 3.58 MHz — modest even for the era. The console's strength was its custom graphics hardware, not raw processing speed.

Argonaut Software, a British developer, proposed a solution: a custom RISC processor embedded directly inside the game cartridge. The result was the Super FX chip, a 16-bit processor initially running at 10.5 MHz, later upgraded to 21 MHz in the Super FX 2 revision. The chip was designed primarily for 3D polygon rendering — Star Fox, released in 1993, was its debut title and the first 3D game on a Nintendo console.

The Super FX chip is, in essence, an early GPU. But it is a general-purpose processor, not a fixed-function graphics pipeline. It can run any code that fits in its limited memory. That generality is what makes it possible to run a language model on it — albeit one that is millions of times smaller than the models powering commercial chatbots.

This connects to a broader pattern in retro computing: the same hardware constraints that shaped classic games are now being explored as creative platforms for modern AI experiments. The [ULC audio codec running near-Opus quality audio on the N64's 93 MHz CPU](/blog/ulc-audio-codec-n64-retro-game-audio-compression/) demonstrated that algorithmic elegance can outperform brute force on old hardware. ChatGPT for SNES extends that principle to language models.

## How a 2.2M-Parameter Model Compares to Modern LLMs

The gap between a 2.2 million-parameter model and a modern frontier model is almost impossible to visualize. For context:

| Model | Parameters | Hardware |
|-------|-----------|----------|
| ChatGPT for SNES | ~2.2 million | Super FX 2 chip (~21 MHz) |
| TinyWorldformer (Breakout) | 26,000 | Raspberry Pi Pico 2 W (150 MHz) |
| GPT-3 (2020) | 175 billion | Data center GPU clusters |
| Typical frontier models (2026) | Trillions | Multi-GPU server infrastructure |

The comparison with [TinyWorldformer, which ran a 26K-parameter world model on a $1 microcontroller](/blog/tinyworldformer-world-model-games-raspberry-pi-pico-2/), is instructive. Both projects demonstrate that the core mathematical operations of neural networks — matrix multiplication, softmax, token prediction — are not inherently expensive. The expense comes from scale. A 2.2M-parameter model is a real neural network with real learned weights, doing real next-token prediction. It just has a vocabulary of 8,000 words and a knowledge base smaller than a children's encyclopedia.

Edwards is transparent about the limitations. The project page notes that the model "often gets things wrong, sometimes confidently" and that "the fact book can carry mistakes too." This is not a product. It is an demonstration — one that makes the mechanics of language models visible in a way that a cloud API never can.

## The Fact Book Build: Retrieval-Augmented Generation on a Cartridge

The second build of ChatGPT for SNES is arguably more interesting than the first. It adds what is, in essence, a retrieval-augmented generation (RAG) system running on a Super NES cartridge.

The fact book contains the opening sentences of 150,000 Simple English Wikipedia articles, stored in the cartridge's MSU-1 data file. The MSU-1 is an expansion chip that allows cartridges to stream data from the ROM at high speed — it was used in games like Star Ocean for expanded audio. In this project, it serves as a read-only knowledge base.

When the model receives a query, it can decide to look something up in the fact book and print what it finds. This is functionally similar to how ChatGPT searches the web before responding — but the entire retrieval and generation pipeline runs on console hardware from 1990. The parallel is deliberate. Edwards, as a former AI reporter, is clearly making a point: the architecture of a language model with retrieval is not complicated. What makes commercial LLMs powerful is scale, not mechanism.

The fact book's data is drawn from Simple English Wikipedia and shared under CC BY-SA 4.0, the same license as its sources. Game hints adapted from StrategyWiki and Wikipedia are included under the same terms.

## Séance: A Neural Network on the NES's 6502 Processor

ChatGPT for SNES is not Edwards' first experiment with AI on retro hardware. He also built Séance, a horror game for the Nintendo Entertainment System in which a spirit speaks to the player through a neural network running on the console's own 6502 processor.

The NES's CPU — a modified 6502 running at 1.79 MHz (NTSC) — is substantially less powerful than the Super NES's Super FX chip. Séance uses a recurrent language model that works in words, with each word taking about a second to compute. The game was coded using Claude Code with Anthropic's Opus 5.5, and runs on real NES hardware with an EverDrive N8 Pro flash cartridge.

Séance demonstrates an even more extreme version of the constraint: a language model running on a processor that was designed in 1974 and shipped in a console that cost $179 in 1985. The fact that this produces coherent text at all — even limited, scripted, game-appropriate text — is a testament to how far algorithmic efficiency can go when hardware constraints demand it.

## Why This Matters

### For Creative Coding Education

ChatGPT for SNES is a teaching tool disguised as a novelty. When a student sees a chatbot running on a Super Nintendo, the abstraction layer disappears. There is no API endpoint, no cloud service, no GPU cluster. There is a chip on a cartridge doing math, and the math produces words. That concreteness is pedagogically valuable.

For STEAM educators teaching [creative coding or game development](/blog/godot-game-engine-steam-education/), projects like this demonstrate that neural networks are not magic — they are arithmetic. The Super FX chip is doing the same matrix multiplications that a H100 GPU does, just with fewer parameters and slower clocks. Understanding this connection demystifies AI in a way that classroom explanations often cannot.

### For the Maker and Retro Computing Community

The project sits at the intersection of several communities that have been converging in 2026: retro computing enthusiasts, AI researchers interested in efficiency, and creative coders exploring unconventional platforms. The [AI-assisted game decompilation and modding projects](/blog/ai-game-decompilation-modding-switch-2-jailbreak-xbox-labs/) covered earlier this year showed AI tools breathing new life into old games. ChatGPT for SNES shows AI itself running on old games' hardware.

This matters for the maker community because it expands the definition of what retro hardware can do. A Super NES is not just a device for playing 1990s games. It is a general-purpose computer with a display, input, and a programmable coprocessor. Projects like this — like the [Half-Life port to the N64 that used the ULC audio codec](/blog/ulc-audio-codec-n64-retro-game-audio-compression/) — push the boundaries of what these platforms were never designed to do.

### For Understanding What Language Models Fundamentally Are

The most valuable aspect of ChatGPT for SNES may be philosophical. When you interact with a 2.2M-parameter model on a 1990s cartridge, you are seeing the same fundamental operation that powers GPT, Claude, and Gemini: predicting the next token given a sequence of previous tokens. The difference is one of degree, not kind.

This is an important insight for anyone building products with AI. The capabilities of a language model are determined by its parameter count, training data, and architecture — not by the hardware it runs on. Running the same model on a Super NES or a data center produces the same outputs (given the same inputs and weights). The hardware only determines how fast you get there. When product teams understand this, they make better decisions about where to deploy models, what size to use, and what trade-offs between capability and cost are acceptable.

## Product Builder's Perspective

From a product-building perspective, ChatGPT for SNES is a masterclass in constraint-driven design. Edwards did not try to run a large model on the Super NES. He designed a model that fits the hardware. The 2.2M parameter count, the 8,000-word vocabulary, and the MSU-1-based fact book are all engineered to the constraints of the platform.

This is the same approach that drives good embedded systems design, whether you are building [educational robotics platforms](/blog/choosing-educational-robotics-platform-schools-guide/) or consumer hardware products. You do not start with a capability and try to squeeze it onto a device. You start with the device's constraints — memory, compute, power, cost — and design the capability to fit. The fact that the result is a working chatbot on a 35-year-old console is evidence that this approach works even for applications as modern as language models.

For Pakistani technology teams working on edge AI, IoT, or education technology, the lesson is direct: constrained hardware is not a barrier to AI. It is a design parameter. The question is not whether you can run a model on your target hardware, but what model architecture fits the budget.

## What to Watch Next

- **On-device AI for retro and embedded platforms:** The TinyWorldformer and ChatGPT for SNES projects suggest a growing community around running real neural networks on highly constrained hardware. Expect more projects targeting specific retro consoles, microcontrollers, and embedded systems.
- **AI-assisted retro game development:** Edwards used AI agents to code both ChatGPT for SNES and Séance. This parallels the [AI-assisted porting of Babylonian Twins from Amiga to Godot](/blog/ai-porting-retro-games-godot-babylonian-twins/), where Claude handled 68000 assembly translation. AI coding tools are becoming standard for retro computing projects.
- **Educational AI hardware kits:** The pedagogical value of running a visible, understandable language model on physical hardware could drive demand for educational kits that pair microcontrollers with small models — something closer to what LearnOBots and similar STEAM education platforms already do with robotics.

## Conclusion

ChatGPT for SNES is not pushing the frontier of AI capability. It is doing something more useful: making the frontier legible. By running a real language model on hardware that predates the modern internet, Benj Edwards has built a project that teaches more about how AI works than most textbooks. The model is small, slow, and frequently wrong. It is also entirely self-contained, transparent, and running on a chip that was manufactured three decades before ChatGPT existed. For educators, makers, and anyone who wants to understand what a language model actually is, that matters.

You can try ChatGPT for SNES in your browser at [bxfoundry.com/chatgpt_snes](https://bxfoundry.com/chatgpt_snes/).

## Sources

- [ChatGPT for SNES — BX Foundry](https://bxfoundry.com/chatgpt_snes/) (accessed November 20, 2026)
- [Séance — BX Foundry](https://bxfoundry.com/seance_nes/) (accessed November 20, 2026)
- [Benj Edwards — Personal site](https://www.benjedwards.com) (accessed November 20, 2026)
- [gpt-oss-120b — OpenAI open-weight model (Apache 2.0)](https://github.com/openai/gpt-oss)
