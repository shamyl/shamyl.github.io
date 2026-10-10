---
title: "LearnOBots Library Management System"
description: "An office book management system with catalog browsing, issue/return tracking, member management, and overdue reminders."
category: "software"
date: 2024-08-01
featured: true
image: "/images/projects/lob-library.png"
link: "https://loblibrary.up.railway.app/"
---

**LearnOBots Library Management System** is a lightweight web app for managing the LearnOBots office book collection. It lets anyone browse the catalog, while admins can add books, manage members, and track issue/return cycles.

## Features

- **Public Catalog** — Anyone can browse and search the full book collection by title, author, or ISBN
- **Issue / Return Tracking** — Admins can issue books to members and track returns with due dates
- **Member Management** — Maintain a member directory with borrowing history
- **Overdue Monitoring** — Dashboard highlights overdue books with automatic reminders
- **Book Covers** — Automatic cover fetching from Open Library using ISBNs
- **Statistics** — Live counts of total titles, copies, available books, issued books, and members
- **Settings** — Configurable library name, loan period, and reminder email settings

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** SQLite (better-sqlite3)
- **Email:** Nodemailer for overdue reminders
- **Frontend:** Vanilla JS with custom CSS
- **Hosting:** Railway

## Live Demo

The system is deployed at [loblibrary.up.railway.app](https://loblibrary.up.railway.app/) — the catalog is publicly browsable; admin actions (add books, issue/return, manage members) require login.