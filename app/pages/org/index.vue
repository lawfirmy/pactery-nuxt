<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">대시보드</h1>
        <p class="text-sm text-gray-500 mt-1">문서 현황을 한눈에 확인하세요.</p>
      </div>
      <NuxtLink
        to="/org/documents?action=new"
        class="px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 text-sm font-medium transition shadow-sm shadow-brand-600/20 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        새 문서
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <NuxtLink to="/org/documents" class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-colors">
            <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          </div>
        </div>
        <p class="text-sm text-gray-500">전체 문서</p>
        <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ stats?.totalDocuments ?? '-' }}</p>
      </NuxtLink>
      <NuxtLink to="/org/documents" class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          </div>
        </div>
        <p class="text-sm text-gray-500">이번 달</p>
        <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ stats?.monthlyDocuments ?? '-' }}</p>
      </NuxtLink>
      <NuxtLink to="/org/documents?status=pending" class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <p class="text-sm text-gray-500">서명 대기</p>
        <p class="text-2xl font-bold text-amber-600 mt-0.5">{{ stats?.statusBreakdown?.pending ?? 0 }}</p>
      </NuxtLink>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
          </div>
        </div>
        <p class="text-sm text-gray-500">사용량</p>
        <div class="mt-0.5">
          <p class="text-2xl font-bold">
            <span :class="quotaColor">{{ stats?.quota?.used ?? 0 }}</span>
            <span class="text-sm font-normal text-gray-400"> / {{ stats?.quota?.total ?? 5 }}</span>
          </p>
          <div class="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" :class="quotaBarColor" :style="{ width: `${Math.min(quotaPercent, 100)}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status & Quick Menu -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-semibold text-gray-900 mb-4">문서 상태</h2>
        <div class="space-y-2">
          <NuxtLink
            v-for="(count, status) in stats?.statusBreakdown"
            :key="status"
            :to="`/org/documents?status=${status}`"
            class="flex items-center justify-between hover:bg-gray-50 rounded-xl px-3 py-2.5 -mx-3 transition-colors group"
          >
            <div class="flex items-center gap-3">
              <span :class="dotColor(status as string)" class="w-2.5 h-2.5 rounded-full"></span>
              <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{{ statusLabel(status as string) }}</span>
            </div>
            <span class="text-sm font-semibold text-gray-900">{{ count }}건</span>
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-semibold text-gray-900 mb-4">빠른 메뉴</h2>
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink to="/org/documents" class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl text-sm hover:bg-brand-50 hover:text-brand-700 text-gray-600 transition-colors group">
            <svg class="w-6 h-6 text-gray-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
            문서함
          </NuxtLink>
          <NuxtLink to="/org/templates" class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl text-sm hover:bg-brand-50 hover:text-brand-700 text-gray-600 transition-colors group">
            <svg class="w-6 h-6 text-gray-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            템플릿
          </NuxtLink>
          <NuxtLink to="/org/cases" class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl text-sm hover:bg-brand-50 hover:text-brand-700 text-gray-600 transition-colors group">
            <svg class="w-6 h-6 text-gray-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            사건관리
          </NuxtLink>
          <NuxtLink to="/org/members" class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl text-sm hover:bg-brand-50 hover:text-brand-700 text-gray-600 transition-colors group">
            <svg class="w-6 h-6 text-gray-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
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

const quotaPercent = computed(() => {
  if (!stats.value?.quota) return 0
  return (stats.value.quota.used / stats.value.quota.total) * 100
})

const quotaColor = computed(() => {
  if (quotaPercent.value >= 90) return 'text-red-600'
  if (quotaPercent.value >= 70) return 'text-amber-600'
  return 'text-green-600'
})

const quotaBarColor = computed(() => {
  if (quotaPercent.value >= 90) return 'bg-red-500'
  if (quotaPercent.value >= 70) return 'bg-amber-500'
  return 'bg-green-500'
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
    pending: 'bg-amber-400',
    partially_signed: 'bg-blue-400',
    completed: 'bg-green-400',
    rejected: 'bg-red-400',
    expired: 'bg-gray-300',
  }
  return map[status] || 'bg-gray-400'
}
</script>
