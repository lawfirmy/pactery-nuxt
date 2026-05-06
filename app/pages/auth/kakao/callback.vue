<template>
  <div class="text-center py-20">
    <div v-if="error" class="space-y-4">
      <p class="text-red-600">{{ error }}</p>
      <NuxtLink to="/auth/login" class="text-blue-600 hover:underline text-sm">로그인 페이지로 돌아가기</NuxtLink>
    </div>
    <p v-else class="text-gray-400">카카오 로그인 처리 중...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const route = useRoute()
const router = useRouter()
const { setAuth } = useAuth()
const error = ref('')

onMounted(async () => {
  const code = route.query.code as string
  if (!code) {
    error.value = '인증 코드가 없습니다'
    return
  }

  try {
    const data = await $fetch<any>('/api/auth/kakao-callback', {
      method: 'POST',
      body: {
        code,
        redirectUri: `${window.location.origin}/auth/kakao/callback`,
      },
    })
    setAuth(data)
    router.push('/org')
  } catch (e: any) {
    error.value = e.data?.statusMessage || '카카오 로그인에 실패했습니다'
  }
})
</script>
