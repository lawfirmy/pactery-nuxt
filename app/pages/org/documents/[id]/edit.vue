<template>
  <div class="max-w-6xl mx-auto py-6 px-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <NuxtLink to="/org/documents" class="text-sm text-blue-600 hover:underline mb-1 inline-block">&larr; 문서함</NuxtLink>
        <h1 class="text-xl font-bold">{{ doc?.title || '문서 편집' }}</h1>
      </div>
      <div class="text-sm text-gray-400">
        <span :class="statusClass">{{ statusLabel }}</span>
      </div>
    </div>

    <div v-if="pageLoading" class="text-center py-20 text-gray-400">불러오는 중...</div>

    <template v-else-if="doc">
      <!-- Step Indicator -->
      <div class="flex items-center mb-8">
        <template v-for="(s, i) in steps" :key="i">
          <button
            @click="goToStep(i)"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition"
            :class="stepClass(i)"
          >
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              :class="stepNumberClass(i)"
            >{{ i + 1 }}</span>
            <span class="hidden sm:inline">{{ s.label }}</span>
          </button>
          <div v-if="i < steps.length - 1" class="flex-1 h-px bg-gray-200 mx-2"></div>
        </template>
      </div>

      <!-- Step 1: PDF Upload -->
      <div v-show="step === 0" class="space-y-4">
        <div
          v-if="!doc.originalFileKey"
          class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition cursor-pointer bg-white"
          @click="triggerFileInput"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
          :class="{ 'border-blue-400 bg-blue-50': dragOver }"
        >
          <div class="text-4xl mb-3 text-gray-300">&#x1F4C4;</div>
          <p class="text-gray-500 font-medium">PDF 파일을 드래그하거나 클릭하여 업로드</p>
          <p class="text-sm text-gray-400 mt-1">최대 20MB, PDF만 지원</p>
          <input ref="fileInputRef" type="file" accept="application/pdf" class="hidden" @change="handleFileSelect" />
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 bg-green-50 border-b">
            <div class="flex items-center gap-2">
              <span class="text-green-600">&#x2705;</span>
              <span class="text-sm font-medium text-green-800">PDF 업로드 완료</span>
            </div>
            <button @click="reupload" class="text-sm text-blue-600 hover:underline">다시 업로드</button>
          </div>
          <ClientOnly>
            <PdfViewer :src="pdfData" height="min(400px, 50vh)" />
            <template #fallback>
              <div class="h-96 flex items-center justify-center bg-gray-100">
                <p class="text-gray-400">PDF 뷰어 로딩 중...</p>
              </div>
            </template>
          </ClientOnly>
        </div>

        <div v-if="uploading" class="bg-white rounded-xl shadow-sm p-6 text-center">
          <div class="text-gray-500">업로드 중...</div>
        </div>
      </div>

      <!-- Step 2: Signers -->
      <div v-show="step === 1" class="space-y-4">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="font-semibold mb-4">서명자 목록</h2>

          <div v-if="signers.length === 0" class="text-center py-8 text-gray-400">
            서명자를 추가해주세요
          </div>

          <div v-else class="space-y-3 mb-6">
            <div
              v-for="(signer, i) in signers"
              :key="signer.id"
              class="flex items-center justify-between p-3 border rounded-lg"
            >
              <div class="flex items-center gap-3">
                <span class="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {{ i + 1 }}
                </span>
                <div>
                  <p class="text-sm font-medium">{{ signer.signerName }}</p>
                  <p class="text-xs text-gray-400">{{ signer.signerEmail }}</p>
                </div>
              </div>
              <button @click="handleRemoveSigner(signer.id)" class="text-sm text-red-500 hover:text-red-700">삭제</button>
            </div>
          </div>

          <!-- Add signer form -->
          <div class="border-t pt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-3">서명자 추가</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1.5">이름 *</label>
                <input
                  v-model="newSigner.signerName"
                  type="text"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1.5">이메일 *</label>
                <input
                  v-model="newSigner.signerEmail"
                  type="email"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                  placeholder="hong@example.com"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1.5">전화 (선택)</label>
                <input
                  v-model="newSigner.signerPhone"
                  type="tel"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                  placeholder="010-1234-5678"
                />
              </div>
              <div class="flex items-end">
                <button
                  @click="handleAddSigner"
                  :disabled="!newSigner.signerName || !newSigner.signerEmail"
                  class="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
                >
                  서명자 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Field Placement -->
      <div v-show="step === 2" class="space-y-4">
        <div v-if="!doc.originalFileKey" class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          먼저 PDF를 업로드해주세요
        </div>
        <div v-else-if="signers.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          먼저 서명자를 추가해주세요
        </div>
        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
          <ClientOnly>
            <FieldEditor
              :pdf-src="pdfData"
              v-model="fields"
              :signers="signers"
              height="min(550px, 60vh)"
            />
            <template #fallback>
              <div class="h-96 flex items-center justify-center bg-gray-100">
                <p class="text-gray-400">에디터 로딩 중...</p>
              </div>
            </template>
          </ClientOnly>
          <div class="flex justify-end px-4 py-3 border-t bg-gray-50">
            <button @click="handleSaveFields" :disabled="savingFields" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {{ savingFields ? '저장 중...' : '필드 저장' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 4: Review & Send -->
      <div v-show="step === 3" class="space-y-4">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="font-semibold mb-4">문서 검토</h2>

          <dl class="space-y-3">
            <div class="flex justify-between text-sm">
              <dt class="text-gray-500">문서 제목</dt>
              <dd class="font-medium">{{ doc.title }}</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-500">PDF</dt>
              <dd :class="doc.originalFileKey ? 'text-green-600' : 'text-red-500'">
                {{ doc.originalFileKey ? '업로드 완료' : '미업로드' }}
              </dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-500">서명자</dt>
              <dd>{{ signers.length }}명</dd>
            </div>
            <div class="flex justify-between text-sm">
              <dt class="text-gray-500">서명 필드</dt>
              <dd>{{ fields.length }}개</dd>
            </div>
          </dl>

          <!-- Signer details -->
          <div v-if="signers.length" class="mt-6">
            <h3 class="text-sm font-medium text-gray-700 mb-2">서명자 정보</h3>
            <div class="space-y-2">
              <div
                v-for="(signer, i) in signers"
                :key="signer.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ i + 1 }}. {{ signer.signerName }}</span>
                  <span class="text-xs text-gray-400">({{ signer.signerEmail }})</span>
                </div>
                <span class="text-xs text-gray-500">
                  필드 {{ fields.filter(f => f.signRequestId === signer.id).length }}개
                </span>
              </div>
            </div>
          </div>

          <!-- Validation warnings -->
          <div v-if="validationErrors.length" class="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-sm font-medium text-yellow-800 mb-1">발송 전 확인사항:</p>
            <ul class="text-sm text-yellow-700 space-y-1">
              <li v-for="err in validationErrors" :key="err">- {{ err }}</li>
            </ul>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button @click="step = 2" class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            이전 단계
          </button>
          <button
            @click="handleSend"
            :disabled="sending || validationErrors.length > 0"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 transition"
          >
            {{ sending ? '발송 중...' : '서명 요청 발송' }}
          </button>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div v-if="step < 3" class="flex justify-between mt-6">
        <button
          v-if="step > 0"
          @click="step--"
          class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
        >
          이전
        </button>
        <div v-else></div>
        <button
          @click="step++"
          :disabled="!canProceed"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-40"
        >
          다음
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '문서 편집 - Pactery' })

const route = useRoute()
const docId = route.params.id as string
const { fetchDocument, addSigner, removeSigner, uploadDocumentPdf, saveFields, sendDocument, fetchPdfBuffer, orgId } = useOrganization()
const { waitForAuth, state: authState } = useAuth()

const pageLoading = ref(true)
const doc = ref<any>(null)
const step = ref(0)
const signers = ref<any[]>([])
const fields = ref<any[]>([])
const uploading = ref(false)
const savingFields = ref(false)
const sending = ref(false)
const dragOver = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const newSigner = reactive({ signerName: '', signerEmail: '', signerPhone: '' })

const steps = [
  { label: 'PDF 업로드' },
  { label: '서명자' },
  { label: '필드 배치' },
  { label: '검토 및 발송' },
]

const pdfData = ref<ArrayBuffer | null>(null)

async function loadPdfData() {
  if (!doc.value?.originalFileKey) return
  try {
    pdfData.value = await fetchPdfBuffer(docId)
  } catch (e) {
    console.error('Failed to load PDF:', e)
  }
}

const statusLabel = computed(() => {
  const map: Record<string, string> = { draft: '초안', pending: '서명 대기', completed: '완료' }
  return map[doc.value?.status] || doc.value?.status
})
const statusClass = computed(() => {
  const map: Record<string, string> = { draft: 'text-gray-500', pending: 'text-yellow-600', completed: 'text-green-600' }
  return map[doc.value?.status] || ''
})

const canProceed = computed(() => {
  if (step.value === 0) return !!doc.value?.originalFileKey
  if (step.value === 1) return signers.value.length > 0
  if (step.value === 2) return fields.value.length > 0
  return true
})

const validationErrors = computed(() => {
  const errors: string[] = []
  if (!doc.value?.originalFileKey) errors.push('PDF 파일이 업로드되지 않았습니다')
  if (signers.value.length === 0) errors.push('서명자가 없습니다')
  if (fields.value.length === 0) errors.push('서명 필드가 없습니다')
  // Check all signers have at least one field
  for (const signer of signers.value) {
    const signerFields = fields.value.filter(f => f.signRequestId === signer.id)
    if (signerFields.length === 0) errors.push(`${signer.signerName}에게 배정된 필드가 없습니다`)
  }
  return errors
})

function stepClass(i: number) {
  if (i === step.value) return 'bg-blue-50 text-blue-700'
  if (i < step.value) return 'text-green-700'
  return 'text-gray-400'
}

function stepNumberClass(i: number) {
  if (i === step.value) return 'bg-blue-600 text-white'
  if (i < step.value) return 'bg-green-500 text-white'
  return 'bg-gray-200 text-gray-500'
}

function goToStep(i: number) {
  step.value = i
}

// Load document
onMounted(async () => {
  try {
    await waitForAuth()
    if (!orgId.value) {
      navigateTo('/auth/login')
      return
    }
    const data = await fetchDocument(docId)
    doc.value = data
    signers.value = data.signRequests || []
    fields.value = (data.signFields || []).map((f: any) => ({
      ...f,
      id: f.id || crypto.randomUUID(),
    }))

    // Load PDF if already uploaded
    if (data.originalFileKey) {
      await loadPdfData()
    }

    // Auto-advance to first incomplete step
    if (data.originalFileKey && data.signRequests?.length > 0 && data.signFields?.length > 0) {
      step.value = 3
    } else if (data.originalFileKey && data.signRequests?.length > 0) {
      step.value = 2
    } else if (data.originalFileKey) {
      step.value = 1
    }
  } catch (e) {
    console.error('Failed to load document:', e)
  } finally {
    pageLoading.value = false
  }
})

// PDF Upload
function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadPdf(file)
}

function handleDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type === 'application/pdf') uploadPdf(file)
}

async function uploadPdf(file: File) {
  uploading.value = true
  try {
    const result = await uploadDocumentPdf(docId, file)
    doc.value.originalFileKey = result.fileKey
    doc.value.originalHash = result.hash
    await loadPdfData()
  } catch (e: any) {
    alert(e.data?.statusMessage || '업로드 실패')
    console.error('Upload failed:', e)
  } finally {
    uploading.value = false
  }
}

function reupload() {
  doc.value.originalFileKey = null
  triggerFileInput()
}

// Signers
async function handleAddSigner() {
  if (!newSigner.signerName || !newSigner.signerEmail) return
  try {
    const sr = await addSigner(docId, {
      signerName: newSigner.signerName,
      signerEmail: newSigner.signerEmail,
      signerPhone: newSigner.signerPhone || undefined,
    })
    signers.value.push(sr)
    newSigner.signerName = ''
    newSigner.signerEmail = ''
    newSigner.signerPhone = ''
  } catch (e: any) {
    alert(e.data?.statusMessage || '서명자 추가 실패')
  }
}

async function handleRemoveSigner(signRequestId: string) {
  try {
    await removeSigner(docId, signRequestId)
    signers.value = signers.value.filter(s => s.id !== signRequestId)
    fields.value = fields.value.filter(f => f.signRequestId !== signRequestId)
  } catch (e: any) {
    alert(e.data?.statusMessage || '삭제 실패')
  }
}

// Fields
async function handleSaveFields() {
  savingFields.value = true
  try {
    const toSave = fields.value.map(f => ({
      signRequestId: f.signRequestId,
      type: f.type,
      page: f.page,
      x: f.x,
      y: f.y,
      width: f.width,
      height: f.height,
      required: f.required,
    }))
    const result = await saveFields(docId, toSave)
    fields.value = result.fields.map((f: any) => ({ ...f, id: f.id }))
    alert('필드가 저장되었습니다')
  } catch (e: any) {
    alert(e.data?.statusMessage || '필드 저장 실패')
    console.error('Save fields failed:', e)
  } finally {
    savingFields.value = false
  }
}

// Send
async function handleSend() {
  if (!confirm('서명 요청을 발송하시겠습니까?\n발송 후에는 문서를 수정할 수 없습니다.')) return

  // Save fields first
  await handleSaveFields()

  sending.value = true
  try {
    await sendDocument(docId)
    alert('서명 요청이 발송되었습니다!')
    navigateTo(`/org/documents/${docId}`)
  } catch (e: any) {
    alert(e.data?.statusMessage || '발송 실패')
    console.error('Send failed:', e)
  } finally {
    sending.value = false
  }
}
</script>
