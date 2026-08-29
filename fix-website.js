#!/usr/bin/env node
// fix-website.js — Comprehensive design/content fixes for shamylmansoor.com
// Run: node fix-website.js

const fs = require('fs');
const path = require('path');

const BASE = '/home/shamyl/shamyl.github.io';
let changes = 0, skipped = 0;

function read(f) { return fs.readFileSync(f, 'utf8'); }
function write(f, c) { fs.writeFileSync(f, c, 'utf8'); changes++; console.log(`✓ ${path.relative(BASE, f)}`); }
function skip(f, reason) { skipped++; console.log(`  skip ${path.relative(BASE, f)} — ${reason}`); }

// =====================================================
// 1. HOMEPAGE — swap Featured Work first, fix meta
// =====================================================
function fixHomepage() {
  const file = path.join(BASE, 'index.html');
  let html = read(file);

  // Fix meta descriptions (same value appears 3× for meta/og/twitter)
  html = html.replaceAll(
    'content="Co-founder &#38; CTO @ LearnOBots | Technologist, Maker, Educator"',
    'content="Shamyl Bin Mansoor — Co-founder &#38; CTO of LearnOBots. Robotics entrepreneur, maker, and STEAM educator building products that matter in Pakistan."'
  );

  // Swap sections: Featured Work (currently 02) should be 01, Latest Updates → 02
  const FIG_OPEN = '<span class="fig-number" data-astro-cid-wk2votdk>';
  const s1Marker = FIG_OPEN + '01</span> <h2 class="section-title" data-astro-cid-wk2votdk>Latest Updates</h2>';
  const s2Marker = FIG_OPEN + '02</span> <h2 class="section-title" data-astro-cid-wk2votdk>Featured Work</h2>';
  const secTag   = '<section class="section" data-astro-cid-j7pv25f6>';
  const secClose = '</section>';

  if (!html.includes(s1Marker) || !html.includes(s2Marker)) {
    console.log('  WARN: homepage section markers not found, skipping swap');
    write(file, html);
    return;
  }

  const s1MarkerIdx = html.indexOf(s1Marker);
  const s2MarkerIdx = html.indexOf(s2Marker);
  const s1Start = html.lastIndexOf(secTag, s1MarkerIdx);
  const s2Start = html.lastIndexOf(secTag, s2MarkerIdx);
  const s1End   = html.indexOf(secClose, s1MarkerIdx) + secClose.length;
  const s2End   = html.indexOf(secClose, s2MarkerIdx) + secClose.length;

  let s1 = html.slice(s1Start, s1End); // Latest Updates block
  let s2 = html.slice(s2Start, s2End); // Featured Work block

  // Swap fig numbers in each block
  s1 = s1.replace(FIG_OPEN + '01</span>', FIG_OPEN + '02</span>');
  s2 = s2.replace(FIG_OPEN + '02</span>', FIG_OPEN + '01</span>');

  // Reconstruct: before + [Featured Work] + gap + [Latest Updates] + after
  const before  = html.slice(0, s1Start);
  const between = html.slice(s1End, s2Start);
  const after   = html.slice(s2End);
  html = before + s2 + between + s1 + after;

  write(file, html);
}

// =====================================================
// 2. ABOUT — add full name display + AVAILABLE → #contact
// =====================================================
function fixAbout() {
  const file = path.join(BASE, 'about/index.html');
  let html = read(file);

  // Fix meta description (unique)
  html = html.replace(
    'content="Co-founder &#38; CTO of LearnOBots | Technologist, Maker, Educator"',
    'content="About Shamyl Bin Mansoor — robotics entrepreneur, STEAM educator, and Co-founder &#38; CTO of LearnOBots. Based in Islamabad, Pakistan."'
  );
  html = html.replaceAll(
    '<meta property="og:description" content="Co-founder &#38; CTO of LearnOBots | Technologist, Maker, Educator">',
    '<meta property="og:description" content="About Shamyl Bin Mansoor — robotics entrepreneur, STEAM educator, and Co-founder &#38; CTO of LearnOBots. Based in Islamabad, Pakistan.">'
  );
  html = html.replaceAll(
    '<meta name="twitter:description" content="Co-founder &#38; CTO of LearnOBots | Technologist, Maker, Educator">',
    '<meta name="twitter:description" content="About Shamyl Bin Mansoor — robotics entrepreneur, STEAM educator, and Co-founder &#38; CTO of LearnOBots. Based in Islamabad, Pakistan.">'
  );

  // Add full name as visible subtitle below the page heading
  const nameInsertAfter = '<h1 class="page-title" data-astro-cid-kh7btl4r>About<br data-astro-cid-kh7btl4r><span class="title-outline" data-astro-cid-kh7btl4r>Me</span></h1>';
  const nameBlock = `<p class="about-fullname" data-astro-cid-kh7btl4r style="font-family:var(--font-mono);font-size:.8rem;text-transform:uppercase;letter-spacing:.12em;color:var(--text-muted);margin-top:var(--space-sm);margin-bottom:0;">Shamyl Bin Mansoor</p>`;
  if (!html.includes('about-fullname')) {
    html = html.replace(nameInsertAfter, nameInsertAfter + nameBlock);
  }

  // Make AVAILABLE status dot link to #contact
  html = html.replace(
    '<span class="meta-status" data-astro-cid-kh7btl4r><span class="status-dot" data-astro-cid-kh7btl4r></span>AVAILABLE</span>',
    '<a href="#contact" class="meta-status" data-astro-cid-kh7btl4r style="text-decoration:none;color:inherit;"><span class="status-dot" data-astro-cid-kh7btl4r></span>AVAILABLE ↓</a>'
  );

  write(file, html);
}

// =====================================================
// 3. WORK — section dividers + default sort by recency
// =====================================================
function fixWork() {
  const file = path.join(BASE, 'work/index.html');
  let html = read(file);

  // Fix meta description (it's already unique/good, just update the OG ones to match)
  // meta is fine; update page subtitle to be more descriptive
  html = html.replace(
    '<p class="page-subtitle" data-astro-cid-57l5znwr>Projects spanning software, hardware, and research</p>',
    '<p class="page-subtitle" data-astro-cid-57l5znwr>Active products, EdTech platforms, and research publications</p>'
  );

  // Insert divider styles
  const styleInsert = `<style>
.work-divider{grid-column:1/-1;display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md) 0 var(--space-sm);margin-top:var(--space-md);}
.work-divider-label{font-family:var(--font-mono);font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--text-muted);white-space:nowrap;}
.work-divider-line{flex:1;height:1px;background:var(--border);}
</style>`;
  if (!html.includes('work-divider')) {
    html = html.replace('</style></head>', styleInsert + '</style></head>');
    // Inject after last active project (CodiBot) and before first publication
    // CodiBot is the last hardware item before publications start
    const codiEnd = '</div>\n</div><div class="project-item" data-category="publication"';
    const dividerHTML = `</div>\n<div class="work-divider" data-category-divider="research"><div class="work-divider-line"></div><span class="work-divider-label">Research &amp; Publications</span><div class="work-divider-line"></div></div><div class="project-item" data-category="publication"`;
    html = html.replace(
      '></div><div class="project-item" data-category="publication" data-astro-cid-57l5znwr>',
      `></div><div class="work-divider" data-astro-cid-57l5znwr style="grid-column:1/-1;display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md) 0 var(--space-sm);margin-top:var(--space-md);"><div style="flex:1;height:1px;background:var(--border);"></div><span style="font-family:var(--font-mono);font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--text-muted);white-space:nowrap;">Research &amp; Publications</span><div style="flex:1;height:1px;background:var(--border);"></div></div><div class="project-item" data-category="publication" data-astro-cid-57l5znwr>`
    );
    // Add divider label for Active Projects before the first project
    const firstProject = '<div class="project-item" data-category="hardware" data-astro-cid-57l5znwr>';
    html = html.replace(
      firstProject,
      `<div class="work-divider" data-astro-cid-57l5znwr style="grid-column:1/-1;display:flex;align-items:center;gap:var(--space-md);padding:0 0 var(--space-sm);"><div style="flex:1;height:1px;background:var(--border);"></div><span style="font-family:var(--font-mono);font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--text-muted);white-space:nowrap;">Active Projects</span><div style="flex:1;height:1px;background:var(--border);"></div></div>` + firstProject
    );
  }

  // Update filter JS to hide dividers when filtering to non-all categories
  const oldFilterJS = `const a=document.querySelectorAll(".filter-btn"),o=document.querySelectorAll(".project-item");a.forEach(t=>{t.addEventListener("click",()=>{const r=t.getAttribute("data-category");a.forEach(e=>e.setAttribute("aria-pressed","false")),t.setAttribute("aria-pressed","true"),o.forEach(e=>{const s=e.getAttribute("data-category");r==="all"||s===r?(e.style.display="block",e.style.animation="fadeIn 0.3s ease forwards"):e.style.display="none"})})});`;
  const newFilterJS = `const a=document.querySelectorAll(".filter-btn"),o=document.querySelectorAll(".project-item"),dv=document.querySelectorAll(".work-divider");a.forEach(t=>{t.addEventListener("click",()=>{const r=t.getAttribute("data-category");a.forEach(e=>e.setAttribute("aria-pressed","false")),t.setAttribute("aria-pressed","true"),o.forEach(e=>{const s=e.getAttribute("data-category");r==="all"||s===r?(e.style.display="block",e.style.animation="fadeIn 0.3s ease forwards"):e.style.display="none"}),dv.forEach(d=>{d.style.display=r==="all"?"flex":"none"})})});`;
  html = html.replace(oldFilterJS, newFilterJS);

  write(file, html);
}

// =====================================================
// 4. SPEAKING — add speaking invite CTA
// =====================================================
function fixSpeaking() {
  const file = path.join(BASE, 'speaking/index.html');
  let html = read(file);

  // Fix meta description
  html = html.replace(
    'content="Talks, panels, podcasts, and recognition"',
    'content="Speaking history, panels, podcasts, and awards by Shamyl Bin Mansoor — from PyCon Pakistan to CERN&#39;s humanitarian hackathon. Available for talks on EdTech, robotics, and product building."'
  );
  html = html.replaceAll(
    '<meta property="og:description" content="Talks, panels, podcasts, and recognition">',
    '<meta property="og:description" content="Speaking history, panels, podcasts, and awards by Shamyl Bin Mansoor. Available for talks on EdTech, robotics, and product building.">'
  );
  html = html.replaceAll(
    '<meta name="twitter:description" content="Talks, panels, podcasts, and recognition">',
    '<meta name="twitter:description" content="Speaking history, panels, podcasts, and awards by Shamyl Bin Mansoor. Available for talks on EdTech, robotics, and product building.">'
  );

  // Update page subtitle
  html = html.replace(
    '<p class="page-subtitle" data-astro-cid-vkgsxoun>Talks, panels, podcasts, and recognition</p>',
    '<p class="page-subtitle" data-astro-cid-vkgsxoun>Talks, panels, podcasts, and recognition — <a href="/about#contact" style="color:var(--accent);text-decoration:none;">available to speak</a></p>'
  );

  // Add a speaking invite CTA block before the closing of the section
  const speakingCTA = `<div style="margin-top:var(--space-3xl);padding:var(--space-xl);background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);max-width:800px;" data-astro-cid-vkgsxoun>
<p style="font-family:var(--font-mono);font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--accent);margin-bottom:var(--space-sm);">Invite to Speak</p>
<h3 style="font-size:1.1rem;font-weight:700;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:var(--space-sm);">Book Me for Your Event</h3>
<p style="font-size:.95rem;color:var(--text-secondary);line-height:1.6;margin-bottom:var(--space-lg);">I speak on EdTech, educational robotics, STEAM, AI in education, and product building for emerging markets. Available for conferences, universities, panels, and podcasts.</p>
<a href="/about#contact" class="btn btn-primary" style="display:inline-flex;align-items:center;gap:var(--space-sm);padding:.6rem 1.2rem;background:var(--accent);color:#000;font-family:var(--font-mono);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;text-decoration:none;border-radius:var(--radius-md);">Get in Touch →</a>
</div>`;

  if (!html.includes('Invite to Speak')) {
    html = html.replace(
      '</div> </section>  </main>',
      speakingCTA + '</div> </section>  </main>'
    );
  }

  write(file, html);
}

// =====================================================
// 5. BLOG INDEX — tag filtering + tighten hero gap
// =====================================================
function fixBlogIndex() {
  const file = path.join(BASE, 'blog/index.html');
  let html = read(file);

  // Skip if already patched
  if (html.includes('sbm-tag-filter')) {
    skip(file, 'already patched');
    return;
  }

  // Inject tag filter styles
  const tagFilterStyles = `<style>
#sbm-tag-filter{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem;}
.sbm-tag-chip{font-family:var(--font-mono);font-size:.65rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;padding:.3rem .75rem;border:1px solid var(--border);border-radius:99px;background:transparent;color:var(--text-muted);cursor:pointer;transition:all var(--transition-fast);}
.sbm-tag-chip:hover,.sbm-tag-chip.active{border-color:var(--accent);color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);}
.sbm-tag-chip.active{font-weight:700;}
</style>`;
  html = html.replace('</style></head>', tagFilterStyles + '</style></head>');

  // Inject tag filter container + script before closing </body>
  const tagFilterScript = `<script>
(function(){
  // Build tag set from all post cards
  const cards = document.querySelectorAll('.blog-card, article.blog-card, .post-card');
  if (!cards.length) return;
  const tagMap = new Map();
  cards.forEach(card => {
    const tags = card.querySelectorAll('.tag, .card-tags .tag');
    tags.forEach(t => {
      const txt = t.textContent.trim().replace(/^#/, '');
      if (txt) tagMap.set(txt, (tagMap.get(txt) || 0) + 1);
    });
    // Store tags on card for filtering
    const tagList = Array.from(tags).map(t => t.textContent.trim().replace(/^#/, ''));
    card.dataset.sbmTags = tagList.join(' ');
  });
  // Top 12 tags by frequency
  const topTags = Array.from(tagMap.entries()).sort((a,b) => b[1]-a[1]).slice(0,12).map(e=>e[0]);
  if (!topTags.length) return;
  // Build filter UI
  const container = document.createElement('div');
  container.id = 'sbm-tag-filter';
  container.setAttribute('aria-label','Filter by topic');
  const allBtn = document.createElement('button');
  allBtn.className = 'sbm-tag-chip active';
  allBtn.textContent = 'All';
  allBtn.dataset.tag = '';
  container.appendChild(allBtn);
  topTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'sbm-tag-chip';
    btn.textContent = '#' + tag;
    btn.dataset.tag = tag;
    container.appendChild(btn);
  });
  // Insert before first post
  const firstCard = cards[0];
  const grid = firstCard.closest('div') || firstCard.parentElement;
  grid.parentElement.insertBefore(container, grid);
  // Filtering logic
  container.addEventListener('click', e => {
    const btn = e.target.closest('.sbm-tag-chip');
    if (!btn) return;
    container.querySelectorAll('.sbm-tag-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.tag;
    cards.forEach(card => {
      if (!filter || (card.dataset.sbmTags || '').includes(filter)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
})();
</script>`;

  html = html.replace('</body>', tagFilterScript + '\n</body>');
  write(file, html);
}

// =====================================================
// 6. BLOG POSTS — TOC + newsletter CTA
// =====================================================
const NEWSLETTER_CTA = `<!-- Newsletter CTA -->
<div class="sbm-newsletter-cta" style="margin:2.5rem 0;padding:1.5rem 2rem;background:var(--card-bg);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:var(--radius-lg);">
<p style="font-family:var(--font-mono);font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.5rem;">Made in Pakistan — Weekly Newsletter</p>
<p style="font-size:.95rem;color:var(--text-secondary);line-height:1.6;margin-bottom:1rem;">Tech, robotics, and EdTech stories from Pakistan and beyond — every week. Written by Shamyl Bin Mansoor.</p>
<a href="https://shamylmansoor.substack.com" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:.5rem;font-family:var(--font-mono);font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);text-decoration:none;">Subscribe on Substack →</a>
</div>`;

const TOC_SCRIPT = `<script>
(function(){
  const prose = document.querySelector('.prose');
  if (!prose) return;
  const headings = prose.querySelectorAll('h2');
  if (headings.length < 3) return;
  const toc = document.createElement('nav');
  toc.setAttribute('aria-label','Table of Contents');
  toc.style.cssText='margin:1.5rem 0 2rem;padding:1rem 1.25rem;background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);';
  const label = document.createElement('p');
  label.textContent='Contents';
  label.style.cssText='font-family:var(--font-mono);font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin-bottom:.75rem;font-weight:700;';
  toc.appendChild(label);
  const ol = document.createElement('ol');
  ol.style.cssText='list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.35rem;';
  headings.forEach((h, i) => {
    if (!h.id) h.id = 'toc-' + i;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.style.cssText='font-family:var(--font-mono);font-size:.75rem;color:var(--text-secondary);text-decoration:none;display:flex;align-items:baseline;gap:.5rem;';
    a.addEventListener('mouseenter', () => a.style.color='var(--accent)');
    a.addEventListener('mouseleave', () => a.style.color='var(--text-secondary)');
    const num = document.createElement('span');
    num.textContent = String(i+1).padStart(2,'0');
    num.style.cssText='color:var(--text-muted);font-size:.6rem;flex-shrink:0;';
    a.prepend(num);
    li.appendChild(a);
    ol.appendChild(li);
  });
  toc.appendChild(ol);
  // Insert after first paragraph
  const firstP = prose.querySelector('p');
  if (firstP && firstP.nextSibling) {
    prose.insertBefore(toc, firstP.nextSibling);
  } else {
    prose.prepend(toc);
  }
})();
</script>`;

function fixBlogPost(postDir) {
  const file = path.join(postDir, 'index.html');
  if (!fs.existsSync(file)) return;
  let html = read(file);

  // Skip if already patched
  if (html.includes('sbm-newsletter-cta')) {
    return; // silent skip for batch
  }

  // Insert newsletter CTA after the author byline block
  const authorEnd = '</div> <!-- Author Byline -->';
  const authorEndAlt = '</div> <nav class="post-nav"'; // if comment not present
  if (html.includes('author-byline')) {
    // Find the closing of the author-byline div and insert CTA after it
    html = html.replace(
      /(<\/div>)\s*(<!-- Prev\/Next Navigation -->|<nav class="post-nav")/,
      '$1\n' + NEWSLETTER_CTA + '\n$2'
    );
  } else {
    // No author byline — insert before post-nav
    html = html.replace(
      '<nav class="post-nav"',
      NEWSLETTER_CTA + '\n<nav class="post-nav"'
    );
  }

  // Add TOC script before </body>
  if (!html.includes('Table of Contents')) {
    html = html.replace('</body>', TOC_SCRIPT + '\n</body>');
  }

  write(file, html);
}

function fixAllBlogPosts() {
  const blogDir = path.join(BASE, 'blog');
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  entries.forEach(e => {
    if (e.isDirectory()) {
      fixBlogPost(path.join(blogDir, e.name));
    }
  });
}

// =====================================================
// 7. CONSULTING — already has mailto, just fix LinkedIn URL
// =====================================================
function fixConsulting() {
  const file = path.join(BASE, 'consulting/index.html');
  let html = read(file);
  // Fix the LinkedIn URL (inconsistent format)
  html = html.replace(
    'href="https://www.linkedin.com/in/shamyl-bin-mansoor/"',
    'href="https://linkedin.com/in/shamylbinmansoor"'
  );
  write(file, html);
}

// =====================================================
// RUN ALL
// =====================================================
console.log('\n🔧 shamylmansoor.com — Applying fixes\n');
fixHomepage();
fixAbout();
fixWork();
fixSpeaking();
fixBlogIndex();
fixAllBlogPosts();
fixConsulting();
console.log(`\n✅ Done. ${changes} files updated, ${skipped} skipped.\n`);
