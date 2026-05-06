<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-8">
            <NuxtLink to="/" class="text-xl font-bold text-brand-600 shrink-0">Pactery</NuxtLink>
            <div class="hidden md:flex items-center gap-1">
              <template v-if="isLoggedIn">
                <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
                  class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  :class="isActive(item.to) ? 'text-brand-700 bg-brand-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
                >
                  {{ item.label }}
                </NuxtLink>
              </template>
              <NuxtLink to="/blog"
                class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="isActive('/blog') ? 'text-brand-700 bg-brand-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
              >
                블로그
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <template v-if="isLoggedIn">
              <div class="hidden md:flex items-center gap-2">
                <div v-if="currentOrg" class="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg max-w-[140px] truncate">
                  {{ currentOrg.name }}
                </div>
                <NuxtLink to="/my" class="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  내 서명
                </NuxtLink>
                <NuxtLink to="/org/settings" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="설정">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </NuxtLink>
                <button @click="logout" class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">로그아웃</button>
              </div>
            </template>
            <template v-else>
              <div class="hidden md:flex items-center gap-2">
                <NuxtLink to="/auth/login" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium rounded-lg transition">로그인</NuxtLink>
                <NuxtLink to="/auth/register" class="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition shadow-sm">
                  시작하기
                </NuxtLink>
              </div>
            </template>
            <button @click="mobileMenu = !mobileMenu" class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="mobileMenu" class="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
          <div class="px-4 py-3 space-y-0.5">
            <template v-if="isLoggedIn">
              <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
                class="block px-3 py-2.5 text-sm rounded-lg transition-colors"
                :class="isActive(item.to) ? 'text-brand-700 bg-brand-50 font-medium' : 'text-gray-700 hover:bg-gray-50'"
                @click="mobileMenu = false"
              >
                {{ item.label }}
              </NuxtLink>
              <div class="border-t border-gray-100 my-2"></div>
            </template>
            <NuxtLink to="/blog" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">블로그</NuxtLink>
            <template v-if="isLoggedIn">
              <div class="border-t border-gray-100 my-2"></div>
              <NuxtLink to="/org/settings" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">설정</NuxtLink>
              <NuxtLink to="/my" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">내 서명</NuxtLink>
              <NuxtLink to="/admin" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">Admin</NuxtLink>
              <button @click="logout(); mobileMenu = false" class="block w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">로그아웃</button>
            </template>
          </div>
        </div>
      </Transition>
    </nav>

    <main>
      <slot />
    </main>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn, currentOrg, logout, initAuth } = useAuth()
const mobileMenu = ref(false)

const route = useRoute()
watch(() => route.path, () => { mobileMenu.value = false })

const navItems = [
  { to: '/org', label: '대시보드' },
  { to: '/org/documents', label: '문서함' },
  { to: '/org/cases', label: '사건관리' },
  { to: '/org/clients', label: '의뢰인' },
  { to: '/org/templates', label: '템플릿' },
]

function isActive(path: string) {
  if (path === '/org') return route.path === '/org'
  return route.path.startsWith(path)
}

onMounted(async () => {
  await initAuth()
})
</script>
