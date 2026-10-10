---
title: "Pakistan Petrol Updates Dashboard"
description: "A live dashboard tracking daily OGRA-notified petrol, diesel, kerosene, and LPG prices in Pakistan with historical charts and global oil comparisons."
category: "software"
date: 2024-09-01
featured: true
image: "/images/projects/pakistan-petrol.png"
link: "https://petrol-dashboard-production.up.railway.app/"
---

**Pakistan Petrol Updates Dashboard** is a real-time dashboard that tracks fuel prices in Pakistan as notified by OGRA (Oil & Gas Regulatory Authority). It auto-refreshes every 5 minutes and provides historical context going back to 2006.

## Features

- **Live Price Cards** — Current prices for Petrol, High Speed Diesel, Kerosene, and LPG with price change indicators
- **OGRA Update Banner** — Highlights the latest OGRA price notification with effective date
- **Historical Charts** — Selectable time ranges (3 months to all-time) for tracking price trends
- **Global Oil Tracking** — Brent and WTI crude oil prices alongside Pakistani fuel prices
- **Pakistan vs Global Comparison** — Normalized index chart comparing local fuel prices against global crude
- **Yearly Change Analysis** — 1-year and 5-year bar charts showing price changes
- **PM vs PM Comparison** — Petrol price showdown comparing prices under different prime ministers
- **Auto-Refresh** — Updates every 5 minutes without manual page reload
- **Responsive Design** — Works on desktop, tablet, and mobile

## Data Sources

- [OilPrices.pk](https://oilprices.pk) — Real-time OGRA-notified prices (CC BY 4.0)
- [ekLitre.pk](https://eklitre.pk/data/) — Historical fuel prices since 2006 (CC BY 4.0)
- [OGRA](https://www.ogra.org.pk) — Oil & Gas Regulatory Authority of Pakistan
- [World Oil Monitor](https://worldoilmonitor.com) — Global WTI & Brent crude oil prices (EIA data)

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla JS + Chart.js
- **Hosting:** Railway

## Live Dashboard

Deployed at [petrol-dashboard-production.up.railway.app](https://petrol-dashboard-production.up.railway.app/).