#!/usr/bin/env npx tsx
/**
 * 블로그 글 자동 생성 스크립트
 *
 * 사용법:
 *   npx tsx scripts/generate-blog.ts              # 1개 생성
 *   npx tsx scripts/generate-blog.ts --count 3    # 3개 생성
 *
 * blog-topics.ts의 토픽 풀에서 아직 posts/ 디렉토리에 파일이 없는 것을 선택하여 생성합니다.
 * 콘텐츠는 토픽의 outline을 기반으로 SEO 최적화된 HTML을 템플릿으로 생성합니다.
 */

import { readdir, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { topicPool, type TopicSeed } from './blog-topics'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const POSTS_DIR = join(__dirname, '..', 'app', 'data', 'posts')

function getToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function generateContent(topic: TopicSeed): string {
  const sections = topic.outline.map((heading, i) => {
    const paragraphs = generateParagraph(topic, heading, i)
    return `<h2>${heading}</h2>\n${paragraphs}`
  }).join('\n\n')

  return sections
}

function generateParagraph(topic: TopicSeed, heading: string, index: number): string {
  // 산업/문서 유형에 따라 관련 콘텐츠 생성
  const category = topic.category
  const slug = topic.slug

  // 기본 단락 + 리스트 구조
  const parts: string[] = []

  if (index === 0) {
    // 도입부
    parts.push(`<p>${topic.title}에 대해 알아보겠습니다. ${topic.description}</p>`)
    parts.push(`<p>전자서명은 종이 문서의 번거로움을 해소하고, 계약 체결 시간을 수일에서 수분으로 단축합니다. 특히 <strong>${topic.tags[0]}</strong> 분야에서는 반복적인 계약 업무가 많아 전자서명의 도입 효과가 극대화됩니다.</p>`)
  } else if (index === topic.outline.length - 1) {
    // 마무리 (Pactery CTA)
    parts.push(`<p>Pactery는 이러한 요구를 충족하는 <strong>업계 최저가 전자서명 서비스</strong>입니다.</p>`)
    parts.push(`<ul>
<li><strong>Free</strong>: 월 5건 무료, 감사추적인증서 포함</li>
<li><strong>Starter</strong>: 월 19,900원, 50건, 팀원 5명, 무제한 템플릿</li>
<li><strong>Business</strong>: 월 39,900원, 200건, 팀원 15명, 대량전송·API·브랜딩</li>
</ul>`)
    parts.push(`<p><a href="https://pactery.com/auth/register">무료 체험</a>으로 직접 확인해 보세요. 도입 문의는 contact@pactery.com으로 연락 주시기 바랍니다.</p>`)
  } else {
    // 중간 섹션
    parts.push(`<p>${heading}은(는) ${topic.tags[0]} 업무에서 매우 중요한 부분입니다. 전자서명을 활용하면 이 과정을 크게 효율화할 수 있습니다.</p>`)

    // 리스트 항목 추가
    const listItems = generateListItems(topic, heading)
    if (listItems.length > 0) {
      parts.push(`<ul>\n${listItems.map(item => `<li>${item}</li>`).join('\n')}\n</ul>`)
    }

    // 추가 설명
    if (index % 2 === 0) {
      parts.push(`<p>전자서명법 제3조에 따르면, 전자서명은 "전자적 형태라는 이유만으로 서명, 서명날인 또는 기명날인으로서의 효력이 부인되지 아니한다"고 규정하고 있습니다. 따라서 <strong>${topic.tags[0]}</strong> 관련 문서에도 전자서명이 완전한 법적 효력을 가집니다.</p>`)
    } else {
      parts.push(`<p>Pactery는 <strong>PKI 기반 디지털 서명</strong>과 <strong>SHA-256 해시</strong>로 문서의 무결성을 보장합니다. 모든 서명에는 감사추적인증서가 자동으로 생성되어, 서명 시점, 서명자 IP, 인증 방법 등이 기록됩니다.</p>`)
    }
  }

  return parts.join('\n')
}

function generateListItems(topic: TopicSeed, heading: string): string[] {
  const items: string[] = []
  const field = topic.tags[0]

  items.push(`<strong>시간 절약</strong>: ${field} 문서의 서명 소요 시간을 수일에서 수분으로 단축`)
  items.push(`<strong>비용 절감</strong>: 인쇄, 우편, 보관 비용 절감 (연간 수십~수백만 원)`)
  items.push(`<strong>법적 효력</strong>: 전자서명법에 따른 완전한 법적 효력 보장`)
  items.push(`<strong>감사추적</strong>: 서명 전 과정의 자동 기록으로 분쟁 예방`)

  if (topic.category === 'tips') {
    items.push(`<strong>대량 처리</strong>: 수십~수백 건의 ${field} 문서를 일괄 발송`)
  }
  if (topic.category === 'legal') {
    items.push(`<strong>증거 능력</strong>: 감사추적인증서를 통한 법원 증거 제출 가능`)
  }

  return items
}

async function getExistingSlugs(): Promise<Set<string>> {
  try {
    const files = await readdir(POSTS_DIR)
    return new Set(files.filter(f => f.endsWith('.ts')).map(f => f.replace('.ts', '')))
  } catch {
    return new Set()
  }
}

async function generatePost(topic: TopicSeed): Promise<void> {
  const content = generateContent(topic)
  const today = getToday()

  const fileContent = `export const meta = {
  slug: '${topic.slug}',
  title: '${topic.title.replace(/'/g, "\\'")}',
  description: '${topic.description.replace(/'/g, "\\'")}',
  category: '${topic.category}' as const,
  publishedAt: '${today}',
  author: 'Pactery 팀',
  readTime: ${topic.readTime},
  tags: [${topic.tags.map(t => `'${t}'`).join(', ')}],
}

export const content = \`
${content}
\`
`

  const filePath = join(POSTS_DIR, `${topic.slug}.ts`)
  await writeFile(filePath, fileContent, 'utf-8')
  console.log(`[생성] ${topic.slug} → ${filePath}`)
}

async function main() {
  const countArg = process.argv.indexOf('--count')
  const count = countArg !== -1 ? parseInt(process.argv[countArg + 1], 10) : 1

  const existing = await getExistingSlugs()
  const available = topicPool.filter(t => !existing.has(t.slug))

  if (available.length === 0) {
    console.log('모든 토픽이 이미 생성되었습니다. blog-topics.ts에 새 토픽을 추가하세요.')
    return
  }

  const toGenerate = available.slice(0, count)
  console.log(`${toGenerate.length}개 글 생성 시작...`)

  for (const topic of toGenerate) {
    await generatePost(topic)
  }

  console.log(`완료! ${toGenerate.length}개 글이 생성되었습니다.`)
  console.log(`남은 토픽: ${available.length - toGenerate.length}개`)
}

main().catch(console.error)
