---
title: "AI Coding Agents Can't Test: What Dan Luu's 26-Condition Eval Reveals About Agent Quality"
date: 2026-09-09
description: "Dan Luu tested 26 testing techniques across 4,000+ agent runs implementing Zstd in Rust. The result: agents don't know how to test, telling them to use specific techniques makes things worse, and the best approach is active human guidance. Here is what product teams should take from it."
tags: ["AI coding", "software testing", "AI agents", "CTO", "product engineering", "developer tools"]
featured: true
seoTitle: "AI Coding Agents Can't Test: Dan Luu's Eval Explained for Product Teams"
seoDescription: "Dan Luu's 26-condition eval shows AI coding agents fail at testing techniques like TDD, property-based testing, and formal methods. What CTOs and product teams should do about it."
canonical: "https://shamylmansoor.com/blog/ai-coding-agents-testing-techniques-dan-luu-eval/"
---

AI coding agents can write functional code, scaffold features, and pass their own tests. But when software engineer Dan Luu ran 4,000+ agent implementations of the Zstd compression algorithm across 26 different testing techniques — TDD, property-based testing, formal methods, fuzzing, model checking — almost none of them improved correctness. In several cases, instructing agents to use a specific technique made things worse. The finding has direct implications for any product team relying on AI-assisted development.

## In Brief

- Dan Luu published an evaluation on September 7, 2026, testing 26 different testing and verification techniques across 80 runs each (4,160 total runs) using Codex with GPT-5.6 Sol implementing Zstd in Rust
- The "Default" condition — giving agents no testing instructions at all — outperformed most named techniques, because agents largely failed to use the techniques effectively
- TDD underperformed: agents wrote more tests but worse tests, often encoding incorrect behavior and missing bug-prone edge cases
- Formal methods tools (Verus, Lean 4, Alloy, Creusot, TLA+, ACL2, Kani) were used superficially — agents proved trivial properties and avoided verifying the parts most likely to contain bugs
- Property-based testing libraries (QuickCheck, Proptest, Hegel) showed slightly better results, with Proptest's shrinking mechanism occasionally catching real bugs
- A custom skill with five practical directives outperformed everything else, suggesting that targeted behavioral nudges work better than naming techniques
- The core finding: agents know *which* areas are risky but not *how* to test them effectively, and no amount of technique-naming fixes this without active human guidance

## What the Eval Tested

Dan Luu, known for rigorous large-scale software experiments, used the Zstd compression algorithm as a benchmark. Zstd is a good test subject because it involves bit manipulation, state machines, and multiple interacting subsystems (Huffman coding, FSE tables, jump tables) where bugs hide in specific edge cases — not unlike the kind of complexity real product code accumulates.

The eval covered 26 prompt conditions. Each condition told the agent to implement Zstd in Rust with an additional instruction: "Use TDD," "Use Verus," "Use QuickCheck," "Use fuzzing," and so on. A "Default" condition gave no testing instructions. Each condition was run 80 times at two effort levels (medium and xhigh) using Codex with GPT-5.6 Sol. The hidden test suite — the one that actually measured correctness — was separate from whatever tests the agents wrote for themselves.

The 26 conditions spanned four categories:

- **Formal methods**: Verus, Lean 4, Alloy, Creusot, TLA+, ACL2, Kani, SMT solvers, Spin
- **Property-based testing**: QuickCheck, Proptest, Hegel, Property-based testing (generic)
- **Other testing techniques**: TDD, Fuzzing, Differential testing, Mutation testing, Metamorphic testing, Snapshot testing (Insta), rstest, Rust built-in tests
- **Audit-based approaches**: Audit, Audit and fuzz risky areas, Judgement (agents choose), Make no mistakes

Additionally, four "skills" (pre-packaged instruction sets) were tested: the official Hegel skill, the ECC Rust test skill, the Trail of Bits property testing skill, and a custom skill Luu wrote in a few minutes.

## The Headline Finding: Nothing Helped Much

The most striking result is how flat the performance distribution is. No technique wildly outperformed the Default condition. Most named techniques produced slightly worse results because agents spent time and tokens on the named technique without getting value from it, then relied on standard unit tests for actual correctness — the same tests they would have written anyway.

As Luu put it: "It turns out, asking them to use a particular test technique or test library, this approach doesn't change as much as you'd hope."

The failure pattern was consistent across techniques. Agents would:

1. Read the specification and implement the code
2. Write standard Rust unit tests
3. Superficially use the named technique (write a trivial property, prove an obvious invariant, generate a few random inputs)
4. Pass their own tests while failing hidden tests that covered edge cases they never tested

This is not a story about any particular testing technique being bad. It is a story about agents not knowing how to *apply* techniques — the gap between knowing that "property-based testing" exists and knowing how to generate structured random inputs that explore interesting state transitions rather than flooding the same error-rejection code path with garbage.

## TDD Made Things Worse

Test-driven development was one of the conditions Luu explicitly predicted would underperform. It did. Agents instructed to use TDD wrote roughly twice as many tests as the Default condition, but the tests were worse. Specifically, TDD agents were more likely to:

- Write tests with palindromic inputs that couldn't catch bit-reversal bugs
- Encode incorrect expected outputs in test assertions
- Write tests covering trivial cases while missing hard cases like the four-stream jump table

Developer Yossi Kreinin offered a possible explanation: if you write tests before the code, you know less about what will be hard, so you're less likely to steer tests toward the areas where bugs actually live. TDD effectively pushes agents toward black-box testing, which is less effective for complex internal logic.

This connects directly to what we discussed in [The Hidden Cost of AI Coding Agents: What the Vibe Tax Means for Product Teams](/blog/ai-coding-agent-hidden-costs-vibe-tax/) — agents optimizing for the appearance of completeness rather than the substance of it. More tests that pass does not mean more correct code. It means more tests that encode the same incorrect assumptions.

## Formal Methods: Agents Prove the Wrong Things

The formal methods conditions (Verus, Lean 4, Alloy, Creusot, TLA+, Kani, ACL2, Spin, SMT) showed a consistent pattern: agents could use the tools mechanically but not purposefully.

With Verus, agents proved properties like "given valid inputs, the operation stays in bounds" — true but irrelevant, since the bugs were in areas like bitstream order reversal and jump table indexing. With Lean 4, agents did arithmetic proofs. With Alloy, agents modeled state machines but didn't connect them to the actual Rust code's failure modes.

One exception: Kani, a Rust model checker, was at least applied to the actual code rather than abstract properties. In one out of 160 runs, Kani caught a real bug that led to a code fix. That is a low hit rate, but it demonstrates that agents *can* stumble into effective tool use — which suggests that with training or better guidance, this could improve significantly.

Luu raised an important question for AI labs: why haven't they created RL environments to train agents on effective testing? Runtime optimization has improved dramatically because it is easy to create RL environments for bounded problems. Testing well is harder to package, but the payoff — agents that catch their own bugs — seems worth the investment.

## Property-Based Testing: Slightly Better, Still Poor

Property-based testing libraries (Proptest, QuickCheck, Hegel) showed marginally better results than formal methods, largely because Proptest's shrinking mechanism — automatically simplifying failing inputs to minimal reproducing cases — occasionally caught real bugs.

But agents still fell into a common trap: generating fully random inputs that overwhelmingly hit error-rejection code paths. A Zstd implementation receiving 100% random bytes will almost always reject the input immediately. The interesting bugs live in the narrow band between "clearly invalid" and "clearly valid" — and agents did not steer their randomization toward that band.

In 10 out of 160 fuzzing runs, agents generated random *structured* inputs rather than raw random bytes. Half of those found real bugs. This suggests agents have latent capability for effective testing but don't exercise it by default.

## The Custom Skill: Targeted Nudges Beat Technique Names

The one condition that outperformed Default was a custom skill Luu wrote in a few minutes, containing five directives:

1. Think about areas likely to have subtle bugs before implementing; state likely mistakes and alternative interpretations
2. After implementing, independently re-derive results in a fresh context for high-risk areas
3. Use property-based testing or randomized inputs, but minimize no-panic randomization
4. When randomizing, lean toward inputs that explore interesting state transitions
5. If unsure about details, use independent reasoning to check correctness

This skill didn't produce perfect results — agents still missed bugs, wrote some trivial tests, and didn't use fresh contexts as instructed. But it outperformed every named technique and every pre-existing skill. The key difference: it gave agents *behavioral directives* rather than *technique names*. Instead of "use TDD," it said "think about what's likely to be hard, then check those areas specifically."

Luu noted that the pre-existing skills (Hegel's official skill, ECC, Trail of Bits) were written like human tutorials — long, explanatory, covering how the technique works conceptually. His custom skill was short and directive: do this, then this, then this. The tutorial-style skills consumed enormous context (the Hegel skill was 34,000 characters plus a 45,000-character Rust reference) and increased token costs by 16-18% without improving correctness.

This parallels the lesson from Fabien Sanglard's `agent.md` approach covered in our [vibe tax analysis](/blog/ai-coding-agent-hidden-costs-vibe-tax/): effective agent instruction is operational constraint, not documentation.

## Why This Matters for Product Teams

The implications for teams shipping AI-assisted code go beyond testing philosophy. Three practical takeaways:

**1. Passing tests do not mean correct code.** Agents are good at writing tests that their own code passes. If the agent's understanding of the spec is wrong, the tests encode the same wrong understanding. Code review by a human who understands the spec is still essential — not as a formality, as the primary quality gate.

**2. Naming techniques is counterproductive.** Telling an agent to "use TDD" or "use property-based testing" without detailed guidance on *how* to use it will likely produce worse results than no instruction. The agent will spend tokens going through the motions of the technique without getting its value.

**3. Behavioral directives work better than technique names.** Instead of "use TDD," try "before implementing, list the three areas most likely to have subtle bugs. After implementing, write tests that specifically target those areas with boundary inputs on both sides of the expected behavior." This is harder to write but dramatically more effective.

For a deeper look at how AI coding tools affect developer expertise more broadly, see our analysis of the [Anthropic and UPenn studies on AI-assisted skill atrophy](/blog/ai-coding-tools-developer-skill-atrophy/). The research showed that developers using AI assistance score 17% lower on code comprehension — and the testing eval here suggests one mechanism: agents handle the testing surface, so developers never develop the testing intuition that comes from writing tests manually.

## What This Means for Pakistani Technology Teams

For Pakistani technology teams building products with AI assistance — and many are — this eval highlights a specific risk. When budgets are tight and teams are small, the temptation is to let agents handle both implementation and testing. Luu's data shows this produces code that *looks* tested but isn't meaningfully verified.

The cost structure compounds the problem. Named techniques like formal methods or TDD increase token consumption without improving correctness. For teams paying for API access in dollars, this is direct waste. The custom skill approach — short, behavioral, directive — costs less and works better.

The practical recommendation: invest in one person on the team who understands testing deeply enough to write effective agent directives. This person does not need to write all the tests. They need to write the instructions that tell agents *what* to test and *how* to think about risk. Luu's custom skill was five sentences and outperformed 34,000-character tutorial skills. The leverage is in the direction, not the volume.

## What to Watch Next

- **AI lab investment in testing RL environments.** Luu's question about why labs haven't trained agents on effective testing is worth tracking. If OpenAI, Anthropic, or Google create RL environments for testing, agent testing quality could improve as rapidly as runtime optimization has.
- **Skill standardization.** The gap between tutorial-style skills and directive-style skills is large. Expect tooling to emerge that helps teams write effective behavioral skills rather than documentation-flavored ones.
- **Fresh-context auditing.** Luu's custom skill instructed agents to re-derive results in a fresh context — agents mostly ignored this. If harnesses add first-class support for independent verification passes, this could become a reliable technique.
- **Model-level testing improvements.** GPT-5.6 already changed optimal prompting strategies from GPT-5.5. Future models may internalize better testing behavior, making the technique-naming problem moot.

## Sources

- "How well do agents use test/verification techniques?," Dan Luu, September 7, 2026 — [https://danluu.com/agentic-testing/](https://danluu.com/agentic-testing/)
- Dan Luu's previous analysis of AI coding quality and testing defaults — [https://danluu.com/ai-coding/](https://danluu.com/ai-coding/)
- Hacker News discussion, September 7-8, 2026 — [https://news.ycombinator.com/item?id=49598009](https://news.ycombinator.com/)