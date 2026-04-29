<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <div v-if="loading" class="text-center py-20 text-gray-400">불러오는 중...</div>

    <template v-else-if="doc">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <NuxtLink to="/org/documents" class="text-sm text-blue-600 hover:underline mb-2 inline-block">&larr; 문서함</NuxtLink>
          <h1 class="text-2xl font-bold">{{ doc.title }}</h1>
          <div class="flex items-center gap-3 mt-2">
            <span :class="statusClass(doc.status)" class="text-xs px-2 py-1 rounded-full">{{ statusLabel(doc.status) }}</span>
            <span class="text-sm text-gray-500">{{ doc.creator?.name }}</span>
            <span class="text-sm text-gray-400">{{ formatDate(doc.createdAt) }}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            v-if="doc.status === 'draft'"
            :to="`/org/documents/${doc.id}/edit`"
            class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            편집
          </NuxtLink>
          <a v-if="doc.originalFileKey" :href="`/api/documents/${doc.id}/download`" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            PDF 다운로드
          </a>
          <button
            @click="handleDuplicate"
            class="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50"
          >
            복제
          </button>
          <a :href="`/api/documents/${doc.id}/audit-trail`" class="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50">
            감사추적인증서
          </a>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- PDF Viewer -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <ClientOnly>
              <PdfViewer :src="pdfData" height="min(600px, 60vh)">
                <template #overlay="{ page, scale }">
                  <FieldOverlay
                    :fields="doc.signFields"
                    :page="page"
                    :scale="scale"
                  />
                </template>
              </PdfViewer>
              <template #fallback>
                <div class="h-96 flex items-center justify-center bg-gray-100">
                  <p class="text-gray-400">PDF 뷰어 로딩 중...</p>
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
          <!-- Signers -->
          <div class="bg-white rounded-xl shadow-sm p-5">
            <h2 class="font-semibold mb-3">서명자</h2>
            <div class="space-y-3">
              <div v-for="sr in doc.signRequests" :key="sr.id" class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium">{{ sr.signerName }}</p>
                  <p class="text-xs text-gray-400">{{ sr.signerEmail }}</p>
                </div>
                <span :class="signerStatusClass(sr.status)" class="text-xs px-2 py-1 rounded-full">
                  {{ signerStatusLabel(sr.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Document info -->
          <div class="bg-white rounded-xl shadow-sm p-5">
            <h2 class="font-semibold mb-3">문서 정보</h2>
            <dl class="space-y-2 text-sm">
              <div v-if="doc.case" class="flex justify-between">
                <dt class="text-gray-500">사건</dt>
                <dd>{{ doc.case.caseNumber || doc.case.title }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">생성일</dt>
                <dd>{{ formatDate(doc.createdAt) }}</dd>
              </div>
              <div v-if="doc.completedAt" class="flex justify-between">
                <dt class="text-gray-500">완료일</dt>
                <dd>{{ formatDate(doc.completedAt) }}</dd>
              </div>
              <div v-if="doc.originalHash" class="flex flex-col gap-1">
                <dt class="text-gray-500">원본 해시 (SHA-256)</dt>
                <dd class="text-xs font-mono text-gray-400 break-all">{{ doc.originalHash }}</dd>
              </div>
              <div v-if="doc.signedHash" class="flex flex-col gap-1">
                <dt class="text-gray-500">서명본 해시</dt>
                <dd class="text-xs font-mono text-gray-400 break-all">{{ doc.signedHash }}</dd>
              </div>
            </dl>
          </div>

          <!-- Tags -->
          <div v-if="doc.tags?.length" class="bg-white rounded-xl shadow-sm p-5">
            <h2 class="font-semibold mb-3">태그</h2>
            <div class="flex flex-wrap gap-1">
              <span v-for="t in doc.tags" :key="t.tag" class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {{ t.tag }}
              </span>
            </div>
          </div>

          <!-- Audit Trail Timeline -->
          <div class="bg-white rounded-xl shadow-sm p-5">
            <h2 class="font-semibold mb-3">감사추적</h2>
            <div class="space-y-3">
              <div v-for="log in doc.auditLogs" :key="log.id" class="flex gap-3">
                <div class="flex flex-col items-center">
                  <div :class="auditDotClass(log.eventType)" class="w-2.5 h-2.5 rounded-full mt-1.5"></div>
                  <div class="w-px flex-1 bg-gray-200"></div>
                </div>
                <div class="pb-3">
                  <p class="text-sm font-medium">{{ auditLabel(log.eventType) }}</p>
                  <p class="text-xs text-gray-400">
                    {{ formatDateTime(log.createdAt) }}
                    <span v-if="log.ipAddress"> | {{ log.ipAddress }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Memo -->
          <div v-if="doc.memo" class="bg-white rounded-xl shadow-sm p-5">
            <h2 class="font-semibold mb-2">메모</h2>
            <p class="text-sm text-gray-600">{{ doc.memo }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '문서 상세 - Pactery' })

const route = useRoute()
const docId = route.params.id as string
const { fetchDocument, fetchPdfBuffer, duplicateDocument } = useOrganization()
const toast = useToast()

const loading = ref(true)
const doc = ref<any>(null)
const pdfData = ref<ArrayBuffer | null>(null)

onMounted(async () => {
  try {
    doc.value = await fetchDocument(docId)
    useHead({ title: `${doc.value.title} - Pactery` })
    if (doc.value.originalFileKey) {
      pdfData.value = await fetchPdfBuffer(docId)
    }
  } catch (e) {
    console.error('Failed to load document:', e)
  } finally {
    loading.value = false
  }
})

async function handleDuplicate() {
  try {
    const duplicated = await duplicateDocument(docId)
    toast.success('문서가 복제되었습니다')
    navigateTo(`/org/documents/${duplicated.id}/edit`)
  } catch (e: any) {
    console.error('Failed to duplicate document:', e)
    toast.error(e.data?.statusMessage || '문서 복제 실패')
  }
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('ko-KR') }
function formatDateTime(d: string) { return new Date(d).toLocaleString('ko-KR') }

function statusLabel(s: string) {
  return { draft: '초안', pending: '서명 대기', partially_signed: '부분 서명', completed: '완료', rejected: '거절', expired: '만료' }[s] || s
}
function statusClass(s: string) {
  return { draft: 'bg-gray-100 text-gray-700', pending: 'bg-yellow-100 text-yellow-800', partially_signed: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', expired: 'bg-gray-100 text-gray-500' }[s] || 'bg-gray-100'
}
function signerStatusLabel(s: string) {
  return { pending: '대기', signed: '완료', rejected: '거절' }[s] || s
}
function signerStatusClass(s: string) {
  return { pending: 'bg-yellow-100 text-yellow-800', signed: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' }[s] || 'bg-gray-100'
}
function auditLabel(t: string) {
  return { created: '문서 생성', sent: '서명 요청 발송', opened: '문서 열람', signed: '서명 완료', rejected: '서명 거절', downloaded: '다운로드', printed: '인쇄' }[t] || t
}
function auditDotClass(t: string) {
  return { created: 'bg-gray-400', sent: 'bg-blue-400', opened: 'bg-yellow-400', signed: 'bg-green-400', rejected: 'bg-red-400', downloaded: 'bg-purple-400' }[t] || 'bg-gray-400'
}
</script>
