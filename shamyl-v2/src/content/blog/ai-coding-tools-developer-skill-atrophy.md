---
title: "AI Coding Tools May Be Preventing the Next Generation of Developers From Building Real Expertise"
date: 2026-08-26
description: "Research from Anthropic, UPenn, and ACM shows that AI coding assistants can reduce skill mastery by 17% and create an illusion of competence. Here is what CTOs, product teams, and educators should do about it."
tags: ["AI coding", "developer skills", "product engineering", "CTO", "education", "LLM"]
featured: true
seoTitle: "AI Coding Tools and Developer Skill Atrophy: What Research Shows"
seoDescription: "Anthropic and UPenn studies show AI coding assistants reduce skill mastery by 17% and create false competence. Practical guidance for CTOs, product teams, and educators."
canonical: "https://shamylmansoor.com/blog/ai-coding-tools-developer-skill-atrophy/"
---

AI coding assistants are now standard equipment for most software teams. They write functions, debug errors, and scaffold entire features. But a growing body of research — including a randomized controlled trial from Anthropic and a large-scale study from the University of Pennsylvania — reveals a troubling trade-off: developers who lean heavily on AI assistance build weaker mental models of the code they produce, score lower on comprehension tests, and may be short-circuiting the friction that turns novices into experts.

For CTOs, engineering leaders, and anyone running a product team that includes junior developers, this is not a hypothetical concern. It is a workforce pipeline problem.

## In Brief

- Anthropic's randomized controlled trial, published January 29, 2026, found that developers using AI assistance scored 17% lower on a comprehension quiz than those who coded by hand — roughly two letter grades
- A University of Pennsylvania study published in PNAS found that high school students using unguarded AI assistance performed worse than students using only a textbook, while those using a Socratic "tutor" mode performed 127% better in practice sessions
- An ACM study analyzing 21 lab sessions found that novice programmers with heavy AI assistance skipped crucial planning stages and developed an "illusion of competence" rather than true understanding
- A widely discussed essay by developer Lars Faye, published July 22, 2026, argues that AI coding tools create an "inverted learning" model where novices must guide a mentor before they understand the domain — a precarious arrangement
- The core finding across all three studies: cognitive friction is not a bug to be eliminated. It is the mechanism through which expertise forms

## What the Anthropic Study Found

Anthropic recruited 52 software engineers, mostly junior, with at least a year of Python experience. The study split them into two groups: one coded a feature using an AI assistant with access to their code, the other coded without assistance. Both groups worked with Trio, a Python library for asynchronous programming that none had used before — designed to mimic the real-world experience of learning a new tool through a self-guided tutorial.

After the coding task, participants took a quiz covering debugging, code reading, code writing, and conceptual understanding. The AI-assisted group scored 17% lower on average — the equivalent of nearly two letter grades. The AI group completed the task slightly faster, but the speed difference did not reach statistical significance.

Crucially, not every AI-assisted participant scored poorly. Those who used the AI tool interactively — asking follow-up questions, requesting explanations, and posing conceptual questions while coding independently — showed stronger mastery. The damage occurred when participants treated the AI as an answer generator rather than a thinking partner.

Anthropic's conclusion, in their own words: "cognitive effort — and even getting painfully stuck — is likely important for fostering mastery."

The study is relatively small (52 participants) and focused on a single library. But its methodology — a randomized controlled trial with a comprehension assessment — is more rigorous than most industry commentary on AI coding tools, and its findings align with independent research from other institutions.

## The UPenn Study: Guardrails Matter More Than Access

A study published in PNAS by researchers at the University of Pennsylvania followed nearly 1,000 students learning mathematics with varying levels of AI access. The findings were stark:

- Students using unguarded AI assistance performed **17% worse** than students working from a textbook alone
- Students using a "tutor" version — where the AI provided guidance but required the student to solve problems independently — performed **127% better** in practice sessions
- On post-tests, the tutor group scored roughly the same as the textbook group, suggesting that the benefit was in engagement and practice rather than deeper retention

The pattern mirrors the Anthropic findings: AI as an answer engine degrades learning. AI as a Socratic partner enhances it. The difference is not whether AI is present but how it is used.

The PNAS study's title — "Generative AI without guardrails can harm learning" — captures the core insight. The tool is not the problem. The absence of friction is.

## The ACM Study: Novices Skip the Hard Parts

A study presented at ACM SIGCSE 2024, titled "The Widening Gap: The Benefits and Harms of Generative AI for Novice Programmers," observed 21 novice programmers in lab sessions with eye tracking and interviews. The researchers found that participants with heavy AI assistance:

- Often skipped crucial planning stages, finding that "because they hadn't reasoned themselves into this position, Copilot had"
- Finished with an "illusion of competence" rather than true understanding
- Became dependent on the AI to fix errors that the AI itself had introduced

The participants who performed best were those who developed "negative expertise" — the ability to recognize and reject incorrect AI suggestions. These students mitigated their AI usage and used it to accelerate code they already intended to write, rather than letting the AI dictate the approach.

One participant who demonstrated strong fundamentals was nonetheless "enticed by Copilot into quickly producing code" and had to rely on the LLM to fix errors it had introduced — a circular dependency that mirrors a pattern many development teams will recognize.

## The Friction Problem

Lars Faye's essay, published July 22, 2026, and widely discussed on Hacker News (544 upvotes, 537 comments), synthesizes these findings into a framework he calls "inverted learning." The argument is straightforward:

Expertise in programming develops through repeated exposure to difficulty — tracing obscure errors, debugging without logs, rewriting approaches that will not scale, experiencing the performance differences between methods. This friction builds what Faye calls "Fingerspitzengefühl" — fingertip feeling, or developer intuition.

AI coding tools are designed to eliminate friction. They complete your code, fix your errors, and scaffold your architecture. For experienced developers who already have the mental models to evaluate AI output, this is genuine productivity. For novices who lack those models, it is cognitive offloading that feels like learning but is not.

Faye draws on Joel Spolsky's 2002 essay "The Law of Leaky Abstractions" to make the point: abstractions save time working, but they do not save time learning. AI coding tools are the ultimate leaky abstraction. They hide the mechanics of the struggle, and the struggle is where the learning lives.

The irony is sharp: the developers who benefit most from AI coding tools are those who least need them. The developers who need them most — juniors building their first mental models — are the ones most likely to be harmed by unrestricted use.

## Why This Matters for Product Teams

For CTOs and engineering leaders, the research points to a specific risk: the junior developer pipeline.

Most product teams now operate with a mix of senior engineers who use AI tools to accelerate work they understand, and junior engineers who use AI tools to produce work they do not fully understand. The senior engineers are faster. The junior engineers appear faster — their pull requests arrive on time, the code passes tests, the features seem to work. But the comprehension gap is invisible until something breaks at 2 AM and the junior developer cannot explain why the AI-generated code is failing.

This is not a hypothetical scenario. David Cramer, co-founder of Sentry, described the dynamic bluntly in a recent interview: "You want to flex that you can generate all of your code and have hundreds of things going in parallel, I will flex and show you how broken the code is 100% of the time."

The practical implications for product teams are:

**1. Differentiate AI policies by experience level.** Senior engineers who can audit AI output should be encouraged to use it freely. Junior engineers should have guardrails — not bans, but structured workflows that require them to explain what the AI generated before merging.

**2. Make code review non-negotiable for AI-generated code.** The ACM study's finding that novices skip planning stages when using AI is directly relevant to code review. If a junior developer cannot explain why the AI wrote a particular function, they are not ready to ship it.

**3. Preserve deliberate friction in onboarding.** New hires who immediately use AI tools to scaffold features will miss the architectural understanding that comes from building things badly the first time. Consider having new engineers complete their first few tasks without AI assistance — not as punishment, but as orientation.

**4. Use AI as a Socratic tool, not an answer engine.** The UPenn study's 127% improvement with tutor-mode AI is the strongest evidence that the tool itself is not the problem. Prompting patterns that ask "what approach should I consider?" rather than "write this function" shift the cognitive work back to the developer.

## What This Means for STEAM Education

The findings are equally relevant to education — and not just for computer science classrooms.

At LearnOBots, the approach to [STEAM education](https://learnobots.com) has always emphasized hands-on building over passive consumption. Students program [Buddy Bot](/work/buddy-bot) to navigate a maze. They build and test robots with modular backpacks. They learn programming through [RoboSim](/work/robosim), a 3D simulator where code controls virtual robots. The friction — the robot that does not turn, the sensor that reads the wrong value, the code that compiles but does not work — is the curriculum.

AI coding tools threaten this model if used carelessly. A student who asks an AI to write the maze-navigation code and pastes it into the robot learns nothing about logic, sequencing, or debugging. But the same student who uses AI to explain why their code is failing — to understand the difference between a syntax error and a logic error — gains a powerful learning tool.

The lesson from the UPenn study applies directly here: the guardrails determine whether AI helps or harms. A classroom where AI writes the code is a classroom where students do not learn. A classroom where AI explains the code, asks questions, and requires independent problem-solving is a classroom where students learn faster.

This connects to a broader question about [technology adoption in education](/blog/humanoid-robot-classroom-salamanca-what-went-wrong/) that we explored in the context of the Salamanca humanoid robot case: the technology itself is rarely the decisive factor. What matters is whether the deployment design preserves the cognitive work that produces learning.

## Relevance for Pakistani Technology Teams

For technology teams in Pakistan, the skill-atrophy problem has an additional dimension. The Pakistani tech industry has a large population of junior developers relative to senior engineers — a function of rapid growth in CS enrollment and a relatively young workforce. AI coding tools are widely available and heavily used.

The risk is that the productivity gains from AI tools mask a comprehension deficit that only surfaces during complex debugging, system design, or incident response. For a Pakistani product company scaling from 10 to 50 engineers, the junior developers hired today are the senior engineers of 2030. If their formative years are spent generating code they do not understand, the senior engineer pool in five years will be shallower than it appears.

The opportunity is the opposite. Pakistani teams that implement structured AI usage — Socratic prompting patterns, mandatory code review for AI output, and deliberate practice without AI during onboarding — can build a workforce that is both fast and deeply skilled. The research suggests this is not a trade-off. Done correctly, AI tools can accelerate learning rather than bypass it.

## What to Watch Next

- **Anthropic's follow-up research.** The January 2026 study focused on a single library and a short task. Longer-term studies tracking developers over months or years would provide stronger evidence about whether the skill gap persists or narrows over time.
- **Enterprise AI coding policies.** Some companies have already begun restricting AI tool usage for junior developers. Expect more structured policies — potentially tiered by experience level — as the research base grows.
- **AI tool design changes.** The UPenn study's "tutor mode" finding suggests an opportunity for AI coding tools to add Socratic modes that guide rather than generate. Whether commercial tools will adopt this is an open question — the market incentives favor answer-generation over pedagogy.
- **Educational institution responses.** CS programs are grappling with how to integrate AI tools without undermining learning. The schools that develop effective frameworks first will produce stronger graduates.

## Practical Recommendations

For CTOs and engineering leaders:

1. **Audit your team's AI usage patterns.** Are junior developers using AI to generate code they cannot explain? The ACM study's "illusion of competence" is difficult to detect in pull requests.
2. **Implement structured code review for AI-generated code.** Require the author to explain the logic, not just the output.
3. **Create AI usage guidelines that differentiate by experience.** This is not about restricting tools — it is about matching usage patterns to comprehension levels.
4. **Invest in mentorship that includes AI literacy.** Senior engineers should explicitly teach junior developers how to evaluate AI output, not just how to produce it.

For educators:

1. **Use AI in Socratic mode, not generation mode.** The UPenn data is unambiguous: tutor-mode AI helps; answer-mode AI harms.
2. **Preserve debugging friction.** Students who never struggle with errors do not develop debugging intuition.
3. **Teach "negative expertise" explicitly.** The ACM study found that the ability to recognize and reject bad AI suggestions is a learnable skill — and it may be the most important AI-era coding skill.

## Conclusion

The evidence is now strong enough to act on: AI coding tools, used without structure, can prevent the development of programming expertise. The Anthropic RCT, the UPenn classroom study, and the ACM observational study converge on the same finding. The friction that AI tools eliminate is the same friction that builds expertise.

This does not mean AI coding tools should be banned. It means they should be managed — differently for senior engineers who can audit output, and for junior developers who cannot. For product teams, the cost of ignoring this is a generation of developers who appear productive but lack the deep understanding needed for complex problem-solving. For educators, the cost is students who graduate with an illusion of competence rather than real skill.

The most productive learning happens when AI is used not to generate code, but to generate understanding. The distinction is small in practice and enormous in outcome.

---

**Sources:**
- [Anthropic — "How AI assistance impacts the formation of coding skills," January 29, 2026](https://www.anthropic.com/research/AI-assistance-coding-skills)
- [PNAS — "Generative AI without guardrails can harm learning: Evidence from high school math"](https://www.pnas.org/doi/10.1073/pnas.2422633122)
- [ACM SIGCSE — "The Widening Gap: The Benefits and Harms of Generative AI for Novice Programmers," May 28, 2024](https://arxiv.org/abs/2405.17739)
- [Lars Faye — "AI Coding will Prevent Expertise," July 22, 2026](https://larsfaye.com/articles/ai-coding-will-prevent-expertise)
- [Joel Spolsky — "The Law of Leaky Abstractions," November 11, 2002](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/)
- [InfoQ — "Anthropic Study: AI Coding Assistance Reduces Developer Skill Mastery by 17%," February 2026](https://www.infoq.com/news/2026/02/ai-coding-skill-formation/)