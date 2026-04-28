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
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900">업계 최저가, 기능은 최고</h2>
          <p class="mt-3 text-gray-500">타사 대비 최대 80% 저렴합니다. 추가 건당 990원.</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <!-- Free -->
          <div class="border rounded-xl p-6">
            <h3 class="font-semibold text-lg">Free</h3>
            <p class="text-3xl font-bold mt-2">0<span class="text-base font-normal text-gray-500">원/월</span></p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li>월 5건</li>
              <li>1인</li>
              <li>템플릿 3개</li>
              <li>이메일 · 카카오톡 전송</li>
              <li>대면서명</li>
              <li>감사추적인증서</li>
              <li>문서 위변조 확인</li>
            </ul>
            <NuxtLink to="/auth/register" class="mt-6 block text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
              무료로 시작
            </NuxtLink>
          </div>
          <!-- Starter -->
          <div class="border-2 border-blue-600 rounded-xl p-6 relative">
            <span class="absolute -top-3 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">인기</span>
            <h3 class="font-semibold text-lg">Starter</h3>
            <p class="text-3xl font-bold mt-2 text-blue-600">19,900<span class="text-base font-normal text-gray-500">원/월</span></p>
            <p class="text-xs text-green-600 font-medium mt-1">타사 팀 요금제 대비 64% 절감</p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li><strong>월 50건</strong></li>
              <li><strong>팀원 5명</strong></li>
              <li>무제한 템플릿</li>
              <li>사건관리 연동</li>
              <li>링크서명 · 예약전송</li>
              <li>서명 순서 · CC 지정</li>
              <li>슬랙 · 구글드라이브 연동</li>
              <li>계약 리마인더</li>
              <li>법률 서식 제공</li>
            </ul>
            <NuxtLink to="/auth/register" class="mt-6 block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
              무료체험 시작
            </NuxtLink>
          </div>
          <!-- Business -->
          <div class="border rounded-xl p-6">
            <h3 class="font-semibold text-lg">Business</h3>
            <p class="text-3xl font-bold mt-2">39,900<span class="text-base font-normal text-gray-500">원/월</span></p>
            <p class="text-xs text-green-600 font-medium mt-1">타사 프로 요금제 대비 55% 절감</p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li><strong>월 200건</strong></li>
              <li><strong>팀원 15명</strong></li>
              <li>Starter 전체 포함</li>
              <li>대량전송 · API 연동</li>
              <li>이메일/카카오 브랜딩</li>
              <li>내부결재</li>
              <li>멤버별 이용량 조회</li>
              <li>고급 입력란 · 데이터 추출</li>
              <li>구글시트 · 노션 연동</li>
            </ul>
            <NuxtLink to="/auth/register" class="mt-6 block text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
              무료체험 시작
            </NuxtLink>
          </div>
          <!-- Enterprise -->
          <div class="border rounded-xl p-6">
            <h3 class="font-semibold text-lg">Enterprise</h3>
            <p class="text-3xl font-bold mt-2">별도<span class="text-base font-normal text-gray-500"> 상담</span></p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li><strong>무제한 건수</strong></li>
              <li><strong>팀원 무제한</strong></li>
              <li>Business 전체 포함</li>
              <li>SSO (Single Sign-On)</li>
              <li>IP 접근 제어</li>
              <li>2단계 인증</li>
              <li>전용 담당자 배정</li>
              <li>SLA 보장</li>
              <li>온프레미스 설치 가능</li>
            </ul>
            <a href="mailto:contact@pactery.com" class="mt-6 block text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
              도입 문의
            </a>
          </div>
        </div>

        <!-- 경쟁사 비교 하이라이트 -->
        <div class="mt-16 max-w-3xl mx-auto">
          <h3 class="text-xl font-bold text-center text-gray-900 mb-8">같은 기능, 확 다른 가격</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between bg-gray-50 rounded-lg px-6 py-4">
              <div>
                <p class="font-medium text-gray-900">팀 요금제 (30건, 3명)</p>
                <p class="text-sm text-gray-500">모두싸인 TEAM 기준</p>
              </div>
              <div class="text-right">
                <p class="text-gray-400 line-through text-sm">55,000원/월</p>
                <p class="text-blue-600 font-bold">19,900원/월 <span class="text-xs text-green-600">(50건, 5명)</span></p>
              </div>
            </div>
            <div class="flex items-center justify-between bg-gray-50 rounded-lg px-6 py-4">
              <div>
                <p class="font-medium text-gray-900">프로 요금제 (30건, 5명)</p>
                <p class="text-sm text-gray-500">모두싸인 TEAM PRO 기준</p>
              </div>
              <div class="text-right">
                <p class="text-gray-400 line-through text-sm">88,000원/월</p>
                <p class="text-blue-600 font-bold">39,900원/월 <span class="text-xs text-green-600">(200건, 15명)</span></p>
              </div>
            </div>
            <div class="flex items-center justify-between bg-gray-50 rounded-lg px-6 py-4">
              <div>
                <p class="font-medium text-gray-900">비즈니스 (100건, 무제한)</p>
                <p class="text-sm text-gray-500">eformsign Business 기준</p>
              </div>
              <div class="text-right">
                <p class="text-gray-400 line-through text-sm">40,000원/월</p>
                <p class="text-blue-600 font-bold">39,900원/월 <span class="text-xs text-green-600">(200건, 15명)</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 전체 기능 비교표 -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">요금제별 전체 기능 비교</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-700">기능</th>
                <th class="text-center py-3 px-2 font-semibold text-gray-700">Free</th>
                <th class="text-center py-3 px-2 font-semibold text-blue-600">Starter</th>
                <th class="text-center py-3 px-2 font-semibold text-gray-700">Business</th>
                <th class="text-center py-3 px-2 font-semibold text-gray-700">Enterprise</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr class="bg-gray-100"><td colspan="5" class="py-2 px-4 font-semibold text-gray-800">핵심 기능</td></tr>
              <tr><td class="py-2 px-4">서명 요청</td><td class="text-center">월 5건</td><td class="text-center">월 50건</td><td class="text-center">월 200건</td><td class="text-center">무제한</td></tr>
              <tr><td class="py-2 px-4">멤버 (계정)</td><td class="text-center">1명</td><td class="text-center">5명</td><td class="text-center">15명</td><td class="text-center">무제한</td></tr>
              <tr><td class="py-2 px-4">문서당 서명자</td><td class="text-center">최대 5명</td><td class="text-center">최대 30명</td><td class="text-center">최대 30명</td><td class="text-center">최대 30명</td></tr>
              <tr><td class="py-2 px-4">이메일 · 카카오톡 전송</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">대면서명</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">링크서명</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">대량전송</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">실시간 고객 지원</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">전용 담당자</td></tr>

              <tr class="bg-gray-100"><td colspan="5" class="py-2 px-4 font-semibold text-gray-800">계약 설정 및 체결</td></tr>
              <tr><td class="py-2 px-4">템플릿</td><td class="text-center">3개</td><td class="text-center">무제한</td><td class="text-center">무제한</td><td class="text-center">무제한</td></tr>
              <tr><td class="py-2 px-4">문서당 첨부파일</td><td class="text-center">3개</td><td class="text-center">30개</td><td class="text-center">30개</td><td class="text-center">30개</td></tr>
              <tr><td class="py-2 px-4">사인 · 도장 · 이니셜</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">법률 서식 제공</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">서명 순서 · 유효기간 지정</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">참조자(CC) · 메모</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">다국어 지원</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">예약 전송</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">고급 입력란 · 문서 편집</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">서명자 필드 사전입력</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>

              <tr class="bg-gray-100"><td colspan="5" class="py-2 px-4 font-semibold text-gray-800">계약 관리</td></tr>
              <tr><td class="py-2 px-4">대시보드 · 문서 검색</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">라벨 · 문서 자동 교부</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">사건관리 연동</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">계약 리마인더</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">문서 데이터 추출</td><td class="text-center">-</td><td class="text-center">기본</td><td class="text-center">정밀</td><td class="text-center">정밀</td></tr>

              <tr class="bg-gray-100"><td colspan="5" class="py-2 px-4 font-semibold text-gray-800">조직 관리 · 브랜딩</td></tr>
              <tr><td class="py-2 px-4">내부결재</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">멤버별 이용량 조회</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">이메일 · 카카오톡 브랜딩</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>

              <tr class="bg-gray-100"><td colspan="5" class="py-2 px-4 font-semibold text-gray-800">인증 · 보안</td></tr>
              <tr><td class="py-2 px-4">감사추적인증서</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">문서 위변조 확인 · 잠금</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">다양한 인증 수단</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">감사로그 (Audit Log)</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">IP 접근 제어</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">SSO · 2단계 인증</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td></tr>

              <tr class="bg-gray-100"><td colspan="5" class="py-2 px-4 font-semibold text-gray-800">연동 서비스</td></tr>
              <tr><td class="py-2 px-4">슬랙 알림</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">구글 드라이브 자동 백업</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">구글 시트 · 노션 연동</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">API 연동</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td><td class="text-center">&#10003;</td></tr>
              <tr><td class="py-2 px-4">Zapier · Webhook</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">-</td><td class="text-center">&#10003;</td></tr>
            </tbody>
          </table>
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
