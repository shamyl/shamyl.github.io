---
title: "LearnOBots Meeting Room Booking App"
description: "A calendar-based meeting room booking system for LearnOBots with department filtering, dashboard view, and admin controls."
category: "software"
date: 2024-06-01
featured: true
image: "/images/projects/lob-meeting-room.png"
---

**LearnOBots Meeting Room Booking App** is an internal scheduling tool that lets the LearnOBots team book meeting rooms with a visual calendar interface. It was built to replace ad-hoc WhatsApp and paper-based booking with a centralized, always-accessible system.

## Features

- **Calendar View** — Day and week views with time slots from 9 AM to 10 PM
- **One-Click Booking** — Click any empty slot to create a booking
- **Department Filtering** — Filter by Marketing, Business Development, Trainings, Admin & Ops, Finance, Senior Management, and more
- **Dashboard** — Overview of upcoming bookings and room utilization
- **Admin Panel** — Manage bookings, override conflicts, and configure rooms
- **Live Status** — Real-time indicator showing the current booking state of the room

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** TailwindCSS
- **Hosting:** Railway

## Context

The app was built for internal use at LearnOBots to streamline meeting room scheduling across departments. It runs as a single-tenant instance — one room, one organization — keeping the scope simple and the UI fast.