<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">의뢰인 관리</h1>
        <p class="text-sm text-gray-500 mt-1">서명 요청 시 의뢰인을 빠르게 선택할 수 있습니다</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="openModal('bulk')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
          대량 등록
        </button>
        <button @click="openModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
          + 의뢰인 등록
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="이름, 이메일, 회사명으로 검색..."
          class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          @input="debouncedSearch"
        />
      </div>
    </div>

    <!-- Client Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table v-if="clients.length > 0" class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">이메일</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">연락처</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">회사</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">사건</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="c in clients"
            :key="c.id"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
            @click="navigateTo(`/org/clients/${c.id}`)"
          >
            <td class="px-4 py-3">
              <div class="text-sm font-medium">{{ c.name }}</div>
              <div class="text-xs text-gray-400 sm:hidden">{{ c.email || '' }}</div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{{ c.email || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{{ c.phone || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{{ c.company || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ c._count?.cases ?? 0 }}건</td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-else class="text-center py-16 px-6">
        <svg class="mx-auto w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">아직 등록된 의뢰인이 없습니다</h3>
        <p class="text-sm text-gray-400 mb-6 max-w-md mx-auto">
          의뢰인을 등록해 두면 서명 요청 시 이름만 검색해서 바로 선택할 수 있어요.
          <br />엑셀에서 복사-붙여넣기로 한번에 대량 등록도 가능합니다.
        </p>
        <div class="flex items-center justify-center gap-3">
          <button @click="openModal('single')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
            + 의뢰인 등록
          </button>
          <button @click="openModal('bulk')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            대량 등록
          </button>
        </div>
      </div>
    </div>

    <!-- Tip Card (shown when few clients) -->
    <div v-if="clients.length > 0 && clients.length < 5 && !tipDismissed" class="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
      <svg class="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="flex-1 text-sm text-blue-800">
        <strong>Tip:</strong> 엑셀이나 스프레드시트에서 의뢰인 목록을 복사해서 <button @click="openModal('bulk')" class="underline font-medium">대량 등록</button>할 수 있어요. 이름, 이메일, 연락처, 회사 순서로 탭으로 구분된 데이터를 붙여넣기만 하면 됩니다.
      </div>
      <button @click="tipDismissed = true" class="text-blue-400 hover:text-blue-600 shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>

    <!-- ==================== ADD CLIENT MODAL ==================== -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" @click.stop>
          <!-- Modal Header with Tabs -->
          <div class="border-b shrink-0">
            <div class="flex items-center justify-between px-6 pt-5 pb-0">
              <h2 class="text-lg font-semibold">의뢰인 등록</h2>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div class="flex px-6 mt-3">
              <button
                @click="modalTab = 'single'"
                :class="modalTab === 'single' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                class="pb-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors"
              >
                개별 등록
              </button>
              <button
                @click="modalTab = 'bulk'"
                :class="modalTab === 'bulk' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors"
              >
                대량 등록
              </button>
            </div>
          </div>

          <!-- SINGLE TAB -->
          <div v-if="modalTab === 'single'" class="p-6 overflow-y-auto">
            <form @submit.prevent="createClient" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">이름 <span class="text-red-500">*</span></label>
                <input
                  ref="nameInputRef"
                  v-model="newClient.name"
                  required
                  placeholder="홍길동"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input
                    v-model="newClient.email"
                    type="email"
                    placeholder="email@example.com"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                  <input
                    v-model="newClient.phone"
                    placeholder="010-1234-5678"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">회사</label>
                  <input
                    v-model="newClient.company"
                    placeholder="(주)회사명"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">메모</label>
                  <input
                    v-model="newClient.memo"
                    placeholder="간단한 메모"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  />
                </div>
              </div>

              <!-- Add another toggle -->
              <label class="flex items-center gap-2 text-sm text-gray-600 select-none">
                <input v-model="addAnother" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                등록 후 계속 추가
              </label>

              <div class="flex justify-end gap-3 pt-2">
                <button type="button" @click="closeModal" class="px-4 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">취소</button>
                <button type="submit" :disabled="!newClient.name.trim() || singleSaving" class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors">
                  {{ singleSaving ? '등록 중...' : '등록' }}
                </button>
              </div>
            </form>
          </div>

          <!-- BULK TAB -->
          <div v-if="modalTab === 'bulk'" class="p-6 overflow-y-auto flex-1">
            <!-- Step 1: Input -->
            <div v-if="bulkStep === 'input'">
              <p class="text-sm text-gray-600 mb-4">
                엑셀이나 스프레드시트에서 복사한 데이터를 아래에 붙여넣거나, CSV/엑셀 파일을 업로드하세요.
              </p>

              <!-- Column guide -->
              <div class="bg-gray-50 rounded-lg p-3 mb-4">
                <p class="text-xs font-medium text-gray-500 mb-2">열 순서 (탭으로 구분)</p>
                <div class="flex items-center gap-2 text-xs">
                  <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">이름*</span>
                  <span class="text-gray-400">&rarr;</span>
                  <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded">이메일</span>
                  <span class="text-gray-400">&rarr;</span>
                  <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded">연락처</span>
                  <span class="text-gray-400">&rarr;</span>
                  <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded">회사</span>
                  <span class="text-gray-400">&rarr;</span>
                  <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded">메모</span>
                </div>
              </div>

              <!-- Paste area -->
              <div class="relative">
                <textarea
                  ref="pasteAreaRef"
                  v-model="bulkText"
                  rows="8"
                  placeholder="홍길동&#9;hong@email.com&#9;010-1234-5678&#9;(주)회사&#10;김영희&#9;kim@email.com&#9;010-5678-1234&#10;이철수&#9;&#9;010-9999-8888&#9;개인"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm leading-relaxed resize-none transition-shadow"
                  @paste="onPaste"
                ></textarea>
                <div v-if="!bulkText" class="absolute top-3 right-3 pointer-events-none">
                  <span class="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded">Ctrl+V 붙여넣기</span>
                </div>
              </div>

              <!-- Divider -->
              <div class="flex items-center gap-3 my-4">
                <div class="flex-1 border-t border-gray-200"></div>
                <span class="text-xs text-gray-400">또는</span>
                <div class="flex-1 border-t border-gray-200"></div>
              </div>

              <!-- File upload -->
              <div
                :class="dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'"
                class="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer"
                @dragover.prevent="dragOver = true"
                @dragleave="dragOver = false"
                @drop.prevent="handleFileDrop"
                @click="fileInputRef?.click()"
              >
                <svg class="mx-auto w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm text-gray-600">
                  <span class="text-blue-600 font-medium">파일 선택</span> 또는 드래그 앤 드롭
                </p>
                <p class="text-xs text-gray-400 mt-1">CSV, TSV, Excel(.xlsx) 지원</p>
                <input ref="fileInputRef" type="file" accept=".csv,.tsv,.xlsx,.xls" class="hidden" @change="handleFileSelect" />
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <button type="button" @click="closeModal" class="px-4 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">취소</button>
                <button
                  @click="parseBulkData"
                  :disabled="!bulkText.trim()"
                  class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  미리보기
                </button>
              </div>
            </div>

            <!-- Step 2: Preview -->
            <div v-if="bulkStep === 'preview'">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-700">
                    {{ parsedClients.length }}명 확인됨
                    <span v-if="parseErrors.length" class="text-red-500 ml-2">
                      ({{ parseErrors.length }}건 오류)
                    </span>
                  </h3>
                </div>
                <button @click="bulkStep = 'input'" class="text-sm text-blue-600 hover:underline">다시 입력</button>
              </div>

              <!-- Errors -->
              <div v-if="parseErrors.length" class="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                <p class="text-sm text-red-700 font-medium mb-1">아래 행은 이름이 누락되어 제외됩니다:</p>
                <ul class="text-xs text-red-600 list-disc list-inside">
                  <li v-for="(err, i) in parseErrors.slice(0, 5)" :key="i">{{ err }}</li>
                  <li v-if="parseErrors.length > 5">...외 {{ parseErrors.length - 5 }}건</li>
                </ul>
              </div>

              <!-- Preview table -->
              <div class="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 border-b sticky top-0">
                    <tr>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 w-8">#</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">이름</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">이메일</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">연락처</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">회사</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500">메모</th>
                      <th class="px-3 py-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y">
                    <tr v-for="(row, i) in parsedClients" :key="i" class="hover:bg-gray-50">
                      <td class="px-3 py-2 text-gray-400">{{ i + 1 }}</td>
                      <td class="px-3 py-2 font-medium">{{ row.name }}</td>
                      <td class="px-3 py-2 text-gray-500">{{ row.email || '-' }}</td>
                      <td class="px-3 py-2 text-gray-500">{{ row.phone || '-' }}</td>
                      <td class="px-3 py-2 text-gray-500">{{ row.company || '-' }}</td>
                      <td class="px-3 py-2 text-gray-500">{{ row.memo || '-' }}</td>
                      <td class="px-3 py-2">
                        <button @click="parsedClients.splice(i, 1)" class="text-gray-400 hover:text-red-500 transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <button type="button" @click="bulkStep = 'input'" class="px-4 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">뒤로</button>
                <button
                  @click="submitBulk"
                  :disabled="parsedClients.length === 0 || bulkSaving"
                  class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  {{ bulkSaving ? '등록 중...' : `${parsedClients.length}명 등록` }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '의뢰인 관리 - Pactery' })

const { fetchClients, orgFetch } = useOrganization()
const toast = useToast()

// ── State ──
const search = ref('')
const clients = ref<any[]>([])
const tipDismissed = ref(false)

// Modal
const showModal = ref(false)
const modalTab = ref<'single' | 'bulk'>('single')

// Single form
const nameInputRef = ref<HTMLInputElement>()
const newClient = reactive({ name: '', email: '', phone: '', company: '', memo: '' })
const addAnother = ref(false)
const singleSaving = ref(false)

// Bulk form
const bulkText = ref('')
const bulkStep = ref<'input' | 'preview'>('input')
const parsedClients = ref<Array<{ name: string; email?: string; phone?: string; company?: string; memo?: string }>>([])
const parseErrors = ref<string[]>([])
const bulkSaving = ref(false)
const dragOver = ref(false)
const fileInputRef = ref<HTMLInputElement>()
const pasteAreaRef = ref<HTMLTextAreaElement>()

// ── Data Loading ──
onMounted(() => loadClients())

let searchTimer: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(loadClients, 300)
}

async function loadClients() {
  try {
    const params: Record<string, any> = {}
    if (search.value) params.search = search.value
    const data = await fetchClients(params)
    clients.value = data.clients
  } catch (e) {
    console.error('Failed to load clients:', e)
  }
}

// ── Modal Controls ──
function openModal(tab?: 'single' | 'bulk') {
  showModal.value = true
  modalTab.value = tab || 'single'
  resetSingleForm()
  resetBulkForm()
  if (tab !== 'bulk') {
    nextTick(() => nameInputRef.value?.focus())
  } else {
    nextTick(() => pasteAreaRef.value?.focus())
  }
}

function closeModal() {
  showModal.value = false
  resetSingleForm()
  resetBulkForm()
}

function resetSingleForm() {
  Object.assign(newClient, { name: '', email: '', phone: '', company: '', memo: '' })
  singleSaving.value = false
}

function resetBulkForm() {
  bulkText.value = ''
  bulkStep.value = 'input'
  parsedClients.value = []
  parseErrors.value = []
  bulkSaving.value = false
}

// ── Single Client Creation ──
async function createClient() {
  if (!newClient.name.trim()) return
  singleSaving.value = true
  try {
    await orgFetch('/clients', { method: 'POST', body: { ...newClient } })
    toast.success(`${newClient.name}님이 등록되었습니다`)
    await loadClients()

    if (addAnother.value) {
      resetSingleForm()
      nextTick(() => nameInputRef.value?.focus())
    } else {
      closeModal()
    }
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '등록 실패')
  } finally {
    singleSaving.value = false
  }
}

// ── Bulk: Parse ──
function parseBulkData() {
  const lines = bulkText.value.trim().split('\n').filter(l => l.trim())
  const results: typeof parsedClients.value = []
  const errors: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    const cols = line.split('\t').map(c => c.trim())
    // Also support comma-separated if no tabs found
    const parts = cols.length <= 1 ? line.split(',').map(c => c.trim()) : cols

    const name = parts[0]?.trim()
    if (!name) {
      errors.push(`${i + 1}번째 줄: 이름이 비어있음 — "${line.substring(0, 40)}"`)
      continue
    }

    // Skip header row
    if (i === 0 && /^(이름|name|성명)$/i.test(name)) continue

    results.push({
      name,
      email: parts[1] || undefined,
      phone: parts[2] || undefined,
      company: parts[3] || undefined,
      memo: parts[4] || undefined,
    })
  }

  parsedClients.value = results
  parseErrors.value = errors
  bulkStep.value = 'preview'
}

function onPaste(_e: ClipboardEvent) {
  // Let default paste happen, then auto-advance if data looks good
  nextTick(() => {
    if (bulkText.value.trim().split('\n').filter(l => l.trim()).length >= 2) {
      // Auto-parse after small delay so user can see it
      setTimeout(() => parseBulkData(), 300)
    }
  })
}

// ── Bulk: File Upload ──
function handleFileDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files[0]
  if (file) processFile(file)
}

function handleFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}

async function processFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'csv' || ext === 'tsv') {
    const text = await file.text()
    bulkText.value = ext === 'csv' ? csvToTsv(text) : text
    parseBulkData()
  } else if (ext === 'xlsx' || ext === 'xls') {
    try {
      const XLSX = await import('xlsx')
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      const firstSheet = wb.SheetNames[0]
      if (!firstSheet) throw new Error('빈 시트')
      const ws = wb.Sheets[firstSheet]
      if (!ws) throw new Error('빈 시트')
      const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
      bulkText.value = rows.map(r => r.join('\t')).join('\n')
      parseBulkData()
    } catch (err: any) {
      toast.error(err?.message || '엑셀 파일 읽기 실패')
    }
  } else {
    toast.error('지원되지 않는 파일 형식입니다. CSV, TSV 파일을 사용해 주세요.')
  }
}

function csvToTsv(csv: string): string {
  return csv.split('\n').map(line => {
    // Handle quoted CSV fields
    const fields: string[] = []
    let current = ''
    let inQuotes = false
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue }
      if (char === ',' && !inQuotes) { fields.push(current.trim()); current = ''; continue }
      current += char
    }
    fields.push(current.trim())
    return fields.join('\t')
  }).join('\n')
}

// ── Bulk: Submit ──
async function submitBulk() {
  if (parsedClients.value.length === 0) return
  bulkSaving.value = true
  try {
    const { count } = await orgFetch<{ count: number }>('/clients/bulk', {
      method: 'POST',
      body: { clients: parsedClients.value },
    })
    toast.success(`${count}명의 의뢰인이 등록되었습니다`)
    await loadClients()
    closeModal()
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '대량 등록 실패')
  } finally {
    bulkSaving.value = false
  }
}
</script>
