---
title: "MBK Geyser Monitor"
description: "An ESP32-based geyser temperature monitor with OLED display, local web interface, and remote dashboard — built from scratch with a 3D-printed enclosure."
category: "hardware"
date: 2025-01-01
featured: true
image: "/images/projects/mbk-geyser-monitor.png"
link: "https://mbkgeysermonitor.up.railway.app/"
---

**MBK Geyser Monitor** is a personal IoT project that answers a simple question: *what is the temperature at my geyser right now?* It started as a local probe-and-display setup and grew into a full remote monitoring system with an ESP32, a 3D-printed enclosure, and a cloud dashboard on Railway.

## The Hardware

- **ESP32 development board** — reads the sensor, drives the display, serves local pages, uploads readings
- **DS18B20 temperature probe** — wired digital sensor with ±0.5°C accuracy from −10°C to +85°C
- **128×64 SSD1306 OLED** — shows temperature and connection state without needing a phone
- **USB power** — simple power delivery and restart mechanism
- **3D-printed base and cover** — holds the board and display with screen and cable access

## Three Ways to Read the Temperature

1. **On the OLED** — directly at the device, always available
2. **Local web page** — from any phone on the same home Wi-Fi
3. **Internet dashboard** — from anywhere via the Railway-hosted app

The ESP32 sends data outward to Railway over HTTPS. No inbound ports need to be opened on the home router, and the ESP32's local web server is never exposed to the internet.

## Key Design Decisions

- **Local stays independent of cloud** — An internet failure interrupts remote updates without stopping local temperature readings. Sensor conversion is asynchronous, the setup portal runs without blocking the main loop, and cloud requests run in a separate FreeRTOS task.
- **No blocking sensor reads** — Using `setWaitForConversion(false)`, the code starts a measurement and comes back 750ms later for the result, keeping the UI responsive.
- **Wi-Fi setup via captive portal** — WiFiManager creates a temporary access point (`GeyserMonitor-XXXX`) for first-time setup. No recompilation needed when changing networks.
- **Stale data detection** — The display makes it clear when a reading is old rather than showing a plausible-looking but outdated temperature.

## Status Thresholds

Shared between firmware and cloud:
- **Normal:** below 65°C
- **High:** 65°C to below 75°C
- **Critical:** 75°C and above

These are display thresholds for the prototype, not recommended bathing temperatures.

## Tech Stack

- **Firmware:** Arduino (OneWire, DallasTemperature, WiFiManager, Adafruit GFX/SSD1306)
- **Cloud Dashboard:** Node.js + Express + PostgreSQL
- **Hosting:** Railway
- **Enclosure:** 3D-printed (PLA)

## Full Build Story

Read the detailed build log: [Building MBK's Geyser Monitor: From an ESP32 and a Printed Case to a Remote Dashboard](/blog/mbk-geyser-monitor-esp32-railway)

## Live Dashboard

The remote dashboard is deployed at [mbkgeysermonitor.up.railway.app](https://mbkgeysermonitor.up.railway.app/).