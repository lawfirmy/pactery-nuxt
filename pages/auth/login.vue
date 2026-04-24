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
          class="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <span class="text-sm font-medium text-gray-700">Google로 로그인</span>
        </button>
        <button
          @click="loginWithKakao"
          class="w-full flex items-center justify-center gap-2 py-2 bg-yellow-300 rounded-lg hover:bg-yellow-400 transition"
        >
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
  // TODO: Google OAuth flow
}

function loginWithKakao() {
  // TODO: Kakao OAuth flow
}
</script>
