---
title: "Epic Drops Blueprints From Unreal Engine 6: What It Means for Game Developers and Creative Coding"
date: 2026-11-28
description: "Epic Games will not include Blueprints or Actor Gameplay Framework in Unreal Engine 6, replacing them with Verse and Scene Graph powered by AI-driven tools. Here is what changed, why it matters, and what it means for developers, educators, and Pakistani game teams."
tags: ["unreal-engine", "game-development", "AI", "creative-coding", "Verse", "game-engine"]
featured: true
seoTitle: "Unreal Engine 6 Drops Blueprints for Verse and AI Tools"
seoDescription: "Epic Games removed Blueprints and Actor Gameplay Framework from Unreal Engine 6 in favor of Verse, Scene Graph, and AI-driven conversion. What it means for developers and educators."
canonical: "https://shamylmansoor.com/blog/unreal-engine-6-blueprints-removed-verse-ai-game-development/"
dateModified: "2026-11-28"
---

On November 23, 2026, Epic Games announced that Unreal Engine 6 will not include Blueprints or the Actor Gameplay Framework — two of the most widely used features in the engine's history. Instead, UE6 will be built around Verse, Epic's proprietary programming language, and Scene Graph, a new hierarchical system for organizing game objects. Both are designed to lean heavily on AI for creation and migration. The announcement reverses Epic's earlier commitment to let Blueprints and the new framework coexist during a transition period. For studios, educators, and solo developers who have built their workflows around Blueprints' visual scripting system, this is not a minor update — it is a fundamental change in how Unreal Engine expects you to work.

## In Brief

- Epic confirmed on November 23, 2026 that Blueprints and Actor Gameplay Framework will not be included in Unreal Engine 6
- UE6 will instead use Verse (Epic's proprietary language) and Scene Graph (a hierarchical object system), both designed around AI operability
- Epic says AI advances will help convert UE5 projects to UE6, potentially making migration "fully automatic"
- Clair Obscur: Expedition 33, one of 2025's most acclaimed games, was "95 percent built" with Blueprints, according to developer Sandfall
- Former Valve writer Chet Faliszek says his team will stay on UE5, citing concerns about cross-discipline workflows
- The decision follows Epic's broader "AI-first" business strategy
- European game worker unions published a manifesto on November 17, 2026 warning against unchecked generative AI use in game development

## What Epic Actually Announced

The announcement came in a post on the Unreal Engine website titled "An update on Blueprints and the path to UE6." According to reporting by Game Developer on November 23, 2026, Epic had previously stated in June that Blueprints and Actor Gameplay Framework would coexist in UE6 Early Access and 6.0, allowing UE5 projects to upgrade incrementally while the new Scene Graph framework matured.

That plan is now abandoned. Epic's stated reasoning, quoted by Game Developer, is that "recent advances in AI" have changed the calculus:

> "However, with recent advances in AI capability, we expect AI to massively help with converting UE5 projects to UE6, if not make that process fully automatic. That also means we can deliver UE6 on time (or sooner!) while meeting its design goals: a new data model, a Verse-first architecture, modularity, and AI operability."

The post does not specify which AI capabilities Epic is referring to, nor does it provide details about the conversion process. The claim that migration could be "fully automatic" is a company projection, not a demonstrated capability.

## What Blueprints Is and Why It Matters

Blueprints is Unreal Engine's visual scripting system. Instead of writing C++ code, developers create game logic by connecting nodes in a graph-based editor — dragging wires between inputs and outputs, setting variables, branching on conditions. Since its introduction in Unreal Engine 4, Blueprints has become the primary way that non-programmers — designers, artists, writers, educators — interact with the engine.

The significance of Blueprints is not just that it makes game development more accessible. It enables cross-discipline collaboration. A level designer can prototype a mechanic without waiting for a programmer. A technical artist can build a shader pipeline without touching a text editor. An educator can teach interactive 3D concepts without requiring students to first learn C++.

Clair Obscur: Expedition 33, developed by Sandfall Interactive and one of the most critically acclaimed games of 2025, was "95 percent built" with Blueprints, according to the developer. This is not a niche use case — it is a production-critical tool for studios that shipped award-winning games.

## What Replaces Blueprints: Verse and Scene Graph

Unreal Engine 6 will be built around two new systems:

**Verse** is Epic's programming language, first introduced through Fortnite Creative and UEFN (Unreal Editor for Fortnite). It is a functional language designed for building game logic and interactive experiences. Unlike Blueprints' visual node-based approach, Verse is a text-based programming language. Epic has positioned it as the "Verse-first architecture" for UE6, meaning it will be the primary way to write game logic.

**Scene Graph** is a new hierarchical system for organizing and managing game objects. It replaces the Actor Gameplay Framework, which has been Unreal Engine's core object model since the engine's early days. The Actor framework provided classes like Pawn, Character, and GameMode that developers extended to build their games. Scene Graph is designed to be more modular and, crucially, more amenable to AI-driven creation and manipulation.

Both systems are built around what Epic calls "AI operability" — the idea that AI tools should be able to read, generate, and modify game content programmatically. This is a fundamentally different design philosophy from Blueprints, which was built around human readability and visual editing.

## The Reaction: Developers Push Back

The response from the game development community has been notably critical.

Chet Faliszek, a former writer at Valve and now an independent developer, stated on social media that his team will stay on Unreal Engine 5. According to Game Developer's reporting, Faliszek argued that the current Blueprints system allows team members from different disciplines to take charge of aspects of development, while a move to a prompt-based model removes that capability from their hands.

The concern is not simply about learning a new language. It is about who gets to participate in game development. Blueprints lowered the barrier to entry for non-programmers. Verse raises it again — you need to write code in a text-based language. The promise of AI-assisted creation may eventually lower that barrier in a different way, but that promise is unproven in production settings.

This tension connects to broader industry data. According to the [2026 GDC State of the Game Industry survey](/blog/generative-ai-game-development-gdc-survey-2026/), 40 percent of game industry professionals use generative AI tools, but 52 percent say AI is having a negative impact on the industry — up from 30 percent the prior year. The survey showed that the most common AI use case is research and brainstorming, not production. Epic's bet on AI-driven conversion assumes a level of AI capability that the industry's own data suggests has not yet arrived.

## The European Game Workers' AI Manifesto

Five days before Epic's announcement, on November 17, 2026, game worker unions from Ireland, Spain, and Milan published a joint manifesto warning against unchecked generative AI use in game development. The manifesto, released by the IWGB Game Workers' Branch alongside Game Workers Unite Ireland, CSVI of Spain, and FIOM-CGIL Milan Work Council, argues that generative AI "is currently harming the games industry, its workers and the games they produce."

The manifesto's key claims align with the concerns around Epic's direction: that AI is being sold as an alternative to human workers, that it creates unrealistic pressure on timescales, and that it enables employers to abdicate responsibility for decisions made by automated systems. The document proposes stopping all generative AI use whenever possible and calls for workers to have the right to shape how AI is deployed.

The manifesto does not specifically address Unreal Engine 6. But the timing is instructive. As one of the industry's most important toolmakers pivots toward AI-first development, the workers who use those tools are simultaneously organizing to resist what they see as the harmful effects of AI adoption.

## Why This Matters

The removal of Blueprints from UE6 is not just a technical change — it is a philosophical statement about who game development tools are for.

For over a decade, the trend in game engines has been toward democratization. Blueprints, Unity's visual scripting, and tools like [Godot's GDScript](/blog/godot-game-engine-steam-education/) made game development accessible to people who could not or did not want to write C++. Educational programs, including STEAM curricula, have built courses around visual scripting because it lets students focus on logic and design before confronting syntax.

Epic's decision reverses that trend for Unreal Engine. The new architecture assumes that AI will handle the translation between human intent and code — that instead of connecting nodes in a visual editor, you will describe what you want and an AI will generate Verse code. This is a vision of game development where the human-to-tool interface is natural language, not visual logic.

Whether this vision works in practice is an open question. AI coding tools have shown impressive capabilities in [controlled evaluations](/blog/ai-coding-agents-testing-techniques-dan-luu-eval/), but production game code is vastly more complex than benchmark tasks. The [hidden costs of AI coding tools](/blog/ai-coding-agent-hidden-costs-vibe-tax/) — context management, debugging, architectural coherence — become more acute as project size grows.

## What This Means for Educators and Pakistani Developers

For STEAM educators teaching game development, the UE6 transition creates a curriculum decision. If you are currently teaching Unreal Engine with Blueprints, you now face a question: continue with a tool that will not be in the next major version of the engine, or begin teaching Verse — a language that is still primarily documented in the context of Fortnite Creative.

The practical answer for most educators is to stay on UE5 for now. Epic has stated they have "no interest in changing" UE5, and it remains a mature, well-documented platform. But the long-term question is whether visual scripting survives as a paradigm in game engines at all. [Godot](/blog/godot-game-engine-steam-education/) still offers visual scripting through community plugins. Unity's visual scripting (formerly Bolt) remains part of the engine. If Unreal Engine 6 succeeds without Blueprints, other engine makers may follow Epic's lead.

For Pakistani game developers and technology teams, the UE6 transition has two implications. First, studios currently using Unreal Engine need to plan for a migration path — whether that means investing in Verse training, evaluating alternative engines, or committing to UE5 for the foreseeable future. Second, the shift toward AI-assisted development could be an opportunity. Pakistani developers who build expertise in AI-driven game creation tools may find themselves in demand as studios worldwide navigate the same transition.

For makers and creative coders, the lesson is broader. The tools we use shape what we can create. When a toolmaker removes a feature that enabled non-programmers to build games, the community of creators contracts — at least temporarily. The promise of AI is that it will expand that community again, in a different way. Whether that promise is kept will determine whether UE6's bet on AI operability is remembered as visionary or premature.

## What to Watch Next

- **UE6 Early Access release date**: Epic has not announced a specific date, but the removal of Blueprints was framed as a way to deliver UE6 "on time (or sooner)"
- **AI conversion tool quality**: The claim that AI can convert UE5 Blueprints projects to Verse automatically will be tested as soon as UE6 is available
- **Verse documentation and education resources**: Currently, Verse documentation is primarily oriented toward Fortnite Creative. Broad engine-level documentation will be essential for adoption
- **Studio migration decisions**: Whether studios follow Sandfall's lead (staying on UE5 with Blueprints) or begin migrating to Verse will indicate industry confidence in the new architecture
- **Open-source engine adoption**: If developers leave Unreal Engine over this change, [Godot](/blog/godot-game-engine-steam-education/) and other open-source engines may see increased interest

## Sources

- [Game Developer: "Epic Games no longer plans to include Blueprints or Actor Gameplay Framework in Unreal Engine 6"](https://www.gamedeveloper.com/programming/unreal-engine-6-to-remove-blueprints-and-actor-gameplay-framework-from-the-beginning) (November 23, 2026)
- [Game Developer: "European Game Worker unions publish manifesto warning against unchecked AI usage"](https://www.gamedeveloper.com/production/europe-s-game-worker-unions-publish-a-manifesto-warning-against-unchecked-ai-usage) (November 17, 2026)
- [Epic Games: "An update on Blueprints and the path to UE6"](https://www.unrealengine.com/blog/an-update-on-blueprints-and-the-path-to-ue6) (referenced via Game Developer reporting)
- [GDC State of the Game Industry 2026 survey data](https://www.gamedeveloper.com/business/the-2026-state-of-the-game-industry-report-is-here) (via Game Developer analysis, November 12, 2026)
- [Epic Games Developer Community: Verse Language Documentation](https://dev.epicgames.com/documentation/en-us/uefn/verse-language)
