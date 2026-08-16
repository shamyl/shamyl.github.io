import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

const SITE_URL = 'https://shamylmansoor.com';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function GET() {
  const [blogPosts, projects] = await Promise.all([
    getCollection('blog'),
    getCollection('projects'),
  ]);

  const staticPages = [
    { url: `${SITE_URL}/`, lastmod: null, priority: '1.0' },
    { url: `${SITE_URL}/about/`, lastmod: null, priority: '0.9' },
    { url: `${SITE_URL}/blog/`, lastmod: null, priority: '0.9' },
    { url: `${SITE_URL}/work/`, lastmod: null, priority: '0.8' },
    { url: `${SITE_URL}/speaking/`, lastmod: null, priority: '0.7' },
    { url: `${SITE_URL}/consulting/`, lastmod: null, priority: '0.8' },
  ];

  // Use latest blog post date for blog index
  const sortedBlog = blogPosts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  if (sortedBlog.length > 0) {
    staticPages.find(p => p.url === `${SITE_URL}/blog/`)!.lastmod = formatDate(sortedBlog[0].data.date);
  }

  const blogUrls = sortedBlog.map(post => ({
    url: `${SITE_URL}/blog/${post.id}/`,
    lastmod: formatDate(post.data.dateModified || post.data.date),
    priority: '0.7',
  }));

  const projectUrls = projects.map(project => ({
    url: `${SITE_URL}/work/${project.id}/`,
    lastmod: formatDate(project.data.date),
    priority: '0.6',
  }));

  const allUrls = [...staticPages, ...blogUrls, ...projectUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(entry => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}