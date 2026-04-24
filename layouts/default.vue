<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-8">
            <NuxtLink to="/" class="text-xl font-bold text-blue-600">Pactery</NuxtLink>
            <template v-if="isLoggedIn">
              <NuxtLink to="/org" class="text-sm text-gray-600 hover:text-gray-900">문서함</NuxtLink>
              <NuxtLink to="/org/cases" class="text-sm text-gray-600 hover:text-gray-900">사건관리</NuxtLink>
              <NuxtLink to="/org/clients" class="text-sm text-gray-600 hover:text-gray-900">의뢰인</NuxtLink>
              <NuxtLink to="/org/templates" class="text-sm text-gray-600 hover:text-gray-900">템플릿</NuxtLink>
            </template>
          </div>
          <div class="flex items-center gap-4">
            <template v-if="isLoggedIn">
              <div v-if="currentOrg" class="text-sm text-gray-500">
                {{ currentOrg.name }}
              </div>
              <NuxtLink to="/my" class="text-sm text-gray-600 hover:text-gray-900">내 서명</NuxtLink>
              <button @click="logout" class="text-sm text-gray-500 hover:text-gray-700">로그아웃</button>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login" class="text-sm text-gray-600 hover:text-gray-900">로그인</NuxtLink>
              <NuxtLink to="/auth/register" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                시작하기
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn, currentOrg, logout, initAuth } = useAuth()

onMounted(() => {
  initAuth()
})
</script>
