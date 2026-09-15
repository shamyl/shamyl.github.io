---
title: "I Built an Autonomous LinkedIn Posting Pipeline with Open Source Tools"
date: 2026-08-24
description: "How I used an open-source MCP server, OAuth, and a content generation pipeline to automate daily LinkedIn posts — no paid tools, no manual posting."
tags: ["linkedin", "automation", "mcp", "opensource", "nodejs"]
featured: true
---

> This is the story of how I went from manually posting on LinkedIn to having a fully autonomous pipeline that generates content, schedules posts, and publishes daily — using only open source tools and the official LinkedIn API.

## The Problem

LinkedIn is my most valuable professional network. High net-worth individuals, investors, founders, and researchers follow my work in edtech, robotics, and Pakistan's tech ecosystem. But I kept neglecting it.

Not because I didn't have anything to say — I've been building [LearnOBots](https://learnobots.com) for 12 years, ran a research lab at NUST, and write the "Made in Pakistan" newsletter. The problem was **consistency**. Writing a good LinkedIn post takes 20 minutes. Remembering to post takes discipline I don't have when I'm running a company.

I looked at paid tools (Taplio, Buffer, Hootsuite) but they all required manual content creation. I wanted something that would:

1. **Generate** posts automatically based on my expertise and interests
2. **Schedule** them at optimal times
3. **Publish** them without any manual intervention
4. **Do it all with open source tools** — no subscription, no vendor lock-in

Here's how I built it.

## The Stack

- **LinkedIn API Layer**: [linkedin-mcp-server](https://github.com/gacabartosz/linkedin-mcp-server) — open source, 25+ tools, official API
- **Content Generation**: Custom Node.js module with hand-crafted post library
- **Scheduling**: JSON queue + cron
- **Automation**: [OpenClaw](https://openclaw.ai) cron jobs

## Step 1: Create a LinkedIn Developer App

Go to the [LinkedIn Developer Portal](https://developer.linkedin.com/) and create a new app. You'll need:

- A LinkedIn Company Page (mandatory — create one if you don't have it)
- These products enabled:
  - **Share on LinkedIn** (for posting)
  - **Sign In with LinkedIn using OpenID Connect** (for profile access)
- A redirect URL: `http://localhost:8585/callback`
- Your **Client ID** and **Client Secret** (save these)

This is the only step that requires manual setup. Everything else is automated.

## Step 2: Install the MCP Server

```bash
npm install -g linkedin-mcp-server
```

This gives you a binary `linkedin-mcp-server` with 25+ tools: posting, scheduling, media upload, comments, reactions, content templates, and more.

## Step 3: OAuth Authentication

LinkedIn uses OAuth 2.0 — there's no API key shortcut. You need to authorize your app to post on your behalf.

I wrote a small Node.js script that starts a local HTTP server, generates the OAuth URL, and handles the callback:

```javascript
import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CLIENT_ID = 'your_client_id';
const CLIENT_SECRET = 'your_client_secret';
const REDIRECT_URI = 'http://localhost:8585/callback';
const SCOPES = ['openid', 'profile', 'email', 'w_member_social'];
const TOKEN_FILE = path.join(os.homedir(), '.linkedin-mcp', 'tokens_default.json');

const state = crypto.randomBytes(32).toString('hex');
const authUrl = 'https://www.linkedin.com/oauth/v2/authorization?' + new URLSearchParams({
  response_type: 'code',
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  state: state,
  scope: SCOPES.join(' ')
}).toString();

console.log('\n🔗 OPEN THIS URL IN YOUR BROWSER:\n');
console.log(authUrl);

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost:8585');

  if (reqUrl.pathname === '/callback') {
    const code = reqUrl.searchParams.get('code');
    const returnedState = reqUrl.searchParams.get('state');

    if (!code || returnedState !== state) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>❌ State mismatch</h1>');
      server.close();
      return;
    }

    // Exchange code for tokens
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      })
    });

    const tokens = await tokenRes.json();

    // Get profile
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const profile = await profileRes.json();

    // Save tokens
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
      profile: { name: profile.name, email: profile.email, sub: profile.sub }
    }, null, 2));

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>✅ Authenticated!</h1>');
    console.log('✅ Authentication successful!');
    server.close();
  }
});

server.listen(8585);
```

The key scope here is `w_member_social` — without it, you can only read your profile, not post.

**Important:** Tokens expire in ~60 days. You'll need to re-authorize when that happens. Your pipeline should detect expired tokens and alert you.

## Step 4: The Content Generation Engine

This is where most automation tools fail. They either:
- Use generic templates that sound like a bot wrote them
- Require manual content input (defeating the purpose)

I built a content library with **hand-crafted posts** organized by topic. Each topic has 1-2 unique variations with real stories, specific details, and an authentic voice.

### Content Pillars

I defined 4 content pillars based on my expertise:

```json
{
  "content_pillars": [
    { "name": "EdTech & STEAM Education", "weight": 30,
      "topics": ["Maker culture in Pakistan", "STEAM education", "Kids learning robotics"] },
    { "name": "Robotics & Hardware", "weight": 25,
      "topics": ["Hardware products from Pakistan", "3D printing", "DIY robotics"] },
    { "name": "Pakistan Tech Ecosystem", "weight": 25,
      "topics": ["Startup ecosystem", "Local manufacturing", "Tech talent"] },
    { "name": "AI & Technology Trends", "weight": 20,
      "topics": ["AI in education", "Open source AI", "Future of work"] }
  ]
}
```

The weights determine how often each pillar appears. EdTech gets 30% because that's my core work. AI gets 20% because it's relevant but not my primary focus.

### The Post Library

Each topic has hand-crafted posts like this:

```javascript
"Maker culture in Pakistan": [
  {
    hook: "Pakistan has 70M+ kids under 15. Most are taught to memorize. Almost none are taught to make.",
    body: "I've spent over a decade building LearnOBots around a simple belief: kids should build things, not just remember things.\n\nAt our workshops, a 12-year-old who struggled in school designed and 3D-printed a functional prosthetic hand. She didn't just learn CAD — she learned that her ideas can become real objects that help real people.\n\nThat shift from consumer to creator? That's the entire game.",
    cta: "If you're working on maker education in your country, I'd love to compare notes."
  }
]
```

The generator picks topics using a weighted random selection, rotates through variations to avoid repetition, and tracks used topics in a JSON file.

### Why hand-crafted instead of LLM-generated?

I tried LLM-generated posts first. They were generic. They sounded like every other AI-written LinkedIn post. The hooks were weak. The stories were abstract. They didn't reference my actual work.

Hand-crafted posts take more upfront effort but produce dramatically better content. I wrote ~26 unique posts across all topics, each with specific references to LearnOBots, my experiences at MIT and Seoul National University, real stories from workshops, and the Pakistan tech ecosystem I know intimately.

The generator rotates through them, so a follower won't see the same post twice for at least a month. And when the library runs out, I write more.

## Step 5: The Publishing Pipeline

The publisher is dead simple:

1. Read the queue (a JSON file)
2. Find posts where `publishAt <= now` and `approved = true`
3. Call the LinkedIn Posts API
4. Mark them as posted

```javascript
async function createPost(text) {
  const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  const personUrn = `urn:li:person:${tokens.profile.sub}`;

  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokens.accessToken}`,
      'LinkedIn-Version': '202503',
      'X-Restli-Protocol-Version': '2.0.0',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      author: personUrn,
      commentary: text,
      visibility: 'PUBLIC',
      distribution: { feedDistribution: 'MAIN_FEED' },
      lifecycleState: 'PUBLISHED'
    })
  });

  return res.ok
    ? { success: true, id: res.headers.get('x-linkedin-id') }
    : { success: false, status: res.status, body: await res.text() };
}
```

## Step 6: Full Automation

Two cron jobs run the entire system:

**Cron Job 1 — Content Generator (Weekly)**
- Runs every Sunday at 10 PM PKT
- Generates 7 posts for the upcoming week
- Picks topics, selects variations, assigns posting times
- Saves to queue

**Cron Job 2 — Publisher (Every 30 minutes)**
- Checks the queue for due posts
- Publishes them via the LinkedIn API
- Handles failures and retries

```
Sunday 10 PM → Generate 7 posts for the week
Every 30 min → Check queue → Publish due posts → Mark as posted
```

That's it. The system runs silently in the background. I never have to think about LinkedIn again.

## Posting Schedule

I defined optimal posting times based on when my audience is most active:

- **Monday** — 9:00 AM PKT
- **Tuesday** — 9:00 AM PKT
- **Wednesday** — 1:00 PM PKT
- **Thursday** — 9:00 AM PKT
- **Friday** — 10:00 AM PKT
- **Saturday** — 11:00 AM PKT
- **Sunday** — 7:00 PM PKT

Daily posting. The content rotates across 4 pillars so my feed doesn't feel repetitive.

## What I Learned

**1. LinkedIn's API is gated for a reason.** They don't want spam. The OAuth flow ensures only authorized apps post on behalf of real users. This is good — it keeps the platform quality high.

**2. Content quality > automation sophistication.** The most impressive automation pipeline is worthless if the posts sound like a bot wrote them. I spent more time on the content library than on the entire technical infrastructure.

**3. Hand-crafted beats LLM-generated for personal branding.** My LinkedIn network includes investors, founders, and high net-worth individuals. Generic AI posts would damage that. The hand-crafted approach ensures every post sounds like me — because I wrote them.

**4. Open source tools are sufficient.** The `linkedin-mcp-server` project gave me everything I needed: OAuth, posting, scheduling, profile management. No paid tools required.

**5. The 60-day token expiry is the only manual touchpoint.** Every ~60 days, I re-authorize. It takes 30 seconds. Everything else is fully autonomous.

## Limitations & Honest Tradeoffs

- **No images yet.** The LinkedIn API supports image uploads, and the MCP server has Gemini image generation built in, but I haven't enabled it. Text-only posts for now.
- **No engagement automation.** I don't auto-comment or auto-reply. That would feel inauthentic on a professional network.
- **Token refresh isn't automated.** LinkedIn doesn't return refresh tokens for the consumer OAuth flow, so re-auth is needed every 60 days.
- **Content is pre-written, not live.** The system can't react to breaking news or current events. It posts from a curated library, not from today's headlines.

## What's Next

- **Image generation** — integrating Gemini Imagen 4 for auto-generated banners on each post
- **Analytics** — tracking engagement metrics to optimize posting times and content
- **A/B testing** — trying different hooks and CTAs to see what resonates
- **Multi-platform** — extending to Twitter/X using the same content pipeline

## The Full Architecture

```
┌─────────────────────┐
│  Content Config     │
│  (4 pillars, topics) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     ┌──────────────────┐
│  Content Generator  │────▶│   Post Queue     │
│  (weekly, 7 posts)  │     │   (JSON file)    │
└─────────────────────┘     └────────┬─────────┘
                                     │
                                     ▼
┌─────────────────────┐     ┌──────────────────┐
│  Publisher          │◀────│  Cron (30 min)   │
│  (LinkedIn API)     │     │  Check & publish │
└──────────┬──────────┘     └──────────────────┘
           │
           ▼
┌─────────────────────┐
│  LinkedIn Profile   │
│  (daily posts)      │
└─────────────────────┘
```

## Getting Started

If you want to build something similar:

1. Create a LinkedIn Developer App
2. `npm install -g linkedin-mcp-server`
3. Set up OAuth (use the script above)
4. Define your content pillars and write your post library
5. Set up two cron jobs — one to generate, one to publish
6. Let it run

The entire setup takes about 2 hours. The content library takes longer — but that's the part that matters. Invest in your content, not your infrastructure.

---

*If you found this helpful, consider [supporting my work on GitHub Sponsors](https://github.com/sponsors/shamyl). I write about building things in Pakistan — robots, education tools, and the occasional automation pipeline.*

*You can also follow my "Made in Pakistan" newsletter on [Substack](https://shamylmansoor.com) for more on Pakistan's tech ecosystem.*