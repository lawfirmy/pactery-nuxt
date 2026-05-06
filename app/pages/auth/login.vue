<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-6">로그인</h2>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="name@company.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
        <input
          v-model="form.password"
          type="password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="8자 이상"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {{ loading ? '로그인 중...' : '로그인' }}
      </button>
    </form>

    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>

      <div class="mt-6 space-y-3">
        <button
          @click="loginWithGoogle"
          class="w-full flex items-center justify-center gap-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span class="text-sm font-medium text-gray-700">Google로 로그인</span>
        </button>
        <button
          @click="loginWithKakao"
          class="w-full flex items-center justify-center gap-3 py-2 bg-[#FEE500] rounded-lg hover:brightness-95 transition"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M12 3C6.48 3 2 6.44 2 10.61c0 2.68 1.78 5.03 4.46 6.36-.15.54-.96 3.47-1 3.64 0 .05.02.1.06.13a.1.1 0 00.09.02c.19-.03 2.18-1.43 3.18-2.13.7.1 1.42.16 2.16.16h.05c5.52 0 10-3.44 10-7.58C22 6.44 17.52 3 12 3z" fill="#3C1E1E"/>
          </svg>
          <span class="text-sm font-medium text-gray-900">카카오 로그인</span>
        </button>
      </div>
    </div>

    <p class="mt-6 text-center text-sm text-gray-500">
      계정이 없으신가요?
      <NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-500 font-medium">회원가입</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: '로그인 - Pactery' })

const { setAuth } = useAuth()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const data = await $fetch<any>('/api/auth/login', {
      method: 'POST',
      body: form,
    })
    setAuth(data)
    router.push('/org')
  } catch (e: any) {
    error.value = e.data?.statusMessage || '로그인에 실패했습니다'
  } finally {
    loading.value = false
  }
}

function loginWithGoogle() {
  const config = useRuntimeConfig()
  const clientId = config.public.googleClientId
  if (!clientId) {
    error.value = 'Google 로그인이 설정되지 않았습니다'
    return
  }

  // Load Google Identity Services and trigger One Tap / popup
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.onload = () => {
    ;(window as any).google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: any) => {
        loading.value = true
        error.value = ''
        try {
          const data = await $fetch<any>('/api/auth/google', {
            method: 'POST',
            body: { credential: response.credential },
          })
          setAuth(data)
          router.push('/org')
        } catch (e: any) {
          error.value = e.data?.statusMessage || 'Google 로그인에 실패했습니다'
        } finally {
          loading.value = false
        }
      },
    })
    ;(window as any).google.accounts.id.prompt()
  }
  document.head.appendChild(script)
}

function loginWithKakao() {
  const config = useRuntimeConfig()
  const clientId = config.public.kakaoClientId
  if (!clientId) {
    error.value = '카카오 로그인이 설정되지 않았습니다'
    return
  }

  // Kakao OAuth authorization code flow via redirect
  const redirectUri = `${window.location.origin}/auth/kakao/callback`
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
  window.location.href = kakaoAuthUrl
}
</script>
