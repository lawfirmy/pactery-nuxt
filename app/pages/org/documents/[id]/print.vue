<template>
  <div class="print-layout">
    <div v-if="loading" class="text-center py-20 text-gray-400">불러오는 중...</div>

    <template v-else-if="doc">
      <!-- Print header (visible only on print) -->
      <div class="print-header mb-8">
        <h1 class="text-2xl font-bold">{{ doc.title }}</h1>
        <div class="flex justify-between text-sm text-gray-500 mt-2 border-b pb-4">
          <span>{{ doc.creator?.name }} | {{ formatDate(doc.createdAt) }}</span>
          <span v-if="doc.completedAt">완료: {{ formatDate(doc.completedAt) }}</span>
        </div>
      </div>

      <!-- Signers summary -->
      <div class="mb-6 border rounded-lg p-4">
        <h2 class="font-semibold text-sm mb-2">서명자 정보</h2>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="text-left py-1">이름</th>
              <th class="text-left py-1">이메일</th>
              <th class="text-left py-1">상태</th>
              <th class="text-left py-1">서명일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sr in doc.signRequests" :key="sr.id" class="border-b last:border-0">
              <td class="py-1">{{ sr.signerName }}</td>
              <td class="py-1 text-gray-500">{{ sr.signerEmail }}</td>
              <td class="py-1">{{ signerStatus(sr.status) }}</td>
              <td class="py-1 text-gray-500">{{ sr.signedAt ? formatDate(sr.signedAt) : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Hash info -->
      <div class="mb-6 border rounded-lg p-4 text-xs">
        <h2 class="font-semibold text-sm mb-2">무결성 검증 정보</h2>
        <p v-if="doc.originalHash"><span class="text-gray-500">원본 SHA-256:</span> {{ doc.originalHash }}</p>
        <p v-if="doc.signedHash"><span class="text-gray-500">서명본 SHA-256:</span> {{ doc.signedHash }}</p>
      </div>

      <!-- Audit trail -->
      <div class="mb-6 border rounded-lg p-4">
        <h2 class="font-semibold text-sm mb-2">감사추적</h2>
        <table class="w-full text-xs">
          <thead>
            <tr class="border-b">
              <th class="text-left py-1">시각</th>
              <th class="text-left py-1">이벤트</th>
              <th class="text-left py-1">IP</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in doc.auditLogs" :key="log.id" class="border-b last:border-0">
              <td class="py-1">{{ formatDateTime(log.createdAt) }}</td>
              <td class="py-1">{{ auditLabel(log.eventType) }}</td>
              <td class="py-1 text-gray-400">{{ log.ipAddress || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Print button (hidden on print) -->
      <div class="no-print flex gap-3 mt-8">
        <button @click="printPage" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          인쇄
        </button>
        <NuxtLink :to="`/org/documents/${doc.id}`" class="px-6 py-2 border rounded-lg hover:bg-gray-50">
          돌아가기
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: '인쇄 - Pactery' })

const route = useRoute()
const docId = route.params.id as string
const { fetchDocument } = useOrganization()

const loading = ref(true)
const doc = ref<any>(null)

onMounted(async () => {
  try {
    doc.value = await fetchDocument(docId)
  } catch (e) {
    console.error('Failed to load document:', e)
  } finally {
    loading.value = false
  }
})

function printPage() { window.print() }
function formatDate(d: string) { return new Date(d).toLocaleDateString('ko-KR') }
function formatDateTime(d: string) { return new Date(d).toLocaleString('ko-KR') }
function signerStatus(s: string) { return { pending: '대기', signed: '완료', rejected: '거절' }[s] || s }
function auditLabel(t: string) { return { created: '문서 생성', sent: '서명 요청', opened: '열람', signed: '서명 완료', rejected: '거절', downloaded: '다운로드' }[t] || t }
</script>

<style>
@media print {
  .no-print { display: none !important; }
  nav { display: none !important; }
  .print-layout { padding: 0; margin: 0; }
}
</style>
