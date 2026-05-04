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
          <!-- Signers Panel -->
          <SignerPanel
            :signers="doc.signRequests"
            :doc-status="doc.status"
            :doc-id="doc.id"
            @add="handleAddSigner"
            @remove="handleRemoveSigner"
            @update="handleUpdateSigner"
            @reorder="handleReorderSigner"
            @send="handleSendAll"
            @send-request="handleSendRequest"
            @send-reminder="handleSendReminder"
            @copy-link="handleCopyLink"
          />

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
          <AuditTimeline
            :logs="auditLogsWithSignerName"
            :signers="doc.signRequests"
          />

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
const { fetchDocument, fetchPdfBuffer, duplicateDocument, addSigner, removeSigner, sendDocument, orgFetch } = useOrganization()
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

// Audit logs with signer name mapping
const auditLogsWithSignerName = computed(() => {
  if (!doc.value?.auditLogs) return []
  const signerMap = new Map(
    (doc.value.signRequests || []).map((sr: any) => [sr.id, sr.signerName])
  )
  return doc.value.auditLogs.map((log: any) => ({
    ...log,
    signerName: log.signRequestId ? signerMap.get(log.signRequestId) : null,
  }))
})

// Signer management handlers
async function handleAddSigner(data: { signerName: string; signerEmail: string; signerPhone?: string }) {
  try {
    await addSigner(docId, data)
    doc.value = await fetchDocument(docId)
    toast.success('서명자가 추가되었습니다')
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '서명자 추가 실패')
  }
}

async function handleRemoveSigner(signRequestId: string) {
  try {
    await removeSigner(docId, signRequestId)
    doc.value = await fetchDocument(docId)
    toast.success('서명자가 삭제되었습니다')
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '서명자 삭제 실패')
  }
}

async function handleUpdateSigner(signRequestId: string, data: { signerName: string; signerEmail: string; signerPhone?: string }) {
  try {
    await orgFetch(`/documents/${docId}/signers/${signRequestId}`, { method: 'PATCH', body: data })
    doc.value = await fetchDocument(docId)
    toast.success('서명자 정보가 수정되었습니다')
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '서명자 수정 실패')
  }
}

async function handleReorderSigner(signRequestId: string, newIndex: number) {
  try {
    await orgFetch(`/documents/${docId}/signers/${signRequestId}/reorder`, { method: 'PATCH', body: { orderIndex: newIndex } })
    doc.value = await fetchDocument(docId)
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '순서 변경 실패')
  }
}

async function handleSendAll() {
  try {
    await sendDocument(docId)
    doc.value = await fetchDocument(docId)
    toast.success('서명요청이 발송되었습니다')
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '서명요청 발송 실패')
  }
}

async function handleSendRequest(signRequestId: string) {
  try {
    await orgFetch(`/documents/${docId}/signers/${signRequestId}/send`, { method: 'POST' })
    toast.success('서명요청이 발송되었습니다')
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '발송 실패')
  }
}

async function handleSendReminder(signRequestId: string) {
  try {
    await orgFetch(`/documents/${docId}/signers/${signRequestId}/remind`, { method: 'POST' })
    toast.success('리마인더가 발송되었습니다')
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '리마인더 발송 실패')
  }
}

async function handleCopyLink(token: string) {
  const url = `${window.location.origin}/sign/${token}`
  try {
    await navigator.clipboard.writeText(url)
    toast.success('서명 링크가 복사되었습니다')
  } catch {
    toast.error('복사 실패')
  }
}

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

function statusLabel(s: string) {
  return { draft: '초안', pending: '서명 대기', partially_signed: '부분 서명', completed: '완료', rejected: '거절', expired: '만료' }[s] || s
}
function statusClass(s: string) {
  return { draft: 'bg-gray-100 text-gray-700', pending: 'bg-yellow-100 text-yellow-800', partially_signed: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', expired: 'bg-gray-100 text-gray-500' }[s] || 'bg-gray-100'
}
</script>
