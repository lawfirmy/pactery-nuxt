import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const LEGAL_TEMPLATES = [
  {
    title: '위임장',
    category: 'legal',
    description: '소송대리 위임장. 위임인/수임인 서명 포함.',
    fieldsJson: [
      { type: 'text', page: 0, x: 150, y: 200, width: 200, height: 25, required: true, label: '사건번호' },
      { type: 'text', page: 0, x: 150, y: 240, width: 200, height: 25, required: true, label: '위임인 성명' },
      { type: 'text', page: 0, x: 150, y: 280, width: 300, height: 25, required: true, label: '위임인 주소' },
      { type: 'date', page: 0, x: 150, y: 500, width: 150, height: 25, required: true, label: '작성일' },
      { type: 'signature', page: 0, x: 150, y: 550, width: 150, height: 50, required: true, label: '위임인 서명' },
      { type: 'signature', page: 0, x: 350, y: 550, width: 150, height: 50, required: true, label: '수임인 서명' },
    ],
  },
  {
    title: '수임계약서',
    category: 'legal',
    description: '변호사-의뢰인 수임계약서. 착수금, 성공보수, 비용 약정 포함.',
    fieldsJson: [
      { type: 'text', page: 0, x: 150, y: 150, width: 250, height: 25, required: true, label: '의뢰인 성명' },
      { type: 'text', page: 0, x: 150, y: 190, width: 300, height: 25, required: true, label: '사건 내용' },
      { type: 'text', page: 0, x: 150, y: 300, width: 150, height: 25, required: true, label: '착수금' },
      { type: 'text', page: 0, x: 150, y: 340, width: 150, height: 25, required: false, label: '성공보수' },
      { type: 'date', page: 0, x: 150, y: 600, width: 150, height: 25, required: true, label: '계약일' },
      { type: 'signature', page: 0, x: 100, y: 660, width: 150, height: 50, required: true, label: '갑 (의뢰인) 서명' },
      { type: 'signature', page: 0, x: 350, y: 660, width: 150, height: 50, required: true, label: '을 (변호사) 서명' },
    ],
  },
  {
    title: '합의서',
    category: 'legal',
    description: '당사자 간 합의서. 합의금, 조건, 쌍방 서명 포함.',
    fieldsJson: [
      { type: 'text', page: 0, x: 150, y: 150, width: 200, height: 25, required: true, label: '갑 성명' },
      { type: 'text', page: 0, x: 150, y: 190, width: 200, height: 25, required: true, label: '을 성명' },
      { type: 'text', page: 0, x: 150, y: 300, width: 200, height: 25, required: true, label: '합의금액' },
      { type: 'date', page: 0, x: 150, y: 550, width: 150, height: 25, required: true, label: '합의일' },
      { type: 'signature', page: 0, x: 100, y: 600, width: 150, height: 50, required: true, label: '갑 서명' },
      { type: 'signature', page: 0, x: 350, y: 600, width: 150, height: 50, required: true, label: '을 서명' },
    ],
  },
  {
    title: '비밀유지계약서 (NDA)',
    category: 'nda',
    description: '상호 비밀유지 계약서. 비밀정보 정의, 유효기간, 위반 시 배상 포함.',
    fieldsJson: [
      { type: 'text', page: 0, x: 150, y: 150, width: 250, height: 25, required: true, label: '공개당사자 (갑)' },
      { type: 'text', page: 0, x: 150, y: 190, width: 250, height: 25, required: true, label: '수령당사자 (을)' },
      { type: 'text', page: 0, x: 150, y: 350, width: 150, height: 25, required: true, label: '유효기간' },
      { type: 'date', page: 0, x: 150, y: 550, width: 150, height: 25, required: true, label: '체결일' },
      { type: 'signature', page: 0, x: 100, y: 600, width: 150, height: 50, required: true, label: '갑 서명' },
      { type: 'signature', page: 0, x: 350, y: 600, width: 150, height: 50, required: true, label: '을 서명' },
    ],
  },
  {
    title: '동의서 (개인정보 수집/이용)',
    category: 'legal',
    description: '개인정보 수집 및 이용 동의서.',
    fieldsJson: [
      { type: 'text', page: 0, x: 150, y: 300, width: 200, height: 25, required: true, label: '성명' },
      { type: 'text', page: 0, x: 150, y: 340, width: 150, height: 25, required: true, label: '생년월일' },
      { type: 'checkbox', page: 0, x: 100, y: 450, width: 20, height: 20, required: true, label: '동의' },
      { type: 'date', page: 0, x: 150, y: 550, width: 150, height: 25, required: true, label: '날짜' },
      { type: 'signature', page: 0, x: 200, y: 600, width: 150, height: 50, required: true, label: '서명' },
    ],
  },
  {
    title: '근로계약서',
    category: 'hr',
    description: '표준 근로계약서. 근무조건, 급여, 근로시간 포함.',
    fieldsJson: [
      { type: 'text', page: 0, x: 150, y: 150, width: 250, height: 25, required: true, label: '사업장명' },
      { type: 'text', page: 0, x: 150, y: 190, width: 200, height: 25, required: true, label: '근로자 성명' },
      { type: 'text', page: 0, x: 150, y: 300, width: 150, height: 25, required: true, label: '급여' },
      { type: 'date', page: 0, x: 150, y: 340, width: 150, height: 25, required: true, label: '근무개시일' },
      { type: 'date', page: 0, x: 350, y: 340, width: 150, height: 25, required: false, label: '근무종료일' },
      { type: 'date', page: 0, x: 150, y: 600, width: 150, height: 25, required: true, label: '계약일' },
      { type: 'signature', page: 0, x: 100, y: 660, width: 150, height: 50, required: true, label: '사업주 서명' },
      { type: 'signature', page: 0, x: 350, y: 660, width: 150, height: 50, required: true, label: '근로자 서명' },
    ],
  },
  {
    title: '부동산 매매계약서',
    category: 'general',
    description: '부동산 매매계약서. 목적물, 매매대금, 특약사항 포함.',
    fieldsJson: [
      { type: 'text', page: 0, x: 150, y: 150, width: 300, height: 25, required: true, label: '부동산 소재지' },
      { type: 'text', page: 0, x: 150, y: 250, width: 200, height: 25, required: true, label: '매매대금' },
      { type: 'text', page: 0, x: 150, y: 290, width: 200, height: 25, required: true, label: '계약금' },
      { type: 'text', page: 0, x: 150, y: 330, width: 200, height: 25, required: true, label: '잔금' },
      { type: 'date', page: 0, x: 150, y: 550, width: 150, height: 25, required: true, label: '계약일' },
      { type: 'signature', page: 0, x: 100, y: 620, width: 150, height: 50, required: true, label: '매도인 서명' },
      { type: 'signature', page: 0, x: 350, y: 620, width: 150, height: 50, required: true, label: '매수인 서명' },
    ],
  },
]

// ─── A/B Test Seed ───────────────────────────────────

const AB_TESTS = [
  {
    name: 'landing-hero',
    variants: [
      {
        id: 'a',
        headline: '전자서명, 쉽고 빠르게',
        subtext: '계약서 업로드부터 서명 완료까지 3분',
        cta: '무료로 시작하기',
        badge: '',
        weight: 20,
      },
      {
        id: 'b',
        headline: '업계 최저가 전자서명',
        subtext: 'eformsign 대비 60% 저렴. 같은 기능, 절반의 가격.',
        cta: '최저가로 시작하기',
        badge: '최저가 보장',
        weight: 20,
      },
      {
        id: 'c',
        headline: '변호사가 만든 전자서명',
        subtext: '15년차 변호사가 직접 설계. 법률사무소에 딱 맞는 워크플로우.',
        cta: '법률 특화 서명 시작',
        badge: '',
        weight: 20,
      },
      {
        id: 'd',
        headline: '서명 요청 30초, 완료 3분',
        subtext: 'PDF 올리고 서명자 지정하면 끝. 복잡한 설정 없이 바로.',
        cta: '30초만에 시작',
        badge: '',
        weight: 20,
      },
      {
        id: 'e',
        headline: '서명 한 건도 빠뜨리지 않는',
        subtext: 'PKI 암호화, 감사추적인증서, 실시간 알림. 법적 효력 100%.',
        cta: '안전한 서명 시작',
        badge: '법적효력 보장',
        weight: 20,
      },
    ],
  },
]

async function seedAbTests() {
  console.log('Seeding A/B tests...')

  for (const test of AB_TESTS) {
    const existing = await prisma.abTest.findFirst({
      where: { name: test.name },
    })

    if (existing) {
      await prisma.abTest.update({
        where: { id: existing.id },
        data: { variants: test.variants as any },
      })
      console.log(`  Updated AbTest: ${test.name}`)
    } else {
      await prisma.abTest.create({
        data: {
          name: test.name,
          variants: test.variants as any,
          isActive: true,
        },
      })
      console.log(`  Created AbTest: ${test.name}`)
    }
  }

  console.log(`Done! ${AB_TESTS.length} A/B tests seeded.`)
}

async function main() {
  console.log('Seeding preset templates...')

  for (const tmpl of LEGAL_TEMPLATES) {
    const existing = await prisma.template.findFirst({
      where: { title: tmpl.title, isPreset: true },
    })

    if (existing) {
      await prisma.template.update({
        where: { id: existing.id },
        data: {
          category: tmpl.category,
          description: tmpl.description,
          fieldsJson: tmpl.fieldsJson as any,
        },
      })
      console.log(`  Updated: ${tmpl.title}`)
    } else {
      await prisma.template.create({
        data: {
          title: tmpl.title,
          category: tmpl.category,
          description: tmpl.description,
          fieldsJson: tmpl.fieldsJson as any,
          isPreset: true,
        },
      })
      console.log(`  Created: ${tmpl.title}`)
    }
  }

  console.log(`Done! ${LEGAL_TEMPLATES.length} preset templates.`)

  await seedAbTests()
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
