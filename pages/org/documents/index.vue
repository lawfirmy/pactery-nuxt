<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">문서함</h1>
      <button
        @click="showNewDoc = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
      >
        + 새 문서
      </button>
    </div>

    <!-- Search & Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div class="flex flex-wrap gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="제목, 서명자, 태그로 검색..."
          class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          @keyup.enter="handleSearch"
        />
        <select v-model="statusFilter" class="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">전체 상태</option>
          <option value="draft">초안</option>
          <option value="pending">서명 대기</option>
          <option value="partially_signed">부분 서명</option>
          <option value="completed">완료</option>
          <option value="rejected">거절</option>
          <option value="expired">만료</option>
        </select>
        <input
          v-model="dateFrom"
          type="date"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          title="시작일"
        />
        <span class="self-center text-gray-400">~</span>
        <input
          v-model="dateTo"
          type="date"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          title="종료일"
        />
        <button @click="handleSearch" class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
          검색
        </button>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedIds.length > 0" class="bg-blue-50 rounded-xl p-3 mb-4 flex items-center justify-between">
      <span class="text-sm text-blue-800">{{ selectedIds.length }}건 선택</span>
      <div class="flex gap-2">
        <button
          @click="bulkDownload"
          :disabled="downloading"
          class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {{ downloading ? '다운로드 중...' : '일괄 다운로드 (ZIP)' }}
        </button>
        <button @click="selectedIds = []" class="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm">
          선택 해제
        </button>
      </div>
    </div>

    <!-- Documents Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div v-if="loading" class="text-center py-12 text-gray-400">불러오는 중...</div>

      <div v-else-if="documents.length === 0" class="text-center py-12 text-gray-400">
        문서가 없습니다. 첫 문서를 만들어보세요!
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 w-10">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate="someSelected && !allSelected"
                @change="toggleAll"
                class="rounded border-gray-300"
              />
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">서명자</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="doc in documents"
            :key="doc.id"
            class="hover:bg-gray-50 cursor-pointer"
            :class="{ 'bg-blue-50/50': selectedIds.includes(doc.id) }"
          >
            <td class="px-4 py-3" @click.stop>
              <input
                type="checkbox"
                :checked="selectedIds.includes(doc.id)"
                @change="toggleSelect(doc.id)"
                class="rounded border-gray-300"
              />
            </td>
            <td class="px-4 py-3" @click="navigateTo(`/org/documents/${doc.id}`)">
              <div>
                <p class="font-medium text-sm">{{ doc.title }}</p>
                <div v-if="doc.tags?.length" class="flex gap-1 mt-1">
                  <span
                    v-for="t in doc.tags"
                    :key="t.tag"
                    class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                  >
                    {{ t.tag }}
                  </span>
                </div>
              </div>
            </td>
            <td class="px-4 py-3" @click="navigateTo(`/org/documents/${doc.id}`)">
              <div class="flex flex-col gap-0.5">
                <span
                  v-for="sr in doc.signRequests"
                  :key="sr.id"
                  class="text-xs"
                  :class="sr.status === 'signed' ? 'text-green-600' : 'text-gray-500'"
                >
                  {{ sr.signerName }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3" @click="navigateTo(`/org/documents/${doc.id}`)">
              <span :class="statusClass(doc.status)" class="text-xs px-2 py-1 rounded-full">
                {{ statusLabel(doc.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500" @click="navigateTo(`/org/documents/${doc.id}`)">{{ doc.creator?.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-500" @click="navigateTo(`/org/documents/${doc.id}`)">{{ formatDate(doc.createdAt) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center gap-2 p-4 border-t">
        <button
          v-for="p in pagination.totalPages"
          :key="p"
          @click="page = p; loadDocuments()"
          :class="[
            'w-8 h-8 rounded text-sm',
            p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200',
          ]"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <!-- New Document Modal -->
    <div v-if="showNewDoc" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNewDoc = false">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">새 문서 만들기</h2>
        <form @submit.prevent="createNewDocument" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">문서 제목</label>
            <input
              v-model="newDoc.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="예: 수임계약서 - 홍길동"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">메모 (선택)</label>
            <textarea
              v-model="newDoc.memo"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showNewDoc = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              취소
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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

const { fetchDocuments, createDocument, orgFetch } = useOrganization()

const search = ref('')
const statusFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')
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

async function loadDocuments() {
  loading.value = true
  try {
    const params: Record<string, any> = { page: page.value }
    if (search.value) params.search = search.value
    if (statusFilter.value) params.status = statusFilter.value
    if (dateFrom.value) params.dateFrom = dateFrom.value
    if (dateTo.value) params.dateTo = dateTo.value

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
    alert('다운로드 실패: ' + (e.data?.statusMessage || e.message))
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
    alert(e.data?.statusMessage || '문서 생성 실패')
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

function statusClass(status: string) {
  const map: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700', pending: 'bg-yellow-100 text-yellow-800',
    partially_signed: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800', expired: 'bg-gray-100 text-gray-500',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}
</script>
