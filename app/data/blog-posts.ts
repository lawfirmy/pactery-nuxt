import { blogContents } from './blog-content'

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

export const blogPosts: BlogPost[] = [
  {
    slug: 'what-is-electronic-signature',
    title: '전자서명이란? 완벽 가이드',
    description: '전자서명의 개념부터 작동 원리까지 쉽게 설명합니다. 공인전자서명과 사서명의 차이, 법적 효력, 실무 활용 방법을 한 번에 정리한 완벽 입문 가이드입니다.',
    category: 'guide',
    publishedAt: '2026-04-01',
    author: 'Pactery 팀',
    readTime: 8,
    tags: ['전자서명', '전자서명이란', '전자서명 개념', '디지털 서명'],
    content: '',
  },
  {
    slug: 'electronic-signature-vs-digital-signature',
    title: '전자서명 vs 디지털서명 차이점 완전 정리',
    description: '전자서명과 디지털서명은 같은 말일까요? 두 개념의 정확한 차이와 법률적 구분, 실무에서 어떤 상황에 무엇을 써야 하는지 명확하게 정리합니다.',
    category: 'guide',
    publishedAt: '2026-04-03',
    author: 'Pactery 팀',
    readTime: 7,
    tags: ['전자서명', '디지털서명', '전자서명 차이', 'PKI'],
    content: '',
  },
  {
    slug: 'electronic-signature-legal-validity',
    title: '전자서명의 법적 효력 — 계약서에 효력이 있을까?',
    description: '전자서명법 제3조와 판례를 바탕으로 전자서명 계약서의 법적 효력을 분석합니다. 법원에서 인정받는 요건과 분쟁 대비 감사추적 보관 방법까지 안내합니다.',
    category: 'legal',
    publishedAt: '2026-04-05',
    author: 'Pactery 팀',
    readTime: 10,
    tags: ['전자서명 법적효력', '전자서명법', '전자계약', '법률'],
    content: '',
  },
  {
    slug: 'how-to-send-signature-request',
    title: '전자서명 요청 보내는 방법 — 단계별 실전 가이드',
    description: 'Pactery에서 전자서명 요청을 보내는 전 과정을 스크린샷과 함께 설명합니다. 문서 업로드부터 서명 필드 지정, 서명자 초대, 완료 확인까지 5분이면 충분합니다.',
    category: 'guide',
    publishedAt: '2026-04-08',
    author: 'Pactery 팀',
    readTime: 6,
    tags: ['전자서명 요청', '전자서명 사용법', 'Pactery', '전자계약 보내기'],
    content: '',
  },
  {
    slug: 'pactery-vs-eformsign',
    title: 'Pactery vs eformsign 비교 — 법률사무소라면 어떤 걸 써야 할까?',
    description: 'Pactery와 eformsign을 가격, 기능, 법률사무소 적합성 측면에서 비교합니다. 사건관리 연동, 감사추적, 모바일 서명 등 실무 관점에서 꼭 필요한 차이점을 정리했습니다.',
    category: 'comparison',
    publishedAt: '2026-04-10',
    author: 'Pactery 팀',
    readTime: 9,
    tags: ['Pactery', 'eformsign', '전자서명 비교', '법률사무소 전자서명'],
    content: '',
  },
  {
    slug: 'pactery-vs-docusign',
    title: 'Pactery vs DocuSign 비교 — 한국 법률사무소에 맞는 선택은?',
    description: 'DocuSign과 Pactery의 요금제, 한국어 지원, 전자서명법 준수 여부를 상세 비교합니다. 글로벌 서비스 vs 국내 특화 서비스의 트레이드오프를 실무 관점으로 분석합니다.',
    category: 'comparison',
    publishedAt: '2026-04-12',
    author: 'Pactery 팀',
    readTime: 9,
    tags: ['Pactery', 'DocuSign', '전자서명 비교', '전자서명 서비스'],
    content: '',
  },
  {
    slug: 'pactery-vs-modusign',
    title: 'Pactery vs 모두싸인 비교 — 2026년 최신 기준',
    description: '모두싸인과 Pactery를 2026년 기준으로 가격, 템플릿 관리, 사건관리 연동, 감사추적 기능 면에서 비교합니다. 법률사무소에 특화된 서비스를 찾는다면 꼭 읽어보세요.',
    category: 'comparison',
    publishedAt: '2026-04-14',
    author: 'Pactery 팀',
    readTime: 8,
    tags: ['Pactery', '모두싸인', '전자서명 비교', '전자서명 추천'],
    content: '',
  },
  {
    slug: 'law-firm-electronic-signature',
    title: '법률사무소 전자서명 도입 가이드 — 준비부터 운영까지',
    description: '법률사무소에 전자서명을 도입할 때 고려해야 할 보안 요건, 의뢰인 동의 절차, 서명 보관 기간, 팀 권한 설정까지 실무 담당자가 바로 활용할 수 있는 체크리스트를 제공합니다.',
    category: 'tips',
    publishedAt: '2026-04-16',
    author: 'Pactery 팀',
    readTime: 11,
    tags: ['법률사무소', '전자서명 도입', '전자서명 운영', '법무팀'],
    content: '',
  },
  {
    slug: 'electronic-signature-security',
    title: '전자서명 보안: PKI부터 감사추적까지 완전 해부',
    description: '전자서명의 보안 원리를 PKI 공개키 암호화, 타임스탬프, 감사추적(Audit Trail) 관점에서 설명합니다. 서명 위변조를 어떻게 탐지하는지, 실무에서 무엇을 확인해야 하는지 정리했습니다.',
    category: 'guide',
    publishedAt: '2026-04-19',
    author: 'Pactery 팀',
    readTime: 12,
    tags: ['전자서명 보안', 'PKI', '감사추적', '전자서명 위변조'],
    content: '',
  },
  {
    slug: 'free-electronic-signature-tools',
    title: '무료 전자서명 도구 비교 2026 — 진짜 무료인 서비스는?',
    description: '2026년 현재 무료로 사용할 수 있는 전자서명 도구를 비교합니다. 무료 플랜의 실제 제한사항, 숨겨진 비용, 법적 효력 여부를 꼼꼼히 따져 올바른 선택을 도와드립니다.',
    category: 'comparison',
    publishedAt: '2026-04-21',
    author: 'Pactery 팀',
    readTime: 8,
    tags: ['무료 전자서명', '전자서명 무료', '전자서명 추천', '전자서명 비교 2026'],
    content: '',
  },
]

// 콘텐츠 연결
blogPosts.forEach(post => {
  if (blogContents[post.slug]) post.content = blogContents[post.slug]
})

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  return blogPosts
    .filter(post => post.slug !== currentSlug && post.category === category)
    .slice(0, limit)
}

export const categoryLabels: Record<BlogPost['category'], string> = {
  guide: '가이드',
  comparison: '비교',
  legal: '법률',
  tips: '실무 팁',
}
