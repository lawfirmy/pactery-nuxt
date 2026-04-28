export interface BlogPost {
  slug: string
  title: string
  description: string // SEO meta description (150자 내외)
  category: 'guide' | 'comparison' | 'legal' | 'tips'
  publishedAt: string // YYYY-MM-DD
  updatedAt?: string
  author: string
  readTime: number // 분
  tags: string[]
  content: string // HTML 콘텐츠
}

// 개별 포스트 파일에서 자동 수집
const postModules = import.meta.glob<{ meta: Omit<BlogPost, 'content'>; content: string }>(
  './posts/*.ts',
  { eager: true },
)

export const blogPosts: BlogPost[] = Object.values(postModules)
  .map((m) => ({ ...m.meta, content: m.content }))
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  return blogPosts
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, limit)
}

export const categoryLabels: Record<BlogPost['category'], string> = {
  guide: '가이드',
  comparison: '비교',
  legal: '법률',
  tips: '실무 팁',
}
