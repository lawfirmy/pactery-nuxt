<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">A/B 테스트 관리</h1>
        <p class="mt-1 text-sm text-gray-500">랜딩 페이지 변형별 전환율을 확인하고 테스트를 관리합니다.</p>
      </div>
    </div>

    <!-- 로딩 -->
    <div v-if="pending" class="flex items-center justify-center py-20">
      <div class="text-gray-400 text-sm">불러오는 중...</div>
    </div>

    <!-- 오류 -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-red-600 text-sm">데이터를 불러오지 못했습니다. 다시 시도해 주세요.</p>
      <button @click="refresh()" class="mt-3 text-sm text-red-700 underline">다시 시도</button>
    </div>

    <!-- 테스트 목록 -->
    <div v-else class="space-y-8">
      <div
        v-for="test in tests"
        :key="test.id"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden"
      >
        <!-- 테스트 헤더 -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div class="flex items-center gap-3">
            <span class="font-semibold text-gray-900">{{ test.name }}</span>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="test.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'"
            >
              {{ test.isActive ? '활성' : '비활성' }}
            </span>
            <span class="text-xs text-gray-400">총 {{ test.totalImpressions.toLocaleString() }}회 노출</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400">{{ formatDate(test.createdAt) }}</span>
            <!-- 활성/비활성 토글 -->
            <button
              @click="toggleActive(test)"
              :disabled="togglingId === test.id"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50"
              :class="test.isActive ? 'bg-blue-600' : 'bg-gray-200'"
              :title="test.isActive ? '비활성화' : '활성화'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                :class="test.isActive ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
            <!-- 삭제 -->
            <button
              @click="deleteTest(test)"
              :disabled="deletingId === test.id"
              class="text-red-500 hover:text-red-700 text-sm disabled:opacity-40 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>

        <!-- Variant 통계 테이블 -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th class="px-6 py-3 font-medium w-6">변형</th>
                <th class="px-4 py-3 font-medium">헤드라인</th>
                <th class="px-4 py-3 font-medium">CTA</th>
                <th class="px-4 py-3 font-medium text-right">노출(Views)</th>
                <th class="px-4 py-3 font-medium text-right">클릭(Clicks)</th>
                <th class="px-4 py-3 font-medium text-right">CTR</th>
                <th class="px-4 py-3 font-medium text-right">가입(Signups)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="v in test.variants"
                :key="v.id"
                class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                :class="{ 'bg-blue-50/40': isBestCtr(test, v) }"
              >
                <td class="px-6 py-4">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-bold text-xs uppercase">
                    {{ v.id }}
                  </span>
                </td>
                <td class="px-4 py-4 max-w-xs">
                  <div class="font-medium text-gray-800 truncate">{{ v.headline }}</div>
                  <div class="text-xs text-gray-400 truncate mt-0.5">{{ v.subtext }}</div>
                  <span
                    v-if="v.badge"
                    class="mt-1 inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                  >
                    {{ v.badge }}
                  </span>
                </td>
                <td class="px-4 py-4 text-gray-600">{{ v.cta }}</td>
                <td class="px-4 py-4 text-right text-gray-700 tabular-nums">{{ v.views.toLocaleString() }}</td>
                <td class="px-4 py-4 text-right text-gray-700 tabular-nums">{{ v.clicks.toLocaleString() }}</td>
                <td class="px-4 py-4 text-right tabular-nums">
                  <span
                    class="font-semibold"
                    :class="isBestCtr(test, v) ? 'text-blue-600' : 'text-gray-700'"
                  >
                    {{ v.ctr }}%
                  </span>
                  <span v-if="isBestCtr(test, v) && test.variants.length > 1" class="ml-1 text-xs text-blue-400">best</span>
                </td>
                <td class="px-4 py-4 text-right text-gray-700 tabular-nums">{{ v.signups.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="tests.length === 0" class="text-center py-16 text-gray-400">
        <p>A/B 테스트가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface VariantStat {
  id: string
  headline: string
  subtext: string
  cta: string
  badge: string
  weight: number
  views: number
  clicks: number
  signups: number
  ctr: number
}

interface AbTestWithStats {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  variants: VariantStat[]
  totalImpressions: number
}

definePageMeta({ layout: 'default' })
useHead({ title: 'A/B 테스트 관리 | Pactery Admin' })

const { isLoggedIn, authFetch, waitForAuth } = useAuth()

// 인증 체크
await waitForAuth()
if (!isLoggedIn.value) {
  navigateTo('/auth/login')
}

const togglingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)

const { data, pending, error, refresh } = await useLazyFetch<AbTestWithStats[]>('/api/admin/ab', {
  headers: computed(() => ({
    Authorization: `Bearer ${useAuth().state.value.token}`,
  })),
})

const tests = computed(() => data.value ?? [])

/**
 * CTR이 가장 높은 variant 여부 (노출 0인 variant는 제외)
 */
function isBestCtr(test: AbTestWithStats, variant: VariantStat): boolean {
  const validVariants = test.variants.filter((v) => v.views > 0)
  if (validVariants.length < 2) return false
  const maxCtr = Math.max(...validVariants.map((v) => v.ctr))
  return maxCtr > 0 && variant.ctr === maxCtr
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function toggleActive(test: AbTestWithStats) {
  if (togglingId.value) return
  togglingId.value = test.id
  try {
    await authFetch(`/api/admin/ab/${test.id}`, {
      method: 'PATCH',
      body: { isActive: !test.isActive },
    })
    await refresh()
  } catch (e) {
    console.error('toggle error:', e)
    useToast().error('변경에 실패했습니다.')
  } finally {
    togglingId.value = null
  }
}

async function deleteTest(test: AbTestWithStats) {
  if (!confirm(`"${test.name}" 테스트를 삭제하면 모든 impression 데이터도 함께 삭제됩니다. 계속하시겠습니까?`)) return
  if (deletingId.value) return
  deletingId.value = test.id
  try {
    await authFetch(`/api/admin/ab/${test.id}`, { method: 'DELETE' })
    await refresh()
  } catch (e) {
    console.error('delete error:', e)
    useToast().error('삭제에 실패했습니다.')
  } finally {
    deletingId.value = null
  }
}
</script>
