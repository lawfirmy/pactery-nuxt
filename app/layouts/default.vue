<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-8">
            <NuxtLink to="/" class="text-xl font-bold text-brand-900 shrink-0 tracking-tight">Pactery</NuxtLink>
            <div class="hidden md:flex items-center gap-1">
              <template v-if="isLoggedIn">
                <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
                  class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  :class="isActive(item.to) ? 'text-brand-900 bg-brand-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
                >
                  {{ item.label }}
                </NuxtLink>
              </template>
              <NuxtLink to="/blog"
                class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="isActive('/blog') ? 'text-brand-900 bg-brand-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
              >
                블로그
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <template v-if="isLoggedIn">
              <div class="hidden md:flex items-center gap-2">
                <NuxtLink to="/my" class="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  내 서명
                </NuxtLink>
                <!-- User dropdown -->
                <div class="relative">
                  <button
                    @click="userMenuOpen = !userMenuOpen"
                    class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div class="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                      {{ userName.charAt(0) }}
                    </div>
                    <span class="max-w-[120px] truncate">{{ userName }}</span>
                    <svg class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': userMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95"
                  >
                    <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black/5 py-1 z-50">
                      <div class="px-4 py-3 border-b border-gray-100">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
                        <p v-if="currentOrg" class="text-xs text-gray-400 mt-1 truncate">{{ currentOrg.name }}</p>
                      </div>
                      <NuxtLink to="/my" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="userMenuOpen = false">내 서명</NuxtLink>
                      <NuxtLink to="/org/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="userMenuOpen = false">설정</NuxtLink>
                      <NuxtLink v-if="isAdmin" to="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="userMenuOpen = false">관리자</NuxtLink>
                      <div class="border-t border-gray-100 mt-1"></div>
                      <button @click="handleUserMenuLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">로그아웃</button>
                    </div>
                  </Transition>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="hidden md:flex items-center gap-2">
                <NuxtLink to="/auth/login" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium rounded-lg transition">로그인</NuxtLink>
                <NuxtLink to="/auth/register" class="px-4 py-2 bg-brand-800 text-white text-sm font-medium rounded-xl hover:bg-brand-900 transition shadow-sm">
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
                :class="isActive(item.to) ? 'text-brand-900 bg-brand-50 font-medium' : 'text-gray-700 hover:bg-gray-50'"
                @click="mobileMenu = false"
              >
                {{ item.label }}
              </NuxtLink>
              <div class="border-t border-gray-100 my-2"></div>
            </template>
            <NuxtLink to="/blog" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">블로그</NuxtLink>
            <template v-if="isLoggedIn">
              <div class="border-t border-gray-100 my-2"></div>
              <div class="px-3 py-2 mb-1">
                <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
              </div>
              <NuxtLink to="/my" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">내 서명</NuxtLink>
              <NuxtLink to="/org/settings" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">설정</NuxtLink>
              <NuxtLink v-if="isAdmin" to="/admin" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" @click="mobileMenu = false">관리자</NuxtLink>
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
const { isLoggedIn, currentOrg, logout, initAuth, state: authState } = useAuth()
const mobileMenu = ref(false)
const userMenuOpen = ref(false)

const userName = computed(() => authState.value.user?.name || authState.value.user?.email || '')
const userEmail = computed(() => authState.value.user?.email || '')
const isAdmin = computed(() => {
  const adminEmails = ['sangemi@daum.net', 'ksaksk2112@gmail.com']
  return adminEmails.includes(userEmail.value)
})

function handleUserMenuLogout() {
  userMenuOpen.value = false
  logout()
}

const route = useRoute()
watch(() => route.path, () => { mobileMenu.value = false; userMenuOpen.value = false })

// Close user menu on click outside
if (import.meta.client) {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (userMenuOpen.value && !target.closest('.relative')) {
      userMenuOpen.value = false
    }
  }
  onMounted(() => document.addEventListener('click', handleClickOutside))
  onUnmounted(() => document.removeEventListener('click', handleClickOutside))
}

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
