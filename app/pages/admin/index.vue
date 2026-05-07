<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">관리자</h1>
      <p class="mt-1 text-sm text-gray-500">Pactery 서비스 관리 페이지</p>
    </div>

    <div v-if="!isAdmin" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <p class="text-red-600 font-medium">접근 권한이 없습니다</p>
      <p class="text-sm text-gray-500 mt-2">관리자 계정으로 로그인해주세요.</p>
      <NuxtLink to="/" class="inline-block mt-4 text-sm text-brand-700 hover:underline">홈으로 돌아가기</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-brand-200 transition-all group"
      >
        <div class="text-2xl mb-3">{{ item.icon }}</div>
        <h3 class="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">{{ item.label }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ item.desc }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: '관리자 | Pactery' })

const { isLoggedIn, waitForAuth, state: authState } = useAuth()

await waitForAuth()
if (!isLoggedIn.value) {
  navigateTo('/auth/login')
}

const ADMIN_EMAILS = ['sangemi@daum.net', 'ksaksk2112@gmail.com']
const isAdmin = computed(() => ADMIN_EMAILS.includes(authState.value.user?.email || ''))

const menuItems = [
  { to: '/admin/emails', icon: '\u2709\uFE0F', label: '홍보 이메일', desc: '홍보 이메일 캠페인 작성 및 발송' },
  { to: '/admin/ab-tests', icon: '\uD83E\uDDEA', label: 'A/B 테스트', desc: '랜딩 페이지 변형 관리 및 전환율 분석' },
]
</script>
