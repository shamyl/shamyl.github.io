---
title: "When AI Ports Your 30-Year-Old Game: What Babylonian Twins Teaches About LLM Code Translation"
date: 2026-09-04
description: "A developer used Claude Fable 5 to port a 1993 Amiga game from 68000 assembly to Godot. The result reveals what AI-assisted code translation does well, where it silently fails, and what it means for game preservation and creative coding."
tags: ["AI coding", "game development", "Godot", "creative coding", "game preservation", "LLM"]
featured: true
seoTitle: "AI Porting Retro Games: Babylonian Twins from Amiga to Godot"
seoDescription: "A developer used Claude to port a 1993 Amiga game from 68000 assembly to Godot. What AI code translation got right, where it failed, and what it means for game preservation."
canonical: "https://shamylmansoor.com/blog/ai-porting-retro-games-godot-babylonian-twins/"
---

In 1993, in Baghdad under sanctions, an engineering student named Rabah Shihab wrote a game called Babylonian Twins on an Amiga 500 — 512 KB of RAM, no hard drive, pure 68000 assembly. Thirty-three years later, he used an AI assistant to port the entire game to Godot, including 72,758 lines of assembly that no human had read in decades. The result is a working game on Steam, iOS, and Android — and a detailed case study in what large language models can and cannot do when asked to translate code across architectures, decades, and paradigms.

## In Brief

- Babylonian Twins, originally written in 68000 assembly on an Amiga 500 in 1993, has been ported to Godot using Claude Fable 5 running in Claude Code
- The AI rebuilt 34,000 lines of C++ from a 2010 iOS port in a single evening, and reconstructed 72,758 lines of 1993 assembly into a working Godot project over a weekend
- The port includes the original 1993 game running inside the modern build, switching between 50 Hz and 60 Hz tick rates
- Several bugs slipped through — a guard's attack range extended through solid rock, trampoline physics shifted subtly, and a door-list parsing error locked the tutorial exit
- The original Amiga game is now freely available on itch.io, with the Definitive Edition on Steam this fall
- The case study offers practical lessons for anyone considering AI-assisted code translation, game preservation, or retro porting

## The Project: Three Steps, Each Harder Than the Last

Shihab, now running BitHunch LLC, designed the port as a deliberate test of what an LLM could do with code it was unlikely to have seen in training. Amiga assembly is not a common language in modern AI training sets. If the model was reasoning rather than recalling, this is where it would show.

He planned three steps, each conditional on the previous one working:

**Step one** was the safe ask: move 34,000 lines of C++ from a 2010 iOS port into Godot 4. This was the control — code the model might reasonably have encountered.

**Step two** was the unfair ask: take the original 72,758 lines of 68000 assembly, written for a machine out of production since 1994, with minimal comments and no documentation, and rebuild it in Godot at the Amiga's original 50 Hz frame rate.

**Step three** was the greedy ask: put the 1993 rebuild inside the modern one, so launching the Steam version gives you both games.

All three worked. The timestamps from step one tell the story: 22:23 for project scaffold, 22:44 for a playable character with collision and physics, 23:19 for all 38 entity types, 00:35 for full screen flows, 02:15 for exporting to macOS, iOS, and Android. Twenty-one minutes from empty project to playable character — work that took months in 2010.

## What the AI Did Well

The assembly port is the more interesting achievement. Before writing any Godot code, the AI made the 1993 sources assemble again using vasm (a modern 68000 assembler), and kept going until the output was byte-identical to the shipped binaries. This was not a trivial task: the original code was written in ASM-One, whose dialect differs from vasm's in ways that change the assembled bytes. The AI wrote a preprocessing pass to bridge five dialect differences, rebuilt broken filename mappings, and dealt with an `org` directive that could move the location counter backwards — something vasm does not support.

The level format was particularly challenging. A level is a grid of tiles stored as a list of numbers in a private 1993 layout. The level loader is 1,652 lines of uncommented assembly. The AI went to the code that reads the bytes and worked backwards from there, identifying tile sets, object tables, and screen markers. A year earlier, an older model had needed several rounds and human hints to parse the same format. Claude Fable 5 did it in a single pass.

The AI also identified things the developer himself had forgotten. Doors in the game are not stored in the map data — they are stamped onto the map at runtime by an 18-byte object record. For 33 years, Shihab would have said doors were map data. The AI held both facts, found the routine that reconciles them, and came back with the correct design.

The copper sky gradient — a list of 24 color values painted onto scanlines by the Amiga's video coprocessor — was missed in the first rebuild. The levels looked fine but flat. A pixel comparison flagged the difference, and the gradient went back in.

## Where It Silently Failed

The most instructive parts of the case study are the bugs that slipped through.

**The guard bug.** In level 2, a player walking along a corridor with no visible enemy takes a hit from a soldier standing 13 tiles above, through solid rock. The original assembly had a two-sided bounds check on the guard's "shove" attack: if the vertical distance was 4 or more rows below, or 2 or more rows above, the attack did not fire. The port kept the lower bound and dropped the upper one. A shove meant to cover the guard's own three rows now ran the entire height of the map column beneath him.

**The trampoline bug.** The trampoline felt too high. The physics constants checked out — a 20-line simulation predicted 19.1 tiles, and the build measured 19.5. The problem was input semantics. The 2010 iOS build was event-driven, and a workaround for a tvOS quirk meant a held jump button read as released until physically pressed again. Godot polls input and kept reporting the hold. Reproducing that accident is what makes the high bounce require a fresh, well-timed press — which is how the game played on a phone, and what the developer's hands expected. The 2010 source does not record this, because from the source's point of view nothing unusual was happening.

**The door-list bug.** A door listed as "p1,p2,p3,p4" — meaning it required all four palm keys — was read as a single key with a strange name. The tutorial exit never opened.

**The statue corruption.** A requested feature to let the twin characters swap places at any distance caused statues to corrupt each other's tiles. The proximity check that prevented this was never a distance limit — it existed because the idle twin is stamped into the map as a statue, and two overlapping statues eat each other's tiles.

Each of these bugs has the same shape: the AI translated the code correctly at the syntactic level but missed a semantic constraint that existed only in the interaction between the code, the hardware, and the player's muscle memory. The developer notes that he made the same kinds of mistakes himself in 2010, slowly, over months.

## What This Means for Game Preservation

The Babylonian Twins port is one of the most detailed public accounts of AI-assisted retro game porting. It suggests several things for the broader field of game preservation and digital heritage.

First, AI-assisted translation can dramatically reduce the cost of porting abandoned software. The 2010 port took months of nights and weekends. The AI-assisted port took days. If this approach generalizes — and it may not, given how unusual 68000 assembly is in training data — it could make it feasible to rescue games that would otherwise be lost to hardware obsolescence.

Second, the byte-identical verification step is essential. The AI's decision to rebuild the 1993 binaries and diff them against the shipped files created a ground truth that made every subsequent claim checkable. Without that step, the assembly port would have shipped with the guard bug, the door bug, and several other defects that were only findable by comparing outputs.

Third, human review remains necessary for semantics that code alone does not capture. The trampoline bug could not be found by reading code — it existed in the gap between how the code behaved and how the game felt. The developer's 13-year-old son, playing every build, was part of the testing loop. The AI added command-line flags to drive the game headlessly and dump state, but it could not assess whether a jump "felt right."

## Why This Matters for Educators and Makers

For STEAM educators and maker communities, the Babylonian Twins story is relevant in two ways.

The first is practical: tools like Godot and Claude Code are lowering the barrier to creating and restoring interactive software. A student with a laptop and an AI assistant can now attempt projects that would have required a team and months of specialized knowledge. The [Godot engine](https://shamylmansoor.com/blog/godot-game-engine-steam-education/) — free, MIT-licensed, and running on everything from Chromebooks to workstations — is already the strongest candidate for classroom game development. AI-assisted porting extends that accessibility to existing software, including educational software that might otherwise be lost.

The second is cautionary. As [research on AI coding tools and developer skill](https://shamylmansoor.com/blog/ai-coding-tools-developer-skill-atrophy/) shows, cognitive friction is the mechanism through which expertise forms. When an AI assistant handles the difficult parts of code translation, the human learns less about how the translation works. Shihab explicitly notes that he "wasn't testing alone" and that the AI went "faster than I could follow." He spent weeks afterward reading what had been done to his own game, finding bugs the AI had introduced and he had not noticed.

For product builders and CTOs, the [hidden costs of AI coding agents](https://shamylmansoor.com/blog/ai-coding-agent-hidden-costs-vibe-tax/) are visible here in a concrete form: the AI shipped store listings, screenshots in eleven languages, and metadata — work that would have taken evenings of manual effort — but it also introduced subtle defects that required expert review to catch. The velocity gain is real. The quality control overhead is also real.

## Product Builder's Perspective

From a product-building perspective, the most striking thing about this port is not the AI's capability but the workflow design around it. Shihab structured the project as a series of conditional steps, each one dependent on the previous one working. He used the AI for the tedious work — assembling toolchains, parsing binary formats, generating store assets — and reserved human judgment for the things only he could assess: whether a jump felt right, whether a door opened when it should, whether the game was still the game he made in 1993.

The AI also did something the developer had never done: it rebuilt the 1993 binaries from source and verified them byte-for-byte against the shipped disks. In 18 years, Shihab had never considered this worth an afternoon. The AI did it unprompted, and it turned out to be the most important step in the project. Every subsequent claim about the game could be settled by comparing bytes.

For technology teams considering AI-assisted code translation — whether porting legacy systems, migrating between frameworks, or modernizing old products — the lesson is to invest in verification infrastructure before trusting the output. The AI can generate code faster than you can review it. The bottleneck is not generation. It is validation.

## What to Watch Next

- **Godot 4.8** is already in dev snapshots, with improved C# support and rendering performance. The engine's growth trajectory makes it increasingly viable for professional game development, not just education and hobby projects.
- **AI-assisted code translation** is likely to become a standard tool for software preservation projects. The Internet Archive and the Video Game History Foundation have both expressed interest in AI-assisted approaches to preserving legacy software.
- **Claude Fable 5's** performance on 68000 assembly — a language with minimal training data — suggests that frontier models are improving at reasoning about unfamiliar code, not just recalling familiar patterns. This has implications beyond game porting: any organization with legacy code in unusual languages may find AI-assisted translation increasingly viable.
- **Babylonian Twins: Definitive Edition** launches on Steam this fall, with the 1993 Amiga original included inside every copy. The free demo is available now, and the original Amiga disk images are free on [itch.io](https://babyloniantwins.com).

## Sources

- [Babylonian Twins blog post: "Porting my 1993 Amiga game to Godot, with an LLM reading the 68000 assembly"](https://babyloniantwins.com/blog/porting-a-1993-amiga-game-to-godot/) — Rabah Shihab, September 1, 2026
- [Babylonian Twins story page](https://babyloniantwins.com/story) — BitHunch LLC
- [Babylonian Twins on itch.io](https://babyloniantwins.com) — free 1993 Amiga original
- [Godot Engine official site](https://godotengine.org) — MIT-licensed game engine
- [vasm 68000 assembler](http://sun.hasenbraten.de/vasm/) — modern 68000 assembly toolchain