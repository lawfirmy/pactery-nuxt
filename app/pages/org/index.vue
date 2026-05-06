<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold">대시보드</h1>
      <NuxtLink
        to="/org/documents?action=new"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
      >
        + 새 문서
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <NuxtLink to="/org/documents" class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
        <p class="text-sm text-gray-500">전체 문서</p>
        <p class="text-2xl font-bold mt-1">{{ stats?.totalDocuments ?? '-' }}</p>
      </NuxtLink>
      <NuxtLink to="/org/documents" class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
        <p class="text-sm text-gray-500">이번 달</p>
        <p class="text-2xl font-bold mt-1">{{ stats?.monthlyDocuments ?? '-' }}</p>
      </NuxtLink>
      <NuxtLink to="/org/documents?status=pending" class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
        <p class="text-sm text-gray-500">서명 대기</p>
        <p class="text-2xl font-bold mt-1 text-yellow-600">{{ stats?.statusBreakdown?.pending ?? 0 }}</p>
      </NuxtLink>
      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-sm text-gray-500">사용량</p>
        <p class="text-2xl font-bold mt-1">
          <span :class="quotaColor">{{ stats?.quota?.used ?? 0 }}</span>
          <span class="text-sm font-normal text-gray-400"> / {{ stats?.quota?.total ?? 5 }}</span>
        </p>
      </div>
    </div>

    <!-- Status Breakdown -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="font-semibold mb-4">문서 상태</h2>
        <div class="space-y-3">
          <NuxtLink
            v-for="(count, status) in stats?.statusBreakdown"
            :key="status"
            :to="`/org/documents?status=${status}`"
            class="flex items-center justify-between hover:bg-gray-50 rounded-lg px-2 py-1 -mx-2 transition-colors"
          >
            <div class="flex items-center gap-2">
              <span :class="dotColor(status as string)" class="w-2 h-2 rounded-full"></span>
              <span class="text-sm text-gray-600">{{ statusLabel(status as string) }}</span>
            </div>
            <span class="text-sm font-medium">{{ count }}건</span>
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="font-semibold mb-4">빠른 메뉴</h2>
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink to="/org/documents" class="p-3 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 text-center">
            문서함
          </NuxtLink>
          <NuxtLink to="/org/templates" class="p-3 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 text-center">
            템플릿
          </NuxtLink>
          <NuxtLink to="/org/cases" class="p-3 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 text-center">
            사건관리
          </NuxtLink>
          <NuxtLink to="/org/members" class="p-3 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 text-center">
            팀원관리
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '대시보드 - Pactery' })

const { fetchStats } = useOrganization()
const stats = ref<any>(null)

onMounted(async () => {
  try {
    stats.value = await fetchStats()
  } catch (e) {
    console.error('Failed to fetch stats:', e)
  }
})

const quotaColor = computed(() => {
  if (!stats.value?.quota) return ''
  const ratio = stats.value.quota.used / stats.value.quota.total
  if (ratio >= 0.9) return 'text-red-600'
  if (ratio >= 0.7) return 'text-yellow-600'
  return 'text-green-600'
})

function statusLabel(status: string) {
  const map: Record<string, string> = {
    draft: '초안',
    pending: '서명 대기',
    partially_signed: '부분 서명',
    completed: '완료',
    rejected: '거절',
    expired: '만료',
  }
  return map[status] || status
}

function dotColor(status: string) {
  const map: Record<string, string> = {
    draft: 'bg-gray-400',
    pending: 'bg-yellow-400',
    partially_signed: 'bg-blue-400',
    completed: 'bg-green-400',
    rejected: 'bg-red-400',
    expired: 'bg-gray-300',
  }
  return map[status] || 'bg-gray-400'
}
</script>
