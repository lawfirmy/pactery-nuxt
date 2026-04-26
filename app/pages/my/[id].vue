<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <NuxtLink to="/my" class="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; 내 서명 목록</NuxtLink>

    <div v-if="loading" class="text-center py-20 text-gray-400">불러오는 중...</div>

    <template v-else-if="signRequest">
      <div class="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h1 class="text-xl font-bold">{{ signRequest.document.title }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ signRequest.document.org.name }}</p>
        <div class="flex items-center gap-3 mt-3">
          <span :class="statusClass" class="text-xs px-2 py-1 rounded-full">{{ statusLabel }}</span>
          <span v-if="signRequest.signedAt" class="text-sm text-gray-400">
            서명일: {{ formatDate(signRequest.signedAt) }}
          </span>
        </div>
      </div>

      <!-- PDF Viewer -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        <ClientOnly>
          <PdfViewer :src="pdfUrl" height="500px" />
          <template #fallback>
            <div class="h-96 flex items-center justify-center bg-gray-100 text-gray-400">로딩 중...</div>
          </template>
        </ClientOnly>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <a
          :href="`/api/documents/${signRequest.document.id}/download`"
          class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          PDF 다운로드
        </a>
        <a
          :href="`/api/documents/${signRequest.document.id}/audit-trail`"
          class="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50"
        >
          감사추적인증서
        </a>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '서명 상세 - Pactery' })

const route = useRoute()
const id = route.params.id as string

const loading = ref(true)
const signRequest = ref<any>(null)

const pdfUrl = computed(() =>
  signRequest.value ? `/api/documents/${signRequest.value.document.id}/pdf` : null,
)

const statusLabel = computed(() =>
  ({ pending: '서명 대기', signed: '서명 완료', rejected: '거절' })[signRequest.value?.status] || '',
)

const statusClass = computed(() =>
  ({ pending: 'bg-yellow-100 text-yellow-800', signed: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' })[signRequest.value?.status] || 'bg-gray-100',
)

onMounted(async () => {
  try {
    signRequest.value = await $fetch<any>(`/api/my/documents/${id}`)
    useHead({ title: `${signRequest.value.document.title} - 내 서명` })
  } catch (e) {
    console.error('Failed to load sign request:', e)
  } finally {
    loading.value = false
  }
})

function formatDate(d: string) { return new Date(d).toLocaleDateString('ko-KR') }
</script>
