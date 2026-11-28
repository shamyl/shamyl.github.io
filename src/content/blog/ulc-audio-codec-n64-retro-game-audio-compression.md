---
title: "How the ULC Audio Codec Brings Near-Opus Quality Sound to the Nintendo 64"
date: 2026-11-06
description: "The Ultra Low Complexity Codec, created by developer Aikku93, delivers 44.1 kHz stereo audio at near-Opus bitrates on the N64's 93 MHz CPU using just 4% of processor time. Dominic Szablewski ported it to the RSP co-processor with AI-assisted assembly, and a Half-Life N64 port already ships with it. Here is what ULC does, how it works, and why it matters for retro game development, preservation, and constrained-platform programming."
tags: ["retro-gaming", "audio-codec", "N64", "creative-coding", "game-development", "open-source"]
featured: true
seoTitle: "ULC Audio Codec on N64: Near-Opus Quality at 4% CPU"
seoDescription: "The ULC audio codec delivers 44.1 kHz stereo audio at near-Opus bitrates on the N64 using 4% of CPU time. How it works, AI-assisted RSP porting, and what it means for retro game development."
canonical: "https://shamylmansoor.com/blog/ulc-audio-codec-n64-retro-game-audio-compression/"
dateModified: "2026-11-06"
---

The Nintendo 64 has always been the odd console out when it comes to audio. The PlayStation could stream uncompressed CD audio directly; the N64 had cartridges with a fraction of the storage and a 93 MHz CPU with limited access to its own vector co-processor. For thirty years, developers worked within these constraints using ADPCM compression that cut file sizes by a factor of four but still left a five-minute stereo track occupying roughly 12 MB — larger than the entire Super Mario 64 ROM. Now, an obscure transform codec called ULC (Ultra Low Complexity), created by a developer known as Aikku93, changes the math entirely. It delivers 44,100 Hz stereo audio at near-Opus bitrates while using approximately 4% of the N64's CPU time and 5% of its RSP co-processor time. The codec has already been merged into Libdragon, the open-source N64 development library, and a community port of Half-Life to the N64 ships with ULC as its primary audio format.

## In Brief

- ULC is a transform-based audio codec created by developer Aikku93, in development since 2019, that uses a full-band MDCT approach with nibble-based coefficient encoding
- On the N64, ULC delivers 44.1 kHz stereo audio at near-Opus quality while consuming approximately 4% of CPU time and 5% of RSP time
- Dominic Szablewski (phoboslab) ported ULC to the N64's RSP co-processor in 16-bit fixed point, producing roughly 1,400 lines of MIPS assembly that fit in the RSP's 4,096-byte instruction memory
- The RSP port was developed iteratively using OpenAI's Codex and RSPL, a C-like language for the RSP created by Max Bebök
- A community port of Half-Life to the N64, built primarily with Claude Opus 5.5, uses ULC to fit 2,500 sounds and 27 music tracks into a single 64 MB cartridge
- ULC is merged into Libdragon's preview branch and available under a permissive license

## The N64 Audio Problem

To understand why ULC matters, it helps to recall just how constrained the N64's audio situation was. The console's MIPS VR4300 CPU ran at 93.75 MHz. The Reality Signal Processor (RSP) — a custom vector co-processor capable of parallel 16-bit operations — was technically available for audio tasks, but Nintendo guarded direct access to it for much of the console's lifespan. Third-party developers had to use Nintendo's Libultra library, which internally used the RSP for ADPCM decompression.

ADPCM (Adaptive Differential Pulse Code Modulation) compresses audio by encoding the difference between consecutive samples rather than absolute values. It reduces file size by a factor of four compared to raw PCM. But a five-minute stereo track at 44.1 kHz still occupies about 12 MB — and the largest N64 cartridges were 64 MB total, shared with game code, textures, and everything else. This is why most N64 games used tracker-style music: short instrument samples triggered and pitch-shifted at the right moments, rather than full recorded audio tracks.

Late in the N64's life, Rare got permission to use the RSP directly for Conker's Bad Fur Day, decoding MP3 audio for the game's extensive dialogue. But MP3 decoding was expensive enough that it caused frame rate drops during gameplay — workable for cutscenes, not for continuous background music.

## What ULC Does Differently

ULC is a transform codec, which puts it in the same family as MP3, Opus, and AAC. Like MP3, it uses the Modified Discrete Cosine Transform (MDCT) to convert audio from the time domain to the frequency domain, where compression is more efficient. But ULC strips away most of the complexity that makes MP3 and Opus computationally expensive.

The key design decisions, as described in Aikku93's [GitHub repository](https://github.com/Aikku93/ulc-codec) and Szablewski's [detailed blog post](https://phoboslab.org/log/2026/11/n64-ulc-codec), are:

- **Full-band MDCT instead of sub-band splitting.** MP3 divides the signal into 32 frequency bands and processes them separately. ULC applies a single MDCT across the entire signal, eliminating the band-splitting overhead.
- **Nibble-based coefficient encoding instead of Huffman coding.** Each frequency coefficient is stored in exactly 4 bits as a signed integer. Specific reserved values signal zero runs, quantizer changes, or noise fill — all without any bit-level entropy decoding. The entire coefficient unpacking logic is roughly 150 lines of C.
- **Built-in noise fill.** ULC can insert synthesized noise directly into sparse frequency regions, which is particularly effective for percussive sounds like cymbals and hi-hats. MP3 has no equivalent and must encode quasi-random coefficients as-is.

The result is a codec that produces usable audio even at 16 kbps and approaches Opus quality at comparable bitrates, while being dramatically simpler to decode. Aikku93 demonstrated this by building a ULC player for the Game Boy Advance — a 16 MHz ARM CPU with no vector instructions — that plays recorded music at 70 kbps with quality comparable to MP3 at the same bitrate.

## Porting ULC to the N64's RSP

Getting ULC to run on the N64 CPU was straightforward — Szablewski compiled the reference decoder and produced a working proof of concept in an evening. But a decoder that hogs the CPU is useless for games. Background music and dialogue need to play while the game is running. The solution was to move the inverse MDCT (the most expensive part of decoding) to the RSP co-processor.

This is where the constraints get severe. The RSP has 4,096 bytes of data memory and 4,096 bytes of instruction memory. It operates in 16-bit or 32-bit fixed point — no floating point. The standard ULC MDCT block size is 2,048 samples, which in 16-bit fixed point would require 4,096 bytes just for the input, leaving no room for the lapping buffer or temporary values.

Szablewski's solution was to reduce the block size to 1,024 samples and use 16-bit fixed point (Q1.14 format) throughout. This produces a data footprint of 3,072 bytes: 1,024 samples for the current block plus 512 for the lapping buffer, each at 2 bytes. After refactoring the reference decoder to 16-bit fixed point and verifying that the noise floor was imperceptible, the remaining challenge was writing the RSP code.

Rather than hand-writing MIPS assembly — a skill Szablewski describes as "very basic" — he used RSPL, a C-like language for the RSP created by Max Bebök ([github.com/HailToDodongo/rspl](https://github.com/HailToDodongo/rspl)). He fed the C code to OpenAI's Codex in iterative steps, translating pieces to RSPL and verifying each result. Subsequent passes optimized the assembly output directly, minimizing pipeline stalls. The final output is approximately 1,400 lines of MIPS assembly that barely fits in the RSP's 4,096-byte instruction memory. It handles the IMDCT, lapping, stereo interleaving, and output scaling.

The C-side decoder remains handwritten. As Szablewski notes: "LLMs have no taste."

The performance results: a single 44,100 Hz stereo track costs about 4% of CPU time and 5% of RSP time. That leaves plenty of headroom for gameplay, graphics, and other audio. ULC's complexity is roughly four times that of ADPCM — a manageable increase given the dramatic improvement in compression ratio and audio quality.

## Half-Life on N64: ULC's First Real-World Test

In a concrete validation of the codec's capabilities, a community port of Half-Life to the Nintendo 64 uses ULC as its primary audio format. The project, available on [GitHub](https://github.com/ToxyCola/Half-Life-Nintendo-64-Port), was built primarily using Claude Opus 5.5 and runs on stock N64 hardware with an Expansion Pak. According to the project's README, ULC is what makes it possible to fit 2,500 sounds and 27 music tracks into a single 64 MB cartridge image.

The port uses Libdragon and tiny3d, a custom N64 engine, rather than Valve's GoldSrc engine (which was never released as source code). Valve's player physics code — `pm_shared.c` and `pm_math.c` — is compiled for the N64's VR4300 CPU unmodified. The fact that ULC audio compression is specifically credited in the project's documentation as the enabling technology for fitting the content into 64 MB speaks to the practical difference it makes: ADPCM at the same quality would have required substantially more space.

## Why This Matters

### Constrained-Platform Programming Is Not Dead

The ULC story is a reminder that efficiency gains sometimes come not from more compute but from better algorithms. ULC does not require a faster processor or more memory than the N64 already has. It requires a different approach to the same mathematical problem — one that trades sub-band complexity for full-band simplicity and replaces entropy coding with nibble-aligned values. This is the same kind of thinking that drove [TinyWorldformer's 26K-parameter world model running on a Raspberry Pi Pico 2 W](https://shamylmansoor.com/blog/tinyworldformer-world-model-games-raspberry-pi-pico-2/): the constraint is not the hardware, it is the assumption that you need a large, complex system to do useful work.

For educators teaching programming on constrained platforms — microcontrollers, retro consoles, embedded systems — ULC is a case study in how algorithmic elegance can outperform brute force. The codec's entire coefficient unpacking routine is 150 lines of C. The N64 RSP assembly is 1,400 lines. A student can read and understand the whole system in an afternoon.

### AI-Assisted Assembly Programming Has Arrived

The ULC RSP port is also a data point in the ongoing conversation about [AI tools reshaping game development and code translation](https://shamylmansoor.com/blog/ai-game-decompilation-modding-switch-2-jailbreak-xbox-labs/). Szablewski explicitly notes that earlier attempts with GPT-5 failed — the model ignored RSP delay slots and other architectural intricacies. But using Codex iteratively, with RSPL as an intermediate language and human verification at each step, produced working assembly that was then further optimized.

This is the pattern that has emerged across multiple projects in 2026: [AI porting a 1993 Amiga game from assembly to Godot](https://shamylmansoor.com/blog/ai-porting-retro-games-godot-babylonian-twins/), AI assisting in Switch 2 jailbreaks, and now AI writing RSP assembly for a 1996 console. The common thread is not that AI replaces human expertise — Szablewski still had to understand the architecture, design the API, and write the C-side decoder — but that it dramatically lowers the barrier for tedious, error-prone translation work that a skilled developer would otherwise spend weeks on.

### Open Source Keeps Retro Platforms Alive

Libdragon, the open-source N64 development library, has been the foundation for most of the N64 homebrew renaissance. ULC is now merged into its [preview branch](https://github.com/n64brew/libdragon/tree/preview), alongside an RSP-accelerated Opus decoder and the existing ADPCM decoder. This means any developer building N64 software with Libdragon can use ULC as transparently as any other audio codec — no special configuration required.

The Half-Life N64 port is built on Libdragon. Szablewski's own N64 game, Xibalba 64, is built on Libdragon. The ecosystem that makes these projects possible exists because the N64 homebrew community invested years in documentation, tooling, and open-source libraries — the same kind of patient infrastructure work that [Godot has done for game engine development](https://shamylmansoor.com/blog/godot-game-engine-steam-education/) and that enables creative coding education more broadly.

## For Educators and Makers

The ULC codec has several properties that make it valuable as a teaching tool:

- **Readability.** The reference decoder is small enough to read in a single sitting. A student can trace an audio sample from PCM input through MDCT, quantization, nibble encoding, and back — understanding every step.
- **Real-world impact.** This is not a toy codec. It ships in a Half-Life port that runs on real N64 hardware. Students can see the results of their work on a physical console.
- **Constraint-driven design.** ULC's design choices — full-band MDCT, nibble alignment, noise fill — all derive from the constraint of decoding on limited hardware. It is a case study in how constraints produce elegance.
- **Cross-platform.** The same code compiles for the N64, desktop, and WebAssembly. A student can start in a browser, move to native, and eventually flash a physical cartridge.

For STEAM programs working with [platforms like LearnOSTEAM](https://shamylmansoor.com/projects/learnosteam/) that teach coding through hands-on projects, ULC offers a bridge between abstract computer science concepts (transforms, quantization, entropy coding) and tangible creative output (audio playing on a real device).

## What to Watch Next

- **More N64 ports using ULC.** The Half-Life port demonstrates that ULC is production-ready. Other community ports and original N64 homebrew projects are likely to adopt it.
- **ULC on other constrained platforms.** The GBA demo proves ULC works on 16 MHz ARM. Microcontrollers, retro handhelds, and embedded audio systems are all candidates.
- **AI-assisted assembly for other retro architectures.** The RSPL + Codex approach used for the N64 RSP could apply to the PlayStation's SPU, the Sega Saturn's SCSP, or other retro audio processors with custom instruction sets.
- **Improved ULC encoder quality.** Aikku93 has been improving the encoder since 2019. Further work on psychoacoustic modeling could close the remaining quality gap with Opus at equivalent bitrates.

## Sources

- Dominic Szablewski, "Why this Obscure Audio Codec is a Perfect Fit for the N64," PhobosLab, November 3, 2026 — [phoboslab.org/log/2026/11/n64-ulc-codec](https://phoboslab.org/log/2026/11/n64-ulc-codec)
- Aikku93, ULC Codec source repository — [github.com/Aikku93/ulc-codec](https://github.com/Aikku93/ulc-codec)
- Aikku93, ULC Player for Game Boy Advance — [github.com/Aikku93/ulcplayer-gba](https://github.com/Aikku93/ulcplayer-gba)
- Dominic Szablewski, ulc64 demo — [github.com/phoboslab/ulc64](https://github.com/phoboslab/ulc64)
- ToxyCola, Half-Life Nintendo 64 Port — [github.com/ToxyCola/Half-Life-Nintendo-64-Port](https://github.com/ToxyCola/Half-Life-Nintendo-64-Port)
- Max Bebök, RSPL (RSP Programming Language) — [github.com/HailToDodongo/rspl](https://github.com/HailToDodongo/rspl)
- Libdragon N64 development library, preview branch — [github.com/n64brew/libdragon](https://github.com/n64brew/libdragon)
- Dominic Szablewski, "How to Make a Nintendo 64 Game in 2026," PhobosLab, August 2026 — [phoboslab.org/log/2026/08/xibalba64-making-of](https://phoboslab.org/log/2026/08/xibalba64-making-of)
