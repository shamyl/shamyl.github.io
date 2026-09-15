---
title: "PrusaSlicer 3.0: Multi-Bed Projects, Plugin System, and a Complete UI Rewrite"
date: 2026-09-03
description: "PrusaSlicer 3.0 is the biggest slicer update in 15 years, with a rewritten UI, multi-bed projects, a Lua plugin system, and true offline mode. Here is what changed, why it matters, and what it means for makers, educators and product teams."
tags: ["3d-printing", "prusaslicer", "prusa", "slicer", "open-source", "maker"]
featured: true
seoTitle: "PrusaSlicer 3.0: Multi-Bed, Plugins, UI Rewrite — What's New"
seoDescription: "PrusaSlicer 3.0 rewrites the UI from scratch, adds multi-bed projects, a Lua plugin system, true offline mode, and redesigned print profiles for multi-tool printers. A practical guide for makers and educators."
canonical: "https://shamylmansoor.com/blog/prusaslicer-3-0-multi-bed-plugins-ui-rewrite/"
---

PrusaSlicer 3.0, released as a public preview on September 1, 2026, is the most significant update to Prusa's open-source slicing software since the original Slic3r commit 15 years ago. The release rewrites the user interface from scratch, introduces a project system built around multiple print beds, adds a sandboxed Lua plugin system, moves print profiles to a layered format designed for multi-tool printers, and includes a true offline mode where networking libraries are not loaded at all. It is an alpha preview — not feature-complete and currently limited to Prusa printers — but the architectural changes signal where desktop 3D printing software is heading.

## In Brief

- The entire user interface has been rewritten from scratch with a new layout: tools at top, scene browser left, contextual panel right
- Multiple beds are now first-class project objects, each with its own printer profile, slicable in parallel
- A sandboxed Lua plugin system lets the community extend the slicer without forking it
- Print profiles move from flat .ini files to layered .yaml designed around modern multi-tool printers
- True offline mode skips loading networking libraries entirely, supporting airgapped environments
- The release is an alpha preview, not feature-complete, currently supporting only Prusa printers
- PrusaSlicer remains open-source under AGPLv3
- The first stable release is expected as PrusaSlicer 3.1.0

## A UI Rewrite, Not a Reskin

The most immediately noticeable change in PrusaSlicer 3.0 is the interface. Prusa did not move buttons around or add rounded corners — the company states that the UI was "rebuilt from scratch" based on how users interact with a slicer in 2026.

The new layout places tools at the top, a scene browser on the left, and a contextual panel on the right. The right panel changes based on what is selected: profile settings when a bed is selected, object-specific options when an object is selected, tool controls when a tool is active. The old interface had features "hidden in places that even experienced users had to hunt for," according to Prusa, and was "intimidating for new users."

Several additions will be familiar to users of other creative software. A View Cube provides camera control similar to CAD applications. Mouse navigation schemes match Tinkercad, Blender, SolidWorks, and Fusion, so users coming from those tools can keep their existing muscle memory. Both dark and light themes are available.

Josef Průša highlighted a "small-big" feature: a favorites system for settings. "Instead of opening the full settings pages all the time, you can build your own small set of everyday controls," he wrote on the [Prusa blog](https://blog.prusa3d.com/prusaslicer-3-0-preview-built-for-the-future-of-3d-printing_137672/). For power users who adjust the same handful of parameters on every print, this reduces the number of clicks per session significantly.

The 3D viewport also received an upgrade, with more advanced OpenGL rendering including shadows, reflections, and ambient occlusion. These visual improvements are configurable and can be disabled entirely for users with limited GPUs or those who prefer the classic look. The viewport also handles denser geometry before lagging, hiding toolpaths during rotation and rendering them only when the camera stops.

## Multiple Beds: From Workaround to Workflow

Multiple beds were introduced in PrusaSlicer 2.9.0, but the implementation was intentionally minimal. In 3.0, beds become real parts of the project system.

Each bed can have its own configurable printer profile. A user with a Prusa MK4S and a Prusa XL can prepare print jobs for both machines side by side in a single window, slice them in parallel, and manage everything in one project file. The nine-bed limit from version 2.9.x has been removed. Models can be dragged between beds.

Even with a single printer, the multi-bed system has practical value. A user can create separate beds for different materials or print settings within the same project, managing an entire print batch in one file rather than juggling multiple PrusaSlicer instances — a workflow that the Prusa team explicitly acknowledged as a past pain point.

Projects also auto-backup locally. If the application crashes, work can be recovered from the `backup_projects` folder in the PrusaSlicer data directory.

## Layered Profiles for Multi-Tool Printers

The print profile system received what may be the most consequential architectural change in this release. Previous versions of PrusaSlicer used a flat profile structure that originated when multi-tool printing was barely a concept. On a printer like the Prusa XL with multiple toolheads — each potentially carrying a different nozzle size — users had to switch between separate printer profiles depending on which tool they wanted to use.

PrusaSlicer 3.0 replaces this with a layered profile system. "The whole print profile system is now layered and designed around modern multi-tool printers, so PrusaSlicer can describe the hardware you actually have instead of forcing it into one fixed combination of settings," Průša wrote. "Choosing a nozzle for a print becomes as easy as choosing the tool from a select box."

The profile format moves from .ini to .yaml, and the preset updater has been rewritten to manage both online and local preset sources in one place. Old 3MF projects from PrusaSlicer 2.x are loaded and configurations are automatically matched to the right system profiles.

This change matters beyond Prusa's own ecosystem. PrusaSlicer is the foundation for several other slicers — OrcaSlicer, SuperSlicer, BambuStudio, Creality Print, Anycubic Slicer Next, QIDI Slicer, ElegooSlicer, Flash Studio Desktop, and Snapmaker Orca all derive from the PrusaSlicer codebase. Architectural improvements in the upstream project eventually benefit the entire family.

## Lua Plugins: Extending Without Forking

PrusaSlicer has always been open-source, which means anyone could fork it and add features. Many did — OrcaSlicer and SuperSlicer exist because of this. But forking carries costs: features diverge, improvements don't flow back, and most forks are eventually abandoned.

The plugin system in PrusaSlicer 3.0 changes this equation. The community can extend the slicer with Lua plugins without forking the codebase. The initial API is purposefully basic — plugins can create objects programmatically and generate projects, but cannot yet manipulate existing objects in the scene. Prusa acknowledges this limitation and says the API will expand.

Two built-in parametric calibration prints ship with 3.0: a Flow Tower and a Temperature Tower. Users select a calibration print, enter parameters in a dialog, and a project with the correct object and settings is generated. The dialog and project-generation logic are distributed as Lua plugins alongside the slicer.

Plugins run in a sandbox by default. They have no access to the disk outside the loaded project, no network access, and no ability to reach data beyond the sandbox boundary. A community plugin marketplace is in development, with a review process for submitted plugins — functioning similarly to how [Printables](https://www.printables.com) handles model submissions.

For educators and makers who want custom calibration routines, model generators, or workflow automations, this plugin system opens a practical extension path that does not require compiling C++ or maintaining a fork.

## True Offline Mode

PrusaSlicer 2.x integrated Prusa Connect and Printables, and while these features were technically optional, some users were uncomfortable with networking processes running at all when online features were disabled.

PrusaSlicer 3.0 introduces a true offline mode where networking libraries are not loaded. No background connections, no firewall alerts, no web-related processes. The company explicitly designed this for airgapped and restricted environments — schools with locked-down networks, industrial facilities with strict security policies, and users who simply prefer no cloud connectivity.

This also connects to Prusa Connect Local, an on-premise version of Prusa Connect that runs on the user's own hardware. The positioning is clear: Prusa does not want to see user files, and the software is designed to work without any cloud dependency.

## Performance and Architecture

The internal refactoring in PrusaSlicer 3.0 addresses years of accumulated technical debt. The codebase grew from a simple slicing tool into software used by millions, including derivatives built on top of it. According to Prusa, the moment they knew a rewrite was necessary was when they looked at obvious bugs and thought: "Yes, this is wrong, but fixing it will cause something worse."

The new architecture features clearly defined responsibilities, interfaces, and data flow. The slicing backend — the proven part — was preserved, but the UI code and much of the application structure were remade. The practical result: faster startup, faster slicing, and parallel slicing of multiple beds.

The application also handles project files differently. Multiple projects can be open in a single instance, each in its own tab with its own context. Dialogs, active tools, and selections do not bleed between projects.

## What This Means for Educators and Makers

For STEAM educators and maker spaces, PrusaSlicer 3.0 addresses several practical pain points:

**Multi-printer management.** A maker space with several Prusa printers can now prepare jobs for all of them in a single window. Each bed gets its own profile, and slicing happens in parallel. This is a meaningful workflow improvement for environments where multiple printers run simultaneously — a common setup in schools and community workshops, similar to how [LearnOSTEAM](/work/learnosteam/) manages multi-device classroom deployments.

**Lower barrier for new users.** The contextual UI and favorites system reduce the learning curve for students and educators new to 3D printing. The old interface required understanding where settings lived across multiple menus. The new interface shows relevant parameters based on context — a meaningful pedagogical improvement when teaching beginners, comparable to how [Godot's integrated editor](/blog/godot-game-engine-steam-education/) lowers the barrier for game development in classrooms.

**Plugin extensibility for education.** Custom calibration prints, educational model generators, and classroom-specific workflows can be built as Lua plugins. A teacher could create a plugin that generates a specific calibration object for a lesson, without modifying the slicer itself.

**Offline operation.** Schools with restricted networks or no internet access can run PrusaSlicer without connectivity concerns. This is particularly relevant for schools in Pakistan and similar markets where network reliability is not guaranteed — a consideration that also applies to [other open-source tools](/blog/blender-5-2-lts-node-physics-creative-coding/) serving education in bandwidth-constrained environments.

## Product Builder's Perspective

From a product-building perspective, PrusaSlicer 3.0 is a case study in managing technical debt at scale. The team recognized that incremental patches on a 15-year-old architecture were producing diminishing returns — the point where bug fixes caused new problems — and chose a ground-up rewrite of the UI layer while preserving the proven slicing engine.

The plugin system is strategically smart. By sandboxing extensions and building a marketplace, Prusa creates an ecosystem where community innovation happens inside the product rather than in competing forks. This is the same platform thinking that has driven adoption in other open-source ecosystems — from VS Code's extension marketplace to Blender's add-on system.

The AGPLv3 licensing decision is notable. Prusa explicitly acknowledges that the GUI rewrite was substantial enough that they could have separated it from the slicing backend and closed the source. They chose not to, honoring the open-source principles the project was built on. This matters for trust, especially in education and government contexts where open-source requirements are common.

The current limitation to Prusa printers only is significant. PrusaSlicer's value has long included its support for non-Prusa hardware. If the stable release maintains this limitation, it could push users toward OrcaSlicer or other derivatives for non-Prusa printers. Prusa has not confirmed whether third-party printer support will return in 3.1.0.

## What to Watch Next

- **PrusaSlicer 3.1.0** — the first stable release, expected to be feature-complete compared to 2.9.6
- **Plugin marketplace launch** — Prusa says it is "almost ready" and will arrive in one of the next releases
- **Third-party printer support** — whether non-Prusa printer profiles return in the stable release
- **Community plugin adoption** — early plugins will indicate whether the Lua API is sufficient for real-world use cases
- **OrcaSlicer and BambuStudio response** — how the downstream forks adapt to or diverge from the new architecture
- **Prusa Connect Local** — the on-premise version of Prusa Connect, which pairs naturally with the offline mode

If you are currently using PrusaSlicer 2.9.x with a Prusa printer, the 3.0 preview is worth testing — but treat it as an alpha. Some features from 2.9.x are not yet ported, and crashes are expected. If you are using non-Prusa printers, stay on 2.9.6 or OrcaSlicer until third-party support returns.

Download PrusaSlicer 3.0.0-preview from the [GitHub releases page](https://github.com/prusa3d/PrusaSlicer/releases/tag/version_3.0.0-alpha11).

## Sources

- [Prusa Blog — PrusaSlicer 3.0 preview announcement](https://blog.prusa3d.com/prusaslicer-3-0-preview-built-for-the-future-of-3d-printing_137672/) (September 1, 2026)
- [VoxelMatters — Prusa Research makes major upgrades with new PrusaSlicer 3.0](https://www.voxelmatters.com/prusa-research-makes-major-upgrades-with-new-prusaslicer-3-0/) (September 1, 2026)
- [GitHub — PrusaSlicer 3.0.0-alpha11 release](https://github.com/prusa3d/PrusaSlicer/releases/tag/version_3.0.0-alpha11)