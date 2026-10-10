---
title: "GalaxEye's OptoSAR Patent: How Fused SAR and Optical Imaging Could Reshape Earth Observation"
date: 2026-10-04
description: "Indian space startup GalaxEye secured a US patent for its OptoSAR technology that fuses synthetic aperture radar and optical imaging on a single satellite. Here is how the technology works, what happened to Mission Drishti, and what it means for South Asian space tech."
tags: ["space-tech", "satellite-imaging", "optosar", "galaxeye", "earth-observation", "south-asian-space"]
featured: true
seoTitle: "GalaxEye OptoSAR Patent: Fused SAR and Optical Satellite Imaging"
seoDescription: "GalaxEye's US patent for OptoSAR technology fuses SAR and optical imaging on one satellite. How it works, Mission Drishti's loss, and what it means for South Asian space tech."
canonical: "https://shamylmansoor.com/blog/galaxeye-optosar-satellite-imaging-patent-south-asian-space/"
---

In September 2026, Bengaluru-based space startup GalaxEye Space secured a US patent for its OptoSAR technology — a satellite imaging system that combines synthetic aperture radar (SAR) and multispectral optical imaging on a single spacecraft. The patent covers the core architecture that GalaxEye already demonstrated in orbit with Mission Drishti, its first satellite, which launched in May 2026 before losing contact in July after a geomagnetic storm. The technology addresses one of Earth observation's most persistent problems: optical cameras cannot see through clouds or darkness, while radar images are difficult to interpret. OptoSAR solves both problems at once.

## In Brief

- GalaxEye received a US patent in September 2026 for its OptoSAR satellite imaging architecture, which co-locates an X-band SAR sensor and a 7-band multispectral imager on a single satellite.
- The company's first satellite, Mission Drishti, launched on May 3, 2026, aboard a SpaceX Falcon 9 from Vandenberg Space Force Base — the world's first commercial OptoSAR satellite.
- Mission Drishti weighed approximately 190 kg, making it India's largest privately built Earth observation satellite at the time of launch.
- The satellite lost communication in July 2026 after a geomagnetic solar storm, likely due to radiation effects on a critical onboard system.
- GalaxEye plans to launch two replacement OptoSAR satellites within two years and ultimately build a constellation of up to 30 satellites.
- The startup was incubated at IIT Madras, founded in 2021, and has raised $26.9 million from investors including Speciale Invest, Rainmatter, and Anicut Capital.

## The Problem: Why Single-Sensor Satellites Fall Short

Earth observation satellites typically carry one type of sensor. Optical cameras capture images that look like what the human eye sees — intuitive, colorful, and detailed. But they are useless when clouds, smoke, or darkness cover the target. A single cloudy day can mean no data for a disaster response team that needs imagery immediately.

Synthetic aperture radar (SAR) solves this problem by using microwave pulses that penetrate clouds and work in complete darkness. SAR images reveal structural information, surface roughness, and elevation changes regardless of weather or time of day. But SAR images are fundamentally different from optical photographs. They show radar reflectivity, not visible light. For non-specialists — farmers, insurance adjusters, city planners — radar images are hard to interpret.

The traditional workaround is to use two separate satellites: one optical and one SAR. But this introduces two sources of error. First, the satellites view the target from different angles (parallax error). Second, they pass over at different times, sometimes hours or days apart (temporal gap). For static features like coastlines, this matters little. For dynamic situations — flood extent, military movements, crop health — the gap between observations can make the data incompatible.

## How OptoSAR Works: Two Sensors, One Platform

GalaxEye's patented solution is to put both sensors on the same satellite, looking at the same piece of ground at the same time. According to [GalaxEye's technology page](https://galaxeye.space/technology), the OptoSAR payload houses an X-band SAR sensor and a 7-band multispectral imager on a single, thermally stable optical bench. This physical co-location eliminates parallax error at the source — both sensors see the target from the same position simultaneously.

The company calls its processing stack "SyncFusion" — a combination of hardware integration and AI-powered software that performs sub-pixel co-registration and jitter correction. The result is a single, fused dataset where every pixel contains both optical and radar information, captured in the same instant.

The technical specifications for Mission Drishti, as reported by [SatNews](https://www.satnews.com/galaxeye-successfully-launches-mission-drishti-optosar-satellite/), illustrate what this looks like in practice:

| Parameter | Value |
|-----------|-------|
| Mass | ~190 kg |
| Combined resolution | 1.2 to 3.6 meters |
| SAR band | X-band |
| Optical bands | Panchromatic, RGB, NIR, Coastal Blue, Red Edge |
| Radar antenna | 3.5-meter deployable |
| Orbit | Sun-synchronous LEO, 500 km altitude |
| Onboard computing | NVIDIA Jetson Orin (AI-at-the-edge) |

The inclusion of NVIDIA's Jetson Orin platform for onboard AI processing is notable. Instead of downlinking raw data and processing it on the ground, Mission Drishti was designed to perform initial data fusion and analysis in orbit, reducing the time from collection to actionable insight.

## The US Patent: What It Covers

According to [Inc42](https://inc42.com/buzz/galaxeye-secures-us-patent-for-satellite-imaging-tech/), the US patent covers the core architecture behind OptoSAR — the system that synchronizes optical and SAR sensors to collect spatially and temporally aligned Earth observation data from a single satellite, operating day and night. GalaxEye had already secured an Indian patent for the same technology; the US patent extends its intellectual property protection to the largest commercial Earth observation market.

"This patented technology enables us to serve the global markets and provide weather agnostic imaging capabilities across sectors like defence, agriculture, insurance, disaster response and more," GalaxEye founder and CEO Suyash Singh said in a statement reported by Inc42.

The patent matters commercially because it creates a defensible technology moat. Earth observation is a crowded market — companies like Planet, Maxar, ICEYE, and Capella Space operate constellations of optical or SAR satellites. But none of them fuse both sensor types on a single spacecraft. GalaxEye's patent positions it as the only company with protected rights to this specific architectural approach.

## Mission Drishti: A Brief but Validated Flight

Mission Drishti launched on May 3, 2026, aboard a SpaceX Falcon 9 from Vandenberg Space Force Base in California. According to SatNews, the launch was hailed by Indian Prime Minister Narendra Modi as a testament to the innovation of India's private space sector.

The satellite operated for approximately two months. During that period, according to GalaxEye, it successfully validated critical technologies, operational processes, and infrastructure required to design, build, launch, and operate advanced space systems.

In July 2026, communication was lost. GalaxEye attributed the failure to a geomagnetic solar storm that likely caused radiation effects on a critical onboard system. The company stated that recovery was unlikely. The timing was particularly difficult — a July 2026 geomagnetic storm also affected infrastructure on Earth, with [Science X reporting](https://sciencex.com) that the same storm pushed 20 amps into New Zealand's electrical grid.

Losing a first satellite is not unusual in the space industry. What matters is whether the core technology was validated before the loss. GalaxEye claims it was, and the company is moving forward with two replacement satellites planned within two years.

## Why This Matters for South Asian Space Technology

GalaxEye's progress is significant for the broader South Asian space ecosystem for three reasons.

**First, it demonstrates that deep-tech IP can originate in the region and compete globally.** The US patent is not a local achievement — it is a recognized intellectual property right in the world's largest space market. For Pakistani technology entrepreneurs and product builders, this is a reminder that the barrier to global IP protection is not geographic but technical. A well-engineered innovation, wherever it originates, can be patented and defended internationally.

**Second, it validates the private space startup model in South Asia.** India's space privatization push, accelerated by the creation of IN-SPACe (the Indian National Space Promotion and Authorization Center) and the opening of the sector to private investment, has produced a growing ecosystem of companies. According to Inc42 data, funding in Indian spacetech startups surged 94% to $157 million in 2025 from $81 million in 2024. GalaxEye's $26.9 million in total funding, while modest by US standards, represents one of the larger pools of private capital for a deep-tech space startup in South Asia.

**Third, it creates a reference point for Pakistan's own space ambitions.** Pakistan's space agency, SUPARCO, has launched Earth observation satellites — including the PRSC-EO3, launched from China in April 2026 — but these are government programs built through bilateral cooperation with China. There is currently no Pakistani equivalent of GalaxEye: a private company building indigenous satellite technology and securing international patents for it.

The gap is not primarily technical. Pakistan has engineering talent, universities with relevant programs, and growing startup infrastructure. The gap is in the ecosystem: access to launch providers, regulatory frameworks for private space activity, venture capital willing to fund hardware-heavy deep tech, and a domestic market large enough to support initial commercial operations.

## What This Means for Educators and Makers

For STEAM educators, the OptoSAR story is a compact case study in interdisciplinary engineering. It combines:

- **Physics**: Microwave propagation, radar backscatter, optical diffraction
- **Computer science**: AI-powered image fusion, sub-pixel co-registration algorithms, edge computing
- **Mechanical engineering**: Thermal stability of co-located sensors on a single optical bench, deployable antenna mechanisms
- **Systems engineering**: Managing power, data, thermal, and communication constraints on a 190 kg spacecraft

At [LearnOBots](https://learnobots.com), satellite technology has consistently been one of the most engaging topics for students — partly because it feels both futuristic and tangible. A story about a startup that put two different sensors on one satellite, launched it on a SpaceX rocket, and then lost it to a solar storm is the kind of narrative that makes abstract engineering concepts real for students. It demonstrates that space is not just for governments anymore, and that the engineering challenges are as much about integration and trade-offs as they are about any single technology.

For product builders, the GalaxEye story reinforces a familiar lesson: in hardware-intensive products, the first version often fails, and the value of the attempt lies in what you validate before it does. GalaxEye lost Mission Drishti but gained flight heritage for its core technology, operational experience, and a US patent that secures its market position. That is a reasonable outcome for a first satellite — and a pattern that product teams in any domain can recognize.

## What to Watch Next

- **GalaxEye's next launches**: Two replacement OptoSAR satellites are planned within two years. The company has indicated a target of 10 to 30 satellites in its constellation, though these figures have varied across reports.
- **Radiation hardening for small satellites**: Mission Drishti's loss to a geomagnetic storm highlights a persistent challenge for commercial small satellites. Radiation-hardened components are expensive and often lag generations behind commercial equivalents. How GalaxEye addresses this in its next iteration will be worth watching.
- **Competitive response**: If OptoSAR proves commercially viable, larger Earth observation companies may attempt similar architectures. GalaxEye's patent gives it legal protection, but enforcement and potential workarounds will shape the competitive landscape.
- **Pakistan's private space sector**: Whether Pakistani entrepreneurs can build a similar path — from university incubation to satellite launches to international patents — depends on regulatory reform, capital availability, and access to launch infrastructure. The GalaxEye model offers a template worth studying.

## Sources

- [GalaxEye Technology Page](https://galaxeye.space/technology) — OptoSAR and SyncFusion architecture details
- [GalaxEye Mission Page](https://galaxeye.space/) — Mission Drishti specifications
- [Inc42: GalaxEye Secures US Patent for Satellite Imaging Tech](https://inc42.com/buzz/galaxeye-secures-us-patent-for-satellite-imaging-tech/) — Patent details, founder quotes, funding history, Mission Drishti timeline
- [SatNews: GalaxEye Successfully Launches Mission Drishti OptoSAR Satellite](https://www.satnews.com/galaxeye-successfully-launches-mission-drishti-optosar-satellite/) — Launch details, technical specifications, strategic implications
- [Google News: GalaxEye US Patent Coverage](https://news.google.com) — Multiple sources confirming patent grant in September 2026
- [Science X: Moderate geomagnetic storm report](https://sciencex.com) — July 2026 geomagnetic storm effects