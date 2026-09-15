# Shamyl Bin Mansoor - Personal Website v2

A modern, minimal personal portfolio built with Astro.

## Getting Started

### Development
```bash
npm install
npm run dev
```
Open http://localhost:4321

### Build for Production
```bash
npm run build
```
Output will be in the `dist` folder.

## Adding Content

### Blog Posts
Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
date: 2024-03-01
description: "A brief description"
tags: ["tag1", "tag2"]
featured: true  # Shows on homepage
---

Your content here in Markdown...
```

### Projects
Create a new `.md` file in `src/content/projects/`:

```markdown
---
title: "Project Name"
description: "Brief project description"
category: "software"  # software, hardware, research, or publication
date: 2024-01-01
featured: true  # Shows on homepage
link: "https://project-url.com"  # Optional external link
image: "/images/project.jpg"  # Optional image path
---

Detailed project description...
```

### Speaking & Awards
Create a new `.md` file in `src/content/speaking/`:

```markdown
---
title: "Talk or Award Title"
type: "talk"  # talk, panel, podcast, or award
date: 2024-03-09
venue: "Event Name"
location: "City, Country"
link: "https://event-url.com"  # Optional
description: "Brief description"
---

Additional details...
```

## Project Structure

```
src/
├── content/           # Your Markdown content
│   ├── blog/         # Blog posts
│   ├── projects/     # Projects
│   └── speaking/     # Speaking & awards
├── components/        # Reusable UI components
├── layouts/           # Page layouts
├── pages/            # Route pages
└── styles/           # Global styles
public/
├── images/           # Static images
└── favicon.svg       # Site favicon
```

## Customization

### Colors
Edit `src/styles/global.css` - look for the `:root` section to change colors.

### Content
- Edit `src/pages/about.astro` to update bio, career, and links
- Edit `src/components/Footer.astro` to update social links
- Edit `src/components/Navigation.astro` to change nav links

## Deployment

This site is configured for GitHub Pages. To deploy:

1. Build the site: `npm run build`
2. Copy contents of `dist/` folder to your repo root (or configure GitHub Pages to use a subfolder)
3. Push to GitHub

Or use GitHub Actions for automatic deployment on push.
