<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">내 서명 이력</h1>

    <!-- Verification form for non-logged-in users -->
    <div v-if="!isLoggedIn && !verified" class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <p class="text-gray-600 mb-4">서명 이력을 조회하려면 이메일을 인증해주세요.</p>
      <form @submit.prevent="verifyEmail" class="flex gap-3">
        <input
          v-model="email"
          type="email"
          required
          placeholder="서명 시 사용한 이메일"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          조회
        </button>
      </form>
    </div>

    <!-- Document list -->
    <div v-if="verified || isLoggedIn" class="space-y-3">
      <div v-if="loading" class="text-center py-12 text-gray-400">불러오는 중...</div>

      <div v-else-if="documents.length === 0" class="text-center py-12 text-gray-400">
        서명 이력이 없습니다.
      </div>

      <div
        v-for="doc in documents"
        :key="doc.signRequestId"
        class="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition cursor-pointer"
        @click="navigateTo(`/my/${doc.signRequestId}`)"
      >
        <div>
          <h3 class="font-medium">{{ doc.title }}</h3>
          <p class="text-sm text-gray-500 mt-1">
            {{ doc.organization }}
            <span class="mx-1">|</span>
            {{ formatDate(doc.createdAt) }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span :class="statusClass(doc.status)" class="text-xs px-2 py-1 rounded-full">
            {{ statusLabel(doc.status) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '내 서명 - Pactery' })

const { isLoggedIn, state } = useAuth()

const email = ref('')
const verified = ref(false)
const loading = ref(false)
const documents = ref<any[]>([])

onMounted(() => {
  if (isLoggedIn.value && state.value.user?.email) {
    email.value = state.value.user.email
    verified.value = true
    fetchDocuments()
  }
})

async function verifyEmail() {
  // TODO: Add proper email verification (send code, verify)
  verified.value = true
  await fetchDocuments()
}

async function fetchDocuments() {
  loading.value = true
  try {
    const data = await $fetch<any>('/api/my/documents', {
      params: { email: email.value },
    })
    documents.value = data.documents
  } catch (e) {
    console.error('Failed to fetch documents:', e)
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '서명 대기',
    signed: '서명 완료',
    rejected: '거절',
  }
  return map[status] || status
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    signed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}
</script>
