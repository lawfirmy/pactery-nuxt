export default defineEventHandler((event) => {
  const baseUrl = process.env.APP_URL || 'https://pactery.com'

  const content = `User-agent: *
Allow: /
Allow: /blog/
Disallow: /org/
Disallow: /my/
Disallow: /admin/
Disallow: /api/
Sitemap: ${baseUrl}/sitemap.xml
`

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=86400')

  return content
})
