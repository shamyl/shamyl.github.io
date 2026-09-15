#!/usr/bin/env node
/**
 * SEO Validation Script
 * Checks generated dist/ HTML files for SEO best practices.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { existsSync } from 'node:fs';

const DIST_DIR = new URL('../dist/', import.meta.url).pathname;
const SITE_ORIGIN = 'https://shamylmansoor.com';

const errors = [];
const warnings = [];
const canonicalUrls = new Set();
const sitemapUrls = new Set();

async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkDir(fullPath));
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractTag(html, tag, attr) {
  const regex = new RegExp(`<${tag}[^>]*${attr}=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractMetaContent(html, name) {
  // Try property first (og:), then name
  let val = extractTag(html, 'meta', 'property');
  if (val) return val;
  const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractAllMetaByProperty(html, property) {
  const results = [];
  const regex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'gi');
  let match;
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1]);
  }
  return results;
}

function extractAllMetaByName(html, name) {
  const results = [];
  const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'gi');
  let match;
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1]);
  }
  return results;
}

function extractTitleTag(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1] : null;
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  return match ? match[1] : null;
}

function countH1(html) {
  const matches = html.match(/<h1[^>]*>/gi);
  return matches ? matches.length : 0;
}

function extractJsonLd(html) {
  const results = [];
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

function isBlogPost(filepath) {
  return filepath.includes('/blog/') && !filepath.endsWith('/blog/index.html');
}

function validateHtmlFile(filepath, html) {
  const isBlog = isBlogPost(filepath);
  const relPath = filepath.replace(DIST_DIR, '');

  // 1. Exactly one H1
  const h1Count = countH1(html);
  if (h1Count !== 1) {
    errors.push(`${relPath}: expected exactly 1 H1, found ${h1Count}`);
  }

  // 2. Nonempty title
  const title = extractTitleTag(html);
  if (!title || title.trim() === '') {
    errors.push(`${relPath}: missing or empty <title>`);
  }

  // 3. Nonempty meta description
  const descRegex = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i;
  const descMatch = html.match(descRegex);
  if (!descMatch || descMatch[1].trim() === '') {
    errors.push(`${relPath}: missing or empty meta description`);
  }

  // 4. Canonical URL present and absolute HTTPS
  const canonical = extractCanonical(html);
  if (!canonical) {
    errors.push(`${relPath}: missing canonical URL`);
  } else {
    if (!canonical.startsWith('https://')) {
      errors.push(`${relPath}: canonical URL is not HTTPS: ${canonical}`);
    }
    if (!canonical.startsWith(SITE_ORIGIN)) {
      errors.push(`${relPath}: canonical URL does not point to ${SITE_ORIGIN}: ${canonical}`);
    }
    if (canonicalUrls.has(canonical)) {
      errors.push(`${relPath}: duplicate canonical URL: ${canonical}`);
    }
    canonicalUrls.add(canonical);
  }

  // 5. OG title, description, type
  const ogTitle = extractAllMetaByProperty(html, 'og:title');
  const ogDescription = extractAllMetaByProperty(html, 'og:description');
  const ogType = extractAllMetaByProperty(html, 'og:type');
  if (ogTitle.length === 0) {
    errors.push(`${relPath}: missing og:title`);
  }
  if (ogDescription.length === 0) {
    errors.push(`${relPath}: missing og:description`);
  }
  if (ogType.length === 0) {
    errors.push(`${relPath}: missing og:type`);
  }

  // 6. BlogPosting JSON-LD on blog pages
  if (isBlog) {
    const jsonLdBlocks = extractJsonLd(html);
    if (jsonLdBlocks.length === 0) {
      errors.push(`${relPath}: blog post missing JSON-LD`);
    } else {
      let foundBlogPosting = false;
      for (const block of jsonLdBlocks) {
        try {
          const parsed = JSON.parse(block);
          if (parsed['@type'] === 'BlogPosting') {
            foundBlogPosting = true;
          }
        } catch (e) {
          errors.push(`${relPath}: invalid JSON-LD: ${e.message}`);
        }
      }
      if (!foundBlogPosting) {
        errors.push(`${relPath}: blog post missing BlogPosting JSON-LD`);
      }
    }
  }
}

async function validateSitemap() {
  const sitemapPath = join(DIST_DIR, 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    errors.push('sitemap.xml not found in dist/');
    return;
  }

  const content = await readFile(sitemapPath, 'utf-8');
  const urlRegex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[1];
    if (!url.startsWith('https://')) {
      errors.push(`sitemap.xml: URL is not HTTPS: ${url}`);
    }
    if (!url.startsWith(SITE_ORIGIN)) {
      errors.push(`sitemap.xml: URL does not point to ${SITE_ORIGIN}: ${url}`);
    }
    if (sitemapUrls.has(url)) {
      errors.push(`sitemap.xml: duplicate URL: ${url}`);
    }
    sitemapUrls.add(url);
  }
}

async function validateRobots() {
  const robotsPath = join(DIST_DIR, 'robots.txt');
  if (!existsSync(robotsPath)) {
    errors.push('robots.txt not found in dist/');
    return;
  }
  const content = await readFile(robotsPath, 'utf-8');
  if (!content.includes('Sitemap: https://shamylmansoor.com/sitemap.xml')) {
    errors.push('robots.txt: missing sitemap reference');
  }
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    console.error('dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log('🔍 SEO Validation Script\n');
  console.log(`Checking: ${DIST_DIR}\n`);

  // Walk all HTML files
  const htmlFiles = await walkDir(DIST_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const file of htmlFiles) {
    // Skip 404 page
    if (file.endsWith('404.html')) continue;
    const html = await readFile(file, 'utf-8');
    validateHtmlFile(file, html);
  }

  // Validate sitemap
  await validateSitemap();

  // Validate robots.txt
  await validateRobots();

  // Report
  console.log('--- Results ---\n');
  console.log(`HTML files checked: ${htmlFiles.length}`);
  console.log(`Canonical URLs collected: ${canonicalUrls.size}`);
  console.log(`Sitemap URLs collected: ${sitemapUrls.size}`);

  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`  - ${w}`);
    }
  }

  if (errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`);
    for (const e of errors) {
      console.log(`  - ${e}`);
    }
    process.exit(1);
  } else {
    console.log('\n✅ All SEO checks passed!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});