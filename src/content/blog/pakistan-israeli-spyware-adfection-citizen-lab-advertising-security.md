---
title: "Pakistan Was the Second-Most Targeted Country in an Israeli Spyware Campaign Disguised as Online Ads. What That Means for Users, Businesses and Government Networks"
date: 2026-10-24
description: "A Citizen Lab investigation found that an Israeli company used online advertisements to deliver zero-click spyware to devices worldwide. Pakistan ranked second globally with 139 million malicious ad bids. Here is what the AdFection technique is, how it affected Pakistani users and websites, and what organizations should do about it."
tags: ["pakistan", "cybersecurity", "spyware", "Citizen-Lab", "advertising", "surveillance"]
featured: true
seoTitle: "Pakistan Targeted by Israeli Spyware via Online Ads: Citizen Lab AdFection"
seoDescription: "A Citizen Lab report found Pakistan was the second-most targeted country in an Israeli spyware campaign delivered through online advertisements. 139 million malicious ad bids. What it means for Pakistani users and organizations."
canonical: "https://shamylmansoor.com/blog/pakistan-israeli-spyware-adfection-citizen-lab-advertising-security/"
dateModified: "2026-10-24"
---

A Citizen Lab investigation published on October 15, 2026 revealed that an Israeli company called Discover-Tech used the online advertising infrastructure to deliver zero-click mercenary spyware to devices around the world. Pakistan ranked second globally in the number of malicious advertising bids recorded, with approximately 139 million bids targeting Pakistani IP addresses between March and June 2026. The findings expose a surveillance vector that most internet users — and many organizations — never consider: the advertisements displayed on the websites and apps they use every day.

## In Brief

- Citizen Lab identified a zero-click spyware delivery technique called "AdFection" that uses targeted online advertisements to infect devices without requiring any user click
- The Israeli company Discover-Tech operated as an intermediary in the digital advertising ecosystem, inserting malicious code into ads distributed through major ad platforms including Google, Yandex, and Vungle
- Pakistan ranked second globally with approximately 139 million malicious ad bids, behind Yemen at approximately 457 million
- Pakistani technology website WhatMobile.com.pk displayed more than 100,000 of these malicious ads
- The ads also appeared on Pakistani government-operated networks, though the report did not identify which networks
- A user identified as "Pindi" accessed Discover-Tech's spyware control platform exclusively from Pakistan, though Citizen Lab could not confirm whether this account was connected to a spyware company
- Google removed Discover-Tech from its advertising platforms after being notified, and IAB Europe removed the company from its approved vendor list
- Citizen Lab emphasized that an ad impression does not automatically confirm device infection, but the scale warrants urgent investigation

## What Is AdFection and How Does It Work

The technique that Citizen Lab named "AdFection" exploits the architecture of real-time bidding (RTB) — the system that powers most online advertising. When a user opens a website or app, ad exchanges run auctions in milliseconds to determine which advertisement to display. Multiple advertisers bid on the opportunity, and the winning ad is pushed to the user's screen.

AdFection works by inserting malicious code into what appears to be a normal advertisement. The code runs the moment the ad is rendered in the user's browser or app — no click required. This is what makes it a zero-click attack. The user does not need to tap, click, or interact with the ad in any way. Simply loading a page or opening an app that displays the ad is enough.

According to Citizen Lab, Discover-Tech operated a platform called Controlium that allowed its spyware partners — primarily Candiru, an Israeli mercenary surveillance company that rebranded as "Integrity Labs" — to de-anonymize, fingerprint, and automatically infect targeted devices. The platform enabled operators to select specific devices for attack based on identifiers such as IP addresses, advertising IDs, and other tracking data that the advertising ecosystem routinely collects.

The attack chain works as follows: Discover-Tech bids on ad impressions through standard ad exchanges. When it wins a bid, its ad — containing malicious code — is delivered to the target device. The code then attempts to exploit vulnerabilities in the device's browser or operating system to install Candiru's spyware. Once installed, the spyware can access messages, emails, contacts, photos, microphone audio, and location data.

This is the first publicly confirmed instance of zero-click mercenary spyware being delivered through the online advertising system. Previous known delivery methods for mercenary spyware like Pegasus and Candiru included malicious links, watering hole attacks on specific websites, and network injection. AdFection represents a broader and potentially more scalable attack surface because it leverages the same advertising infrastructure that reaches billions of devices daily.

## The Numbers: Pakistan's Exposure

Citizen Lab analyzed nearly four billion ad bidding records from Discover-Tech's system, covering activity between March and June 2026. The data was found on two publicly accessible Apache Druid instances on Discover-Tech's infrastructure that the company inadvertently exposed.

The top countries by raw bid count were:

| Country | Approximate Malicious Ad Bids |
|---|---|
| Yemen | 457,283,658 |
| Pakistan | 139,427,322 |

Pakistan's 139 million bids mean that Discover-Tech's system attempted to show malicious advertisements to Pakistani IP addresses roughly 139 million times in a four-month period. This does not mean 139 million successful infections — most bids do not result in winning the ad auction, and not every displayed ad results in a successful exploit. But the volume indicates deliberate and sustained targeting of Pakistani users.

The report also found that malicious ads were shown on more than 120,000 unique websites and 75,000 mobile apps globally. In Pakistan, the technology website WhatMobile.com.pk — one of the country's most popular resources for mobile phone prices and tech news — displayed more than 100,000 of these malicious ads. Given WhatMobile's audience of Pakistani consumers researching smartphones and technology products, the exposure surface is significant.

Critically, the report stated that Discover-Tech's ads also appeared on Pakistani government-operated networks. Citizen Lab did not identify the specific networks, but the finding places Pakistan alongside countries where government networks — including defense ministries, armed forces, and national cyber agencies — were exposed to the same ad-based spyware delivery system.

## The "Pindi" User

One of the more provocative findings in the Citizen Lab report is the identification of a Controlium user who accessed Discover-Tech's spyware control platform exclusively from Pakistan. The user's account name was "Pindi" — a common shorthand for Rawalpindi, the city adjacent to Islamabad that hosts Pakistan's military headquarters.

Citizen Lab could not establish whether this account was connected to a spyware company, a government entity, or any other organization. The report noted that login locations only indicate where users accessed the system and do not establish whether individuals in those countries were targeted. Two other unattributed users accessed the platform from India and Italy.

The finding raises questions that the report itself does not answer. Who accessed a mercenary spyware control platform from Pakistan? Were they a customer, an operator, a researcher, or something else? Citizen Lab's cautious wording — "we could not conclusively attribute" — is appropriate given the available evidence. But for Pakistani readers, the presence of a Controlium user operating from within the country adds a domestic dimension to what might otherwise seem like a purely external threat.

## Why Pakistan

The report does not explain why Pakistan ranked second in bid volume. Several factors could contribute to Pakistan's prominence in the data:

**Large internet user base.** Pakistan has over 111 million internet users. A large user base means more ad impressions overall, which translates to more bidding opportunities for any ad platform — malicious or legitimate.

**Geopolitical positioning.** Pakistan's relationships with countries in the Middle East, its role in regional security, and its nuclear status make it a natural target for intelligence collection. The report identified Yemen as the top targeted country, and other heavily targeted regions included the Middle East, Nordic countries, and government networks across Europe and Asia.

**Limited digital security infrastructure.** Many Pakistani users and organizations rely on standard browsers and devices without advanced ad-blocking or network-level advertising controls. The Citizen Lab report explicitly recommends ad-blocking as a cybersecurity best practice — a recommendation that most Pakistani organizations have not implemented at scale.

**Mobile-first internet usage.** Discover-Tech's ads appeared predominantly in mobile apps rather than desktop browsers. Pakistan's internet usage is overwhelmingly mobile-first, with the majority of users accessing the internet through Android devices where ad ecosystem tracking is deeply embedded.

## What This Means for Pakistani Organizations

For Pakistani technology companies, government departments, and educational institutions, the AdFection findings should change how they think about advertising as a security threat surface.

### Ad-Blocking Is Now a Security Measure

Citizen Lab's recommendation is unambiguous: "there is currently no consistently safe way to expose your users and networks to targeted ads." The report recommends blocking online advertising at the organizational gateway, on work-issued devices, and through browser-level ad blockers. For Pakistani organizations that have traditionally treated ad-blocking as a productivity or user-experience preference rather than a security control, this framing shift is important.

IT departments managing government networks, university systems, or corporate environments should consider deploying network-level ad blocking through DNS resolvers like Pi-hole or AdGuard Home, enforcing ad-blocking browser extensions through device management policies, and disabling advertising identifiers on managed mobile devices.

### Browser Choice Matters

The report recommends transitioning toward browsers with built-in anti-tracking features and ad-blocking capabilities. Browsers like Brave, Firefox with Enhanced Tracking Protection, or Safari with Intelligent Tracking Prevention offer stronger default protections than Chrome, which allows extensive cross-site tracking by design. For organizations where Chrome is the standard, deploying uBlock Origin or similar extensions through enterprise policy is a practical mitigation.

### Mobile Device Management

Because the majority of Discover-Tech's ads targeted mobile apps, organizations issuing mobile devices to employees should disable advertising identifiers (IDFA on iOS, Google Advertising ID on Android) through mobile device management (MDM) configurations. This reduces the ability of ad-based tracking systems — including malicious ones — to identify and target specific devices.

## Why This Matters for Pakistan's Digital Economy

Pakistan is actively trying to grow its digital economy. The government's Uraan Pakistan plan targets $10 billion in annual IT exports by FY2029, as we examined in our analysis of [Pakistan's IT exports in Q1 FY2027](/blog/pakistan-it-exports-q1-fy2027-freelance-record-growth/). Google opened its first Pakistan office in August 2026 and signed an MoU targeting a $30 billion digital economy by 2030, which we covered in our [Google-Pakistan partnership analysis](/blog/google-pakistan-mou-ai-gemini-students-digital-economy/). The country is building its [national digital stack under the Digital Nation Pakistan Act](/blog/pakistan-leap-2026-digital-stack-tech-exports/).

But a digital economy built on infrastructure that can be weaponized for surveillance is one where the risks grow alongside the opportunities. If Pakistani government networks are exposed to ad-based spyware delivery, the security of digital government services — including citizen data platforms, digital identity systems, and financial infrastructure — depends on understanding and mitigating these threats.

For Pakistani technology companies building products for international clients, the AdFection report is also a reminder that security expectations are rising. International clients increasingly require evidence of robust security practices, and awareness of advanced surveillance threats is part of that expectation. Companies that can demonstrate awareness of threats like AdFection — and have implemented corresponding mitigations — will be better positioned in competitive markets.

## Product Builder's Perspective

From a product-building perspective, the AdFection technique reveals something unsettling about the modern internet's architecture: the same real-time bidding system that serves relevant ads to users also provides a scalable, automated mechanism for delivering malicious code to specific devices. The targeting precision that makes digital advertising commercially valuable is the same precision that makes it dangerous as a surveillance tool.

For product teams building apps or websites that display advertising — and many Pakistani products do, because advertising is the most common monetization model for free apps — the AdFection report creates an obligation. If your product serves ads from third-party networks, your users were potentially exposed to Discover-Tech's malicious ads. The report found that more than 120,000 websites and 75,000 mobile apps displayed these ads. Product teams should audit their ad supply chain, understand which ad networks they integrate with, and ask whether those networks have taken steps to prevent similar abuse.

This connects to a broader issue we have explored before in the context of [security vulnerabilities in educational robotics platforms](/blog/humanoid-robot-security-vulnerabilities-unitree-g1-edu-ble-root-rce/): as products become more connected and more integrated with third-party services, the attack surface grows in ways that product teams often do not fully map. AdFection is a demonstration that the attack surface includes the advertising layer — not just the application code, the authentication system, or the network connection.

## What to Watch Next

- **Pakistani government response.** As of publication, there has been no public statement from Pakistan's Ministry of IT and Telecommunication, the Pakistan Telecommunication Authority, or the National Cyber Emergency Response Team (nCERT) regarding the Citizen Lab findings. Given that Pakistani government networks were identified in the report, a formal response — or the absence of one — will be worth watching.
- **Discover-Tech's status.** Google and IAB Europe have removed Discover-Tech from their platforms. Whether Candiru/Integrity Labs continues to operate, and whether other companies are using similar ad-based delivery techniques, remains an open question.
- **Domestic policy implications.** The report's recommendation to block advertising on government networks could inform Pakistani cybersecurity policy. The establishment of [Special Technology Zones](/blog/pakistan-leap-2026-digital-stack-tech-exports/) and the broader digital transformation agenda make network security policy increasingly relevant.
- **Awareness and training.** Pakistani organizations should incorporate ad-based threat awareness into their security training programs. The concept that "ads can hack you" is new to most users and many IT professionals.

## Conclusion

The Citizen Lab AdFection report is not a story about Pakistan alone — it is a global story about a structural flaw in the online advertising system that affects every internet user. But Pakistan's position as the second-most targeted country, the presence of a Controlium user operating from within the country, and the exposure of government networks make it a story that Pakistani technology professionals, policymakers, and organizations cannot afford to ignore.

The internet's advertising infrastructure was built for scale and targeting efficiency, not for security. AdFection demonstrates what happens when that imbalance is exploited. For a country building its digital economy on the same infrastructure, the lesson is straightforward: treat advertising as a security surface, implement the mitigations that Citizen Lab recommends, and do not assume that because an ad looks harmless, the code behind it is.

**What is your organization doing about ad-based security threats?** If this is a topic you are working on — whether in government, education, or the private sector — it deserves a conversation.

## Sources

- [Citizen Lab, "Exposing AdFection: How Discover-Tech Turned Targeted Ads Into a Pipeline for Zero-Click Mercenary Spyware," October 15, 2026](https://citizenlab.ca/research/how-discover-tech-turned-targeted-ads-into-a-pipeline-for-spyware/)
- [ProPakistani, "Pakistan Among Most Targeted Countries in Israeli Spyware Campaign," October 22, 2026](https://propakistani.pk/2026/10/22/pakistan-among-most-targeted-countries-in-israeli-spyware-campaign/)