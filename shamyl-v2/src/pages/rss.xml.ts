import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  
  const siteUrl = (context.site?.toString() || 'https://shamyl.github.io').replace(/\/$/, '');
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Shamyl Bin Mansoor - Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Updates, thoughts, and announcements from Shamyl Bin Mansoor - Co-founder &amp; CTO @ LearnOBots</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/favicon.svg</url>
      <title>Shamyl Bin Mansoor - Blog</title>
      <link>${siteUrl}/blog</link>
    </image>
${sortedPosts.map(post => {
  const postUrl = `${siteUrl}/blog/${post.id}`;
  const pubDate = new Date(post.data.date).toUTCString();
  const description = post.data.description || '';
  const tags = post.data.tags?.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n    ') || '';
  
  return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      ${tags}
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
