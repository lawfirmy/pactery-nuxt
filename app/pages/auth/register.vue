<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-1">회원가입</h2>
    <p class="text-sm text-gray-500 mb-8">30초 만에 무료로 시작하세요.</p>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
          placeholder="홍길동"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
          placeholder="name@company.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
        <input
          v-model="form.password"
          type="password"
          required
          minlength="8"
          class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
          placeholder="8자 이상"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">휴대폰 <span class="text-gray-400 font-normal">(선택)</span></label>
        <input
          v-model="form.phone"
          type="tel"
          class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
          placeholder="010-1234-5678"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 transition font-medium text-sm"
      >
        {{ loading ? '가입 중...' : '무료로 시작하기' }}
      </button>
    </form>

    <p class="mt-6 text-center text-xs text-gray-400">
      가입 시 이용약관 및 개인정보처리방침에 동의합니다.
    </p>

    <p class="mt-4 text-center text-sm text-gray-500">
      이미 계정이 있으신가요?
      <NuxtLink to="/auth/login" class="text-brand-600 hover:text-brand-500 font-semibold">로그인</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: '회원가입 - Pactery' })

const { setAuth } = useAuth()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
})
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''

  try {
    const data = await $fetch<any>('/api/auth/register', {
      method: 'POST',
      body: {
        ...form,
        phone: form.phone || undefined,
      },
    })
    setAuth({
      token: data.token,
      user: data.user,
      organizations: [{ id: data.organization.id, name: data.organization.name, role: 'owner' }],
    })
    router.push('/org')
  } catch (e: any) {
    error.value = e.data?.statusMessage || '회원가입에 실패했습니다'
  } finally {
    loading.value = false
  }
}
</script>
