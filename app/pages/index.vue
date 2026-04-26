<template>
  <div>
    <!-- Hero -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <!-- A/B 뱃지 -->
          <div v-if="hero.badge" class="mb-4 inline-flex items-center">
            <span class="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full tracking-wide">
              {{ hero.badge }}
            </span>
          </div>

          <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            {{ heroHeadlineParts.prefix
            }}<span class="text-blue-600">{{ heroHeadlineParts.highlight }}</span>{{ heroHeadlineParts.suffix }}
          </h1>
          <p class="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            {{ hero.subtext }}
          </p>
          <div class="mt-10 flex justify-center gap-4">
            <NuxtLink
              to="/auth/register"
              class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              @click="recordClick"
            >
              {{ hero.cta }}
            </NuxtLink>
            <NuxtLink
              to="/my"
              class="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              내 서명 조회
            </NuxtLink>
          </div>
          <p class="mt-4 text-sm text-gray-400">
            월 5건 무료 | 신용카드 불필요
          </p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">왜 Pactery인가?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-2xl">&#x1F50D;</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">3초 검색</h3>
            <p class="text-gray-500">모든 계약서를 제목, 서명자, 사건번호로 즉시 검색. 더 이상 헤매지 마세요.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-2xl">&#x1F512;</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">법적 효력</h3>
            <p class="text-gray-500">PKI 디지털 서명, SHA-256 해시, 감사추적인증서로 위변조 불가.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-2xl">&#x1F465;</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">팀 협업</h3>
            <p class="text-gray-500">회사 단위 문서함. 팀원별 역할/권한 관리. 누가 뭘 보냈는지 한눈에.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">합리적인 가격</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <div class="border rounded-xl p-6">
            <h3 class="font-semibold text-lg">Free</h3>
            <p class="text-3xl font-bold mt-2">0<span class="text-base font-normal text-gray-500">원/월</span></p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li>월 5건</li>
              <li>1인</li>
              <li>템플릿 3개</li>
            </ul>
          </div>
          <div class="border-2 border-blue-600 rounded-xl p-6 relative">
            <span class="absolute -top-3 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">인기</span>
            <h3 class="font-semibold text-lg">Pro</h3>
            <p class="text-3xl font-bold mt-2">19,900<span class="text-base font-normal text-gray-500">원/월</span></p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li>월 50건</li>
              <li>팀원 3명</li>
              <li>무제한 템플릿</li>
              <li>사건관리 + AI</li>
            </ul>
          </div>
          <div class="border rounded-xl p-6">
            <h3 class="font-semibold text-lg">Business</h3>
            <p class="text-3xl font-bold mt-2">49,900<span class="text-base font-normal text-gray-500">원/월</span></p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li>월 200건</li>
              <li>팀원 10명</li>
              <li>대량전송 + API</li>
              <li>브랜딩</li>
            </ul>
          </div>
          <div class="border rounded-xl p-6">
            <h3 class="font-semibold text-lg">Enterprise</h3>
            <p class="text-3xl font-bold mt-2">별도<span class="text-base font-normal text-gray-500"> 상담</span></p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li>무제한</li>
              <li>팀원 무제한</li>
              <li>전용 지원</li>
              <li>SLA</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-lg font-semibold text-white mb-2">Pactery</p>
        <p class="text-sm">pactery.com | 전자서명법 준수 | 개인정보보호</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
interface Variant {
  id: string
  headline: string
  subtext: string
  cta: string
  badge: string
  weight: number
}

interface AbTest {
  id: string
  name: string
  variants: Variant[]
}

// 기본 variant (A/B 테스트 로드 실패 시 폴백)
const DEFAULT_HERO: Variant = {
  id: 'default',
  headline: '전자서명, 쉽고 빠르게',
  subtext: '계약서 업로드부터 서명 완료까지 3분. 모든 서명 이력을 한눈에.',
  cta: '무료로 시작하기',
  badge: '',
  weight: 100,
}

const hero = ref<Variant>(DEFAULT_HERO)
const abTestId = ref<string | null>(null)

// headline을 하이라이트 분리 렌더링 (기본 variant 기준 "," 앞/뒤 분리)
const heroHeadlineParts = computed(() => {
  const h = hero.value.headline
  const commaIdx = h.indexOf(',')
  if (commaIdx === -1) {
    return { prefix: '', highlight: h, suffix: '' }
  }
  return {
    prefix: h.slice(0, commaIdx + 1) + ' ',
    highlight: h.slice(commaIdx + 2),
    suffix: '',
  }
})

/**
 * weight 기반 랜덤 variant 선택
 * weight 합산 후 누적 비율로 선택
 */
function pickVariant(variants: Variant[]): Variant {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
  const rand = Math.random() * totalWeight
  let cumulative = 0
  for (const v of variants) {
    cumulative += v.weight
    if (rand < cumulative) return v
  }
  return variants[variants.length - 1]
}

/**
 * impression 기록 (fire-and-forget)
 */
function recordImpression(testId: string, variantId: string, action: 'view' | 'click' | 'signup') {
  $fetch('/api/ab/impress', {
    method: 'POST',
    body: { testId, variantId, action },
  }).catch(() => {
    // impression 실패는 사용자 경험에 영향 없이 무시
  })
}

function recordClick() {
  if (abTestId.value && hero.value.id !== 'default') {
    recordImpression(abTestId.value, hero.value.id, 'click')
  }
}

onMounted(async () => {
  try {
    const tests = await $fetch<AbTest[]>('/api/ab/active')
    const landingHeroTest = tests.find((t) => t.name === 'landing-hero')

    if (!landingHeroTest || !landingHeroTest.variants?.length) return

    abTestId.value = landingHeroTest.id

    // 쿠키에서 기존 variant 확인 (30일 유지)
    const cookieKey = `ab_variant_${landingHeroTest.id}`
    const savedVariantId = useCookie(cookieKey, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    })

    let selectedVariant: Variant

    if (savedVariantId.value) {
      // 기존 쿠키에서 variant 복원
      const found = landingHeroTest.variants.find((v) => v.id === savedVariantId.value)
      selectedVariant = found ?? pickVariant(landingHeroTest.variants)
    } else {
      // 신규 방문자: weight 기반 랜덤 선택 후 쿠키 저장
      selectedVariant = pickVariant(landingHeroTest.variants)
      savedVariantId.value = selectedVariant.id
    }

    hero.value = selectedVariant

    // view impression 기록
    recordImpression(landingHeroTest.id, selectedVariant.id, 'view')
  } catch {
    // A/B 테스트 로드 실패 시 기본값 유지
  }
})

useHead({ title: 'Pactery - 전자서명, 쉽고 빠르게' })
</script>
