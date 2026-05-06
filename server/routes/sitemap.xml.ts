import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler((event) => {
  const baseUrl = process.env.APP_URL || 'https://pactery.com'

  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: '1.0', lastmod: '2026-04-27' },
    { url: '/auth/login', changefreq: 'monthly', priority: '0.5', lastmod: '2026-04-27' },
    { url: '/auth/register', changefreq: 'monthly', priority: '0.6', lastmod: '2026-04-27' },
    { url: '/blog', changefreq: 'daily', priority: '0.9', lastmod: '2026-04-27' },
  ]

  // Read blog post slugs from filesystem (avoids import.meta.glob in server context)
  let blogPages: Array<{ url: string; changefreq: string; priority: string; lastmod: string }> = []
  try {
    const postsDir = resolve(process.cwd(), 'app/data/posts')
    const files = readdirSync(postsDir).filter(f => f.endsWith('.ts'))
    blogPages = files.map(f => ({
      url: `/blog/${f.replace('.ts', '')}`,
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: '2026-04-27',
    }))
  } catch {
    // posts dir not found in production — skip blog pages
  }

  const allPages = [...staticPages, ...blogPages]

  const urls = allPages
    .map(page =>
      `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return xml
})
