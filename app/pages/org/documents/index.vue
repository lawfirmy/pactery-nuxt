<template>
  <div class="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-5">
      <h1 class="text-xl sm:text-2xl font-bold">문서함</h1>
      <button
        @click="showNewDoc = true"
        class="px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 text-sm font-medium shadow-sm shadow-brand-600/20 flex items-center gap-2"
      >
        + 새 문서
      </button>
    </div>

    <!-- Search & Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 mb-5">
      <div class="flex flex-wrap gap-2 sm:gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="제목, 서명자 검색..."
          class="flex-1 min-w-[150px] px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 text-sm"
          @keyup.enter="handleSearch"
        />
        <select v-model="statusFilter" class="px-3 py-2.5 border border-gray-300 rounded-lg text-sm">
          <option value="">전체</option>
          <option value="draft">초안</option>
          <option value="pending">서명 대기</option>
          <option value="completed">완료</option>
          <option value="rejected">거절</option>
          <option value="expired">만료</option>
        </select>
        <button @click="handleSearch" class="px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
          검색
        </button>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedIds.length > 0" class="bg-brand-50 rounded-xl p-3 mb-4 flex items-center justify-between">
      <span class="text-sm text-brand-800">{{ selectedIds.length }}건 선택</span>
      <div class="flex gap-2">
        <button
          @click="bulkDownload"
          :disabled="downloading"
          class="px-3 py-1.5 bg-brand-600 text-white rounded-xl text-sm hover:bg-brand-700 disabled:opacity-50"
        >
          {{ downloading ? '다운로드 중...' : '일괄 다운로드' }}
        </button>
        <button @click="selectedIds = []" class="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm">
          해제
        </button>
      </div>
    </div>

    <!-- Documents -->
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div v-if="loading" class="text-center py-12 text-gray-400">불러오는 중...</div>

      <div v-else-if="documents.length === 0" class="text-center py-12 text-gray-400">
        <p class="text-lg mb-2">문서가 없습니다</p>
        <p class="text-sm">첫 문서를 만들어보세요!</p>
      </div>

      <!-- Desktop Table -->
      <table v-else class="w-full hidden md:table">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 w-10">
              <input type="checkbox" :checked="allSelected" :indeterminate="someSelected && !allSelected" @change="toggleAll" class="rounded border-gray-300" />
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">서명자</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
            <th class="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="doc in documents"
            :key="doc.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="navigateTo(`/org/documents/${doc.id}`)"
          >
            <td class="px-4 py-3" @click.stop>
              <input type="checkbox" :checked="selectedIds.includes(doc.id)" @change="toggleSelect(doc.id)" class="rounded border-gray-300" />
            </td>
            <td class="px-4 py-3">
              <p class="font-medium text-sm">{{ doc.title }}</p>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-col gap-0.5">
                <span v-for="sr in doc.signRequests" :key="sr.id" class="text-xs" :class="sr.status === 'signed' ? 'text-green-600' : 'text-gray-500'">
                  {{ sr.signerName }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span :class="statusClass(doc.status)" class="text-xs px-2 py-1 rounded-full">{{ statusLabel(doc.status) }}</span>
              <span v-if="doc.expiresAt && doc.status !== 'expired' && doc.status !== 'completed'" :class="expiryClass(doc.expiresAt)" class="text-xs ml-1">
                {{ expiryLabel(doc.expiresAt) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(doc.createdAt) }}</td>
            <td class="px-4 py-3" @click.stop>
              <button
                @click="handleDuplicate(doc.id)"
                class="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded transition"
                title="복제"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile Card View -->
      <div v-if="documents.length > 0" class="md:hidden divide-y">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
          @click="navigateTo(`/org/documents/${doc.id}`)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="font-medium text-sm truncate">{{ doc.title }}</p>
              <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                <span :class="statusClass(doc.status)" class="text-xs px-2 py-0.5 rounded-full">{{ statusLabel(doc.status) }}</span>
                <span v-if="doc.expiresAt && doc.status !== 'expired' && doc.status !== 'completed'" :class="expiryClass(doc.expiresAt)" class="text-xs">
                  {{ expiryLabel(doc.expiresAt) }}
                </span>
                <span class="text-xs text-gray-400">{{ formatDate(doc.createdAt) }}</span>
              </div>
              <div v-if="doc.signRequests?.length" class="flex flex-wrap gap-1 mt-1.5">
                <span v-for="sr in doc.signRequests" :key="sr.id" class="text-xs text-gray-500">
                  {{ sr.signerName }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button
                @click.stop="handleDuplicate(doc.id)"
                class="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded transition"
                title="복제"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center gap-2 p-4 border-t">
        <button
          v-for="p in pagination.totalPages"
          :key="p"
          @click="page = p; loadDocuments()"
          :class="[
            'min-w-[40px] min-h-[40px] rounded text-sm flex items-center justify-center',
            p === page ? 'bg-brand-600 text-white' : 'bg-gray-100 hover:bg-gray-200',
          ]"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <!-- New Document Modal -->
    <div v-if="showNewDoc" class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" @click.self="showNewDoc = false">
      <div class="bg-white rounded-t-2xl sm:rounded-xl shadow-xl p-6 w-full sm:max-w-md">
        <h2 class="text-lg font-semibold mb-4">새 문서 만들기</h2>
        <form @submit.prevent="createNewDocument" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">문서 제목</label>
            <input
              v-model="newDoc.title"
              type="text"
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              placeholder="예: 수임계약서 - 홍길동"
              autofocus
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">메모 (선택)</label>
            <textarea
              v-model="newDoc.memo"
              rows="2"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
            ></textarea>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="showNewDoc = false" class="flex-1 px-4 py-2.5 border rounded-lg text-sm hover:bg-gray-50">
              취소
            </button>
            <button type="submit" class="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 text-sm font-medium">
              생성
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '문서함 - Pactery' })

const { fetchDocuments, createDocument, duplicateDocument, orgFetch } = useOrganization()
const toast = useToast()

const route = useRoute()
const search = ref('')
const statusFilter = ref((route.query.status as string) || '')
const page = ref(1)
const loading = ref(true)
const documents = ref<any[]>([])
const pagination = ref<any>(null)
const showNewDoc = ref(false)
const newDoc = reactive({ title: '', memo: '' })
const selectedIds = ref<string[]>([])
const downloading = ref(false)

const allSelected = computed(() => documents.value.length > 0 && selectedIds.value.length === documents.value.length)
const someSelected = computed(() => selectedIds.value.length > 0)

onMounted(() => loadDocuments())

watch(statusFilter, () => {
  page.value = 1
  loadDocuments()
})

async function loadDocuments() {
  loading.value = true
  try {
    const params: Record<string, any> = { page: page.value }
    if (search.value) params.search = search.value
    if (statusFilter.value) params.status = statusFilter.value

    const data = await fetchDocuments(params)
    documents.value = data.documents
    pagination.value = data.pagination
    selectedIds.value = []
  } catch (e) {
    console.error('Failed to load documents:', e)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  loadDocuments()
}

function toggleSelect(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

function toggleAll() {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = documents.value.map((d: any) => d.id)
  }
}

async function bulkDownload() {
  downloading.value = true
  try {
    const blob = await orgFetch('/documents/bulk-download', {
      method: 'POST',
      body: { documentIds: selectedIds.value },
      responseType: 'blob',
    })
    const url = URL.createObjectURL(blob as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pactery-documents-${new Date().toISOString().slice(0, 10)}.zip`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e: any) {
    toast.error('다운로드 실패: ' + (e.data?.statusMessage || e.message))
  } finally {
    downloading.value = false
  }
}

async function createNewDocument() {
  try {
    const doc = await createDocument(newDoc)
    showNewDoc.value = false
    newDoc.title = ''
    newDoc.memo = ''
    navigateTo(`/org/documents/${doc.id}/edit`)
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '문서 생성 실패')
  }
}

async function handleDuplicate(docId: string) {
  try {
    const duplicated = await duplicateDocument(docId)
    toast.success('문서가 복제되었습니다')
    navigateTo(`/org/documents/${duplicated.id}/edit`)
  } catch (e: any) {
    console.error('Failed to duplicate document:', e)
    toast.error(e.data?.statusMessage || '문서 복제 실패')
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    draft: '초안', pending: '서명 대기', partially_signed: '부분 서명',
    completed: '완료', rejected: '거절', expired: '만료',
  }
  return map[status] || status
}

function daysUntilExpiry(expiresAt: string): number {
  const now = new Date()
  const exp = new Date(expiresAt)
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function expiryLabel(expiresAt: string): string {
  const days = daysUntilExpiry(expiresAt)
  if (days < 0) return '만료됨'
  if (days === 0) return '오늘 만료'
  return `${days}일 후 만료`
}

function expiryClass(expiresAt: string): string {
  const days = daysUntilExpiry(expiresAt)
  if (days <= 0) return 'text-red-600 font-medium'
  if (days <= 3) return 'text-red-500'
  return 'text-gray-400'
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700', pending: 'bg-yellow-100 text-yellow-800',
    partially_signed: 'bg-brand-100 text-brand-800', completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800', expired: 'bg-gray-100 text-gray-500',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}
</script>
