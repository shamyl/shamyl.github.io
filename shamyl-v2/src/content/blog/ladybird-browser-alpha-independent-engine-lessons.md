---
title: "Ladybird Browser Reaches Alpha: What Building a Browser Engine From Scratch Teaches About Product Engineering"
date: 2026-11-25
description: "The Ladybird Browser Initiative has shipped its first alpha — a new web browser engine built from scratch, funded by donations, and developed by a small team. Here is what the project's architecture decisions, Rust migration, and open source governance changes reveal about building ambitious software products in the AI era."
tags: ["browser-engine", "Ladybird", "open-source", "product-engineering", "Rust", "software-architecture"]
featured: true
seoTitle: "Ladybird Browser Alpha: Building a Browser Engine From Scratch"
seoDescription: "Ladybird's alpha release shows how a small non-profit team built a browser engine from scratch, migrated C++ to Rust with AI, and passed Safari on web standards tests."
canonical: "https://shamylmansoor.com/blog/ladybird-browser-alpha-independent-engine-lessons/"
dateModified: "2026-11-25"
---

On November 23, 2026, Andreas Kling announced that [Ladybird](https://ladybird.org/posts/alpha/) — a web browser with a new engine built entirely from scratch — had entered alpha, with downloadable builds available for macOS and Linux. The milestone is remarkable for several reasons: the project is funded entirely by donations, it uses no code from Chromium, Gecko, or WebKit, and it passed Safari Technology Preview on the Web Platform Tests in October 2026. For product builders, the Ladybird story offers concrete lessons about architecture decisions, language migrations, open source governance, and what it means to build ambitious software in an era when AI tools are reshaping how code gets written.

## In Brief

- Ladybird shipped its first alpha on November 23, 2026, with rolling builds for macOS and Linux — available as disk image, Flatpak, and standalone archive
- The project is a US 501(c)(3) non-profit funded entirely by donations and sponsorships, with Platinum sponsors including Shopify, Cloudflare, and FUTO
- The codebase has 68,882 GitHub stars, 1,547 contributors, and a language mix of Rust (48.1M bytes), HTML (41.8M), and C++ (39.3M) according to the GitHub API
- In February 2026, the team used Claude Code and Codex to port the JavaScript engine's frontend pipeline from C++ to Rust — approximately 25,000 lines in two weeks, with zero test regressions across 65,359 tests
- In June 2026, Ladybird closed public pull requests, citing AI-generated contributions as a reason they can no longer use PRs as a signal of contributor intent and good faith
- On October 26, 2026, Ladybird passed Safari Technology Preview on Web Platform Tests, reaching 2,184,722 subtests

## Why Build a Browser Engine From Scratch

Every major browser today runs on one of three engines: Blink (Chromium, Chrome, Edge, Brave, Arc, Opera), Gecko (Firefox), or WebKit (Safari). All three are open source, but as Chris Wanstrah — GitHub co-founder and Ladybird co-founder — [noted in 2024](https://ladybird.org/posts/why-ladybird/), they are all effectively funded by Google's advertising empire, either directly or through search default deals. The web is too important a platform to have a single funding source, and that source being advertising creates structural incentives that may not align with user interests.

Ladybird's answer is to build a new engine from the ground up. Not a fork. Not a Chromium wrapper. A genuinely independent implementation of web standards, funded by unrestricted donations, with no monetization model — no search deals, no crypto tokens, no user data sales.

This is a product decision worth examining. Most teams building a browser would start with Chromium and customize it. The [Ladybird FAQ](https://ladybird.org/) explicitly addresses this: the engine is original code, though it does use third-party libraries for common functionality like image, audio, and video formats. The project began as part of SerenityOS, which had a culture of writing everything from scratch, and has since forked into its own independent project.

For product builders, the from-scratch decision has obvious trade-offs: it multiplies the engineering effort, means you cannot lean on a decade of optimizations from Google or Apple engineers, and requires implementing an enormous surface area of web standards. The benefit is architectural freedom — no inherited technical debt, no conflicts of interest with upstream maintainers, and the ability to make design decisions based solely on what serves the user.

## The Rust Migration: A Practical AI-Assisted Porting Case Study

In February 2026, Kling published a [post about adopting Rust](https://ladybird.org/posts/adopting-rust/) as Ladybird's C++ successor language. The team had previously tried Swift and rejected it due to poor C++ interop and limited platform support. Rust was chosen for its ecosystem maturity and safety guarantees — both Firefox and Chromium had already begun introducing Rust into their codebases.

The first target was LibJS, Ladybird's JavaScript engine. The lexer, parser, AST, and bytecode generator were ported from C++ to Rust. According to Kling, the translation was done using Claude Code and Codex, but explicitly described as "human-directed, not autonomous code generation." He decided what to port, in what order, and what the Rust code should look like. The process involved hundreds of small prompts steering the agents, followed by multiple passes of adversarial review using different models.

The results are worth noting:

- Approximately 25,000 lines of Rust produced in about two weeks
- Byte-for-byte identical bytecode output to the C++ pipeline
- Zero regressions across 52,898 test262 tests and 12,461 Ladybird-specific tests
- No performance regressions on tracked JS benchmarks

Kling noted that the same work would have taken multiple months by hand. The Rust code intentionally mimics C++ patterns — register allocation, object shapes — to ensure identical output. It is not idiomatic Rust, and cleanup is deferred until the C++ pipeline can be retired.

This is one of the most documented real-world examples of AI-assisted language migration at scale. For CTOs and product teams considering similar migrations, the key takeaways are: the human direction mattered enormously, the test suite was the safety net, and the result was deliberately unidiomatic to prioritize correctness over style. This is not "AI wrote my migration" — it is "an expert engineer used AI as a force multiplier on a well-scoped, well-tested subsystem."

For teams dealing with [technical debt in startup environments](/blog/technical-debt-startup-cto-lessons/), the Ladybird approach offers a template: identify a self-contained subsystem with comprehensive tests, define the target architecture, use AI to accelerate the mechanical translation, and verify with existing test coverage.

## Closing Public Pull Requests: Open Source Governance in the AI Era

In June 2026, Ladybird made a decision that generated significant discussion: [closing public pull requests](https://ladybird.org/posts/changing-how-we-develop-ladybird/) entirely. Going forward, only project maintainers would introduce code changes.

The reasoning is directly relevant to anyone building open source software in 2026. For decades, pull requests served as a signal: a substantial patch implied substantial effort, and that effort was a reasonable proxy for good faith. AI tools have broken that assumption. A pull request that looks like weeks of work may have been generated in minutes.

For a browser, this matters more than for most projects. A browser executes untrusted code from the entire internet on a user's machine. One well-disguised vulnerability is all an attacker needs. Ladybird's team explicitly cited the risk of patient, well-resourced campaigns to earn maintainer trust and abuse it — now accelerated by AI making it cheaper to produce work that looks like a serious contribution.

This connects to broader questions about [AI coding tools and developer skill](/blog/ai-coding-tools-developer-skill-atrophy/). When the effort signal disappears, projects need new mechanisms for trust and quality control. Ladybird's answer is to restrict code introduction to maintainers who are responsible for what enters the codebase. The project remains open source — the code is public, bug reports and testing contributions are welcome — but the contribution model has fundamentally changed.

For product teams running open source projects, this is worth watching. The traditional open source contribution pipeline was designed for a world where producing code required time and skill. AI has commodified both, and governance models need to adapt.

## Passing Safari on Web Platform Tests

The Web Platform Tests (WPT) project is a cross-browser test suite that measures how correctly a browser implements web standards. In October 2026, Ladybird passed Safari Technology Preview on WPT — a significant milestone for a project that started as a hobby HTML viewer.

According to the [October 2026 newsletter](https://ladybird.org/newsletter/2026-10-31), Ladybird ended the month at 2,184,722 subtests, a gain of 75,650. The team pointed AI coding agents at WPT failures and asked them to fill in missing functionality. The result was lots of small fixes that added up — the biggest gains were about 30,000 in CSS and 10,000 in editing.

Other October achievements include a JavaScript JIT for LibJS on x86-64 and AArch64, a new WebAssembly engine with its own interpreter and JIT (scoring about 7x higher on JetStream 3 Wasm workloads), and moving style and layout off the main thread — a feature the team claims no other browser currently matches, though this has not been independently verified.

This is not the same as being competitive with Chrome on real-world performance. But passing Safari on standards compliance means Ladybird is no longer a toy. It is a browser that correctly implements a substantial portion of the web platform, which is the foundation everything else builds on.

## What the Alpha Actually Includes

The alpha is a rolling release with automatic updates. It supports:

- macOS (disk image) and Linux (Flatpak, Ubuntu, Fedora, standalone archive)
- WebDriver for automated testing and the Firefox DevTools protocol
- Tab management with pinning, search, and session restore
- Private browsing with a distinct visual theme
- First support for VoiceOver on macOS and Orca on Linux
- Picture-in-Picture, spell checking, and text fragment links
- A redesigned UI with light, dark, and violet dark themes

Windows support is in progress — the JavaScript engine already builds and tests on Windows — but the full browser is not yet available there. Mobile platforms are not a current focus.

The team is explicit about limitations: some websites will not work, it will crash, and they make no security promises. They actively invite security researchers to hack it and report findings.

## Product Builder's Perspective

Several aspects of the Ladybird project are worth studying for anyone building complex software products:

**Architecture decisions have long-tail consequences.** The from-scratch decision meant years more work before a usable product, but it gave the team complete freedom over their technology choices — including the Rust migration. A fork of Chromium would have made introducing a new language or restructuring the engine nearly impossible.

**Test coverage enables bold changes.** The Rust port worked because test262 and Ladybird's own regression tests provided 65,359 tests with zero regressions. Without that safety net, AI-assisted migration would be reckless. With it, the migration took two weeks instead of months. This is a practical argument for investing in tests even when you cannot see the immediate ROI.

**Funding model shapes product direction.** Ladybird's non-profit, donation-only model means no advertising incentives, no search deals, no user monetization. For product builders, this is a reminder that funding sources create structural pressures — and choosing an unusual funding model can be a feature, not just a constraint.

**AI tools are changing governance, not just productivity.** The decision to close public PRs is one of the first clear examples of an open source project restructuring its contribution model specifically because of AI. As [AI coding agents create hidden costs for product teams](/blog/ai-coding-agent-hidden-costs-vibe-tax/), the governance dimension may prove as significant as the productivity one.

## What This Means for Pakistan and Emerging Tech Ecosystems

Ladybird's story has specific relevance for technology teams in Pakistan and other emerging ecosystems. The project demonstrates that ambitious software can be built outside the traditional venture-backed startup model, funded by a community that values the product's independence. For Pakistani developers and product teams, this is a reminder that the default funding model is not the only option — non-profit structures, community funding, and mission-driven organizations can produce competitive software.

The Rust migration case study is also directly applicable. Many Pakistani technology companies maintain codebases in older languages and face migration decisions. The Ladybird approach — scope a well-tested subsystem, use AI as a translation accelerator under expert direction, verify with existing tests — is a practical playbook that does not require a large team or budget.

Finally, the governance question affects everyone running open source projects. Pakistani open source maintainers face the same AI-generated contribution challenges as Ladybird. The project's decision to restrict code introduction to maintainers, while keeping the code open and welcoming community testing, is one model worth considering.

## What to Watch Next

- **Beta release timeline:** The alpha is rolling, with automatic updates. Watch for when Ladybird announces a beta and expands platform support to Windows.
- **Rust migration progress:** The team is incrementally porting subsystems. The style and layout engine is already moving to Rust, as noted in the July 2026 newsletter.
- **WPT trajectory:** Passing Safari Technology Preview is a milestone, but Chrome and Firefox remain ahead. The rate of progress in the coming months will indicate whether Ladybird can close the gap.
- **Security hardening:** The team worked with Trail of Bits on security hardening in September 2026. As the browser reaches more users, security scrutiny will intensify.
- **Community response to closed PRs:** Whether other open source projects follow Ladybird's governance model, and whether it affects the project's ability to attract contributors, will be telling.

## Conclusion

Ladybird reaching alpha is not just a browser milestone — it is a case study in building ambitious software products under constraints that most teams would consider impossible: a new engine, no corporate backing, a small team, and a funding model that rejects monetization. The project's decisions about architecture, language migration, and governance are all directly relevant to product builders navigating an AI-shaped development landscape. For anyone building complex software, the Ladybird story is worth following — not as inspiration, but as a source of practical lessons about what works when the constraints are real.

If you are building a product and considering a language migration, an open source governance change, or an alternative funding model, the Ladybird project's documented decisions are a useful reference point. And if you build websites, downloading the alpha and testing your own site is a concrete way to contribute to an independent web.

## Sources

- [Ladybird is now in alpha](https://ladybird.org/posts/alpha/) — November 23, 2026
- [This Month in Ladybird - October 2026](https://ladybird.org/newsletter/2026-10-31) — October 31, 2026
- [Ladybird adopts Rust, with help from AI](https://ladybird.org/posts/adopting-rust/) — February 23, 2026
- [Changing How We Develop Ladybird](https://ladybird.org/posts/changing-how-we-develop-ladybird/) — June 5, 2026
- [Why we need Ladybird](https://ladybird.org/posts/why-ladybird/) — Chris Wanstrath, 2024
- [Announcing the Ladybird Browser Initiative](https://ladybird.org/posts/announcement/) — 2024
- [Ladybird Browser Initiative](https://ladybird.org/organization/) — Organization page
- [Ladybird GitHub Repository](https://github.com/LadybirdBrowser/ladybird) — BSD 2-Clause License
