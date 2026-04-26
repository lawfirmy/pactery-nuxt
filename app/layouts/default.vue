<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-14">
          <div class="flex items-center gap-6">
            <NuxtLink to="/" class="text-xl font-bold text-blue-600 shrink-0">Pactery</NuxtLink>
            <div class="hidden md:flex items-center gap-5">
              <template v-if="isLoggedIn">
                <NuxtLink to="/org" class="text-sm text-gray-600 hover:text-gray-900">대시보드</NuxtLink>
                <NuxtLink to="/org/documents" class="text-sm text-gray-600 hover:text-gray-900">문서함</NuxtLink>
                <NuxtLink to="/org/cases" class="text-sm text-gray-600 hover:text-gray-900">사건관리</NuxtLink>
                <NuxtLink to="/org/clients" class="text-sm text-gray-600 hover:text-gray-900">의뢰인</NuxtLink>
                <NuxtLink to="/org/templates" class="text-sm text-gray-600 hover:text-gray-900">템플릿</NuxtLink>
              </template>
              <NuxtLink to="/blog" class="text-sm text-gray-600 hover:text-gray-900">블로그</NuxtLink>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <template v-if="isLoggedIn">
              <div class="hidden md:flex items-center gap-3">
                <div v-if="currentOrg" class="text-sm text-gray-500 max-w-[120px] truncate">
                  {{ currentOrg.name }}
                </div>
                <NuxtLink to="/org/settings" class="text-sm text-gray-600 hover:text-gray-900">설정</NuxtLink>
                <NuxtLink to="/my" class="text-sm text-gray-600 hover:text-gray-900">내 서명</NuxtLink>
                <NuxtLink to="/admin" class="text-sm text-gray-600 hover:text-gray-900">Admin</NuxtLink>
                <button @click="logout" class="text-sm text-gray-500 hover:text-gray-700">로그아웃</button>
              </div>
            </template>
            <template v-else>
              <div class="hidden md:flex items-center gap-3">
                <NuxtLink to="/auth/login" class="text-sm text-gray-600 hover:text-gray-900">로그인</NuxtLink>
                <NuxtLink to="/auth/register" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  시작하기
                </NuxtLink>
              </div>
            </template>
            <!-- Mobile hamburger (항상 표시) -->
            <button @click="mobileMenu = !mobileMenu" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenu" class="md:hidden border-t bg-white">
        <div class="px-4 py-3 space-y-1">
          <template v-if="isLoggedIn">
            <NuxtLink to="/org" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">대시보드</NuxtLink>
            <NuxtLink to="/org/documents" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">문서함</NuxtLink>
            <NuxtLink to="/org/cases" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">사건관리</NuxtLink>
            <NuxtLink to="/org/clients" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">의뢰인</NuxtLink>
            <NuxtLink to="/org/templates" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">템플릿</NuxtLink>
            <div class="border-t my-2"></div>
          </template>
          <NuxtLink to="/blog" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">블로그</NuxtLink>
          <template v-if="isLoggedIn">
            <div class="border-t my-2"></div>
            <NuxtLink to="/org/settings" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">설정</NuxtLink>
            <NuxtLink to="/my" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">내 서명</NuxtLink>
            <NuxtLink to="/admin" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">Admin</NuxtLink>
            <button @click="logout(); mobileMenu = false" class="block w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">로그아웃</button>
          </template>
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
const mobileMenu = ref(false)

const route = useRoute()
watch(() => route.path, () => { mobileMenu.value = false })

onMounted(async () => {
  await initAuth()
})
</script>
