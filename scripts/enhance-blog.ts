#!/usr/bin/env npx tsx
/**
 * 블로그 글 고도화 스크립트
 *
 * 사용법:
 *   npx tsx scripts/enhance-blog.ts              # 가장 짧은 글 3개 고도화
 *   npx tsx scripts/enhance-blog.ts --count 5    # 5개 고도화
 *
 * 기존 포스트 중 content 길이가 가장 짧은 글을 선택하여
 * 추가 섹션, FAQ, 관련 키워드를 보강합니다.
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const POSTS_DIR = join(__dirname, '..', 'app', 'data', 'posts')

interface PostFile {
  slug: string
  path: string
  contentLength: number
  rawContent: string
}

const ENHANCEMENT_SECTIONS = [
  {
    heading: '자주 묻는 질문 (FAQ)',
    generate: (slug: string) => `
<h2>자주 묻는 질문 (FAQ)</h2>
<h3>Q. 전자서명은 법적으로 유효한가요?</h3>
<p>네, 전자서명법 제3조에 따라 전자서명은 수기서명과 동등한 법적 효력을 가집니다. 전자적 형태라는 이유만으로 효력이 부인되지 않습니다.</p>

<h3>Q. 상대방이 전자서명에 익숙하지 않아도 되나요?</h3>
<p>Pactery는 이메일이나 카카오톡으로 서명 링크를 전송합니다. 서명자는 별도 회원가입이나 앱 설치 없이 링크를 클릭하여 바로 서명할 수 있습니다.</p>

<h3>Q. 서명 후 문서를 위변조할 수 없나요?</h3>
<p>Pactery는 SHA-256 해시와 PKI 디지털 서명으로 문서의 무결성을 보장합니다. 서명 완료 후 단 1바이트라도 변경되면 위변조가 즉시 탐지됩니다.</p>

<h3>Q. 무료로 사용할 수 있나요?</h3>
<p>Pactery Free 플랜은 월 5건까지 무료로 이용할 수 있습니다. 감사추적인증서, 문서 위변조 확인 등 핵심 기능이 모두 포함됩니다.</p>`,
  },
  {
    heading: '전자서명 도입 시 비용 절감 효과',
    generate: (slug: string) => `
<h2>전자서명 도입 시 비용 절감 효과</h2>
<p>전자서명을 도입하면 다음과 같은 비용을 절감할 수 있습니다.</p>
<ul>
<li><strong>인쇄 비용</strong>: A4 용지, 토너, 프린터 유지비 → 월 5~20만 원 절감</li>
<li><strong>우편 비용</strong>: 등기우편 왕복 5,060원 × 건수 → 월 15~50만 원 절감</li>
<li><strong>보관 비용</strong>: 서류 캐비닛, 창고 임대료 → 월 5~10만 원 절감</li>
<li><strong>인건비</strong>: 출력/스캔/정리 업무 시간 → 직원 1인 월 20~40시간 절감</li>
</ul>
<p>중규모 사무소(직원 5~10명) 기준으로 연간 <strong>약 500~1,200만 원</strong>의 비용 절감이 가능합니다. Pactery Starter 요금제(월 19,900원)는 첫 달부터 ROI가 발생합니다.</p>`,
  },
  {
    heading: 'Pactery로 시작하기',
    generate: (slug: string) => `
<h2>Pactery로 시작하기</h2>
<p>Pactery는 법률사무소 특화 전자서명 서비스로, 업계 최저가를 보장합니다.</p>
<ol>
<li><strong>무료 회원가입</strong>: <a href="https://pactery.com/auth/register">pactery.com</a>에서 이메일 또는 구글/카카오 계정으로 가입</li>
<li><strong>조직 생성</strong>: 회사명과 팀원을 등록하여 조직을 생성합니다</li>
<li><strong>첫 문서 업로드</strong>: PDF를 업로드하고 서명 필드를 배치합니다</li>
<li><strong>서명 요청 발송</strong>: 서명자의 이메일이나 카카오톡으로 서명 링크를 전송합니다</li>
<li><strong>서명 완료 및 보관</strong>: 서명이 완료되면 감사추적인증서와 함께 자동 보관됩니다</li>
</ol>
<p>전체 과정은 <strong>5분 이내</strong>에 완료됩니다. 무료 플랜으로 충분히 테스트한 후 유료 전환을 결정할 수 있습니다.</p>`,
  },
]

async function getPostFiles(): Promise<PostFile[]> {
  const files = await readdir(POSTS_DIR)
  const posts: PostFile[] = []

  for (const file of files.filter(f => f.endsWith('.ts'))) {
    const filePath = join(POSTS_DIR, file)
    const raw = await readFile(filePath, 'utf-8')

    // content 길이 추출 (백틱 사이의 HTML)
    const contentMatch = raw.match(/export const content = `([\s\S]*?)`\s*$/)
    const contentLength = contentMatch ? contentMatch[1].trim().length : 0

    posts.push({
      slug: file.replace('.ts', ''),
      path: filePath,
      contentLength,
      rawContent: raw,
    })
  }

  return posts.sort((a, b) => a.contentLength - b.contentLength)
}

function needsEnhancement(raw: string): string[] {
  const missing: string[] = []
  for (const section of ENHANCEMENT_SECTIONS) {
    if (!raw.includes(section.heading)) {
      missing.push(section.heading)
    }
  }
  return missing
}

async function enhancePost(post: PostFile): Promise<boolean> {
  const missing = needsEnhancement(post.rawContent)
  if (missing.length === 0) {
    console.log(`[스킵] ${post.slug} — 이미 모든 보강 섹션 포함`)
    return false
  }

  let enhanced = post.rawContent

  // content 백틱 닫기 전에 추가 섹션 삽입
  for (const section of ENHANCEMENT_SECTIONS) {
    if (missing.includes(section.heading)) {
      const newContent = section.generate(post.slug)
      // 마지막 백틱 앞에 삽입
      enhanced = enhanced.replace(/\n`\s*$/, `\n${newContent}\n\`\n`)
    }
  }

  await writeFile(post.path, enhanced, 'utf-8')
  console.log(`[고도화] ${post.slug} — ${missing.length}개 섹션 추가 (${post.contentLength}자 → 보강됨)`)
  return true
}

async function main() {
  const countArg = process.argv.indexOf('--count')
  const count = countArg !== -1 ? parseInt(process.argv[countArg + 1], 10) : 3

  const posts = await getPostFiles()
  console.log(`총 ${posts.length}개 포스트 중 가장 짧은 ${count}개를 고도화합니다.\n`)

  let enhanced = 0
  for (const post of posts) {
    if (enhanced >= count) break
    const result = await enhancePost(post)
    if (result) enhanced++
  }

  console.log(`\n완료! ${enhanced}개 글이 고도화되었습니다.`)
}

main().catch(console.error)
