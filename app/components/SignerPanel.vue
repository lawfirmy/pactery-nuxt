<template>
  <div class="bg-white rounded-xl shadow-sm p-5">
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-semibold">서명자</h2>
      <button
        v-if="canAddSigner"
        @click="showAddForm = true"
        class="text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        + 추가
      </button>
    </div>

    <!-- Add Signer Form -->
    <div v-if="showAddForm" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div class="space-y-2">
        <input
          v-model="newSigner.signerName"
          placeholder="이름"
          class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          v-model="newSigner.signerEmail"
          type="email"
          placeholder="이메일"
          class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          v-model="newSigner.signerPhone"
          type="tel"
          placeholder="전화번호 (선택)"
          class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="flex justify-end gap-2 mt-3">
        <button
          @click="cancelAdd"
          class="text-xs px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
        >
          취소
        </button>
        <button
          @click="handleAddSigner"
          :disabled="!isAddValid || addingInProgress"
          class="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ addingInProgress ? '추가 중...' : '추가' }}
        </button>
      </div>
    </div>

    <!-- Signer List -->
    <div class="space-y-2">
      <div
        v-for="(sr, idx) in signers"
        :key="sr.id"
        class="group relative p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
      >
        <!-- Signer Info Row -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 min-w-0">
            <!-- Order Badge -->
            <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-gray-100 text-gray-500 text-xs rounded-full font-medium">
              {{ idx + 1 }}
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium truncate">{{ sr.signerName }}</p>
              <p class="text-xs text-gray-400 truncate">{{ sr.signerEmail }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="signerStatusClass(sr.status)" class="text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
              {{ signerStatusLabel(sr.status) }}
            </span>
            <!-- Resend button for pending signers -->
            <button
              v-if="canResend(sr)"
              @click="resendTarget = sr"
              class="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors whitespace-nowrap"
            >
              재요청
            </button>
            <!-- Action menu toggle -->
            <button
              v-if="hasActions(sr)"
              @click="toggleMenu(sr.id)"
              class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 rounded transition-opacity"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Action Menu -->
        <div
          v-if="openMenuId === sr.id"
          class="absolute right-0 top-full mt-1 z-10 bg-white rounded-lg shadow-lg border py-1 min-w-[160px]"
        >
          <!-- Draft actions -->
          <template v-if="docStatus === 'draft'">
            <button @click="handleEditSigner(sr)" class="w-full text-left text-sm px-4 py-2 hover:bg-gray-50">
              정보 수정
            </button>
            <button @click="handleMoveUp(sr, idx)" :disabled="idx === 0" class="w-full text-left text-sm px-4 py-2 hover:bg-gray-50 disabled:text-gray-300">
              위로 이동
            </button>
            <button @click="handleMoveDown(sr, idx)" :disabled="idx === signers.length - 1" class="w-full text-left text-sm px-4 py-2 hover:bg-gray-50 disabled:text-gray-300">
              아래로 이동
            </button>
            <hr class="my-1" />
            <button @click="handleRemoveSigner(sr)" class="w-full text-left text-sm px-4 py-2 hover:bg-red-50 text-red-600">
              삭제
            </button>
          </template>

          <!-- Pending/Partially signed actions -->
          <template v-if="docStatus === 'pending' || docStatus === 'partially_signed'">
            <button
              v-if="sr.status === 'pending'"
              @click="handleSendRequest(sr)"
              class="w-full text-left text-sm px-4 py-2 hover:bg-gray-50"
            >
              서명요청 발송
            </button>
            <button
              v-if="sr.status === 'pending'"
              @click="handleSendReminder(sr)"
              class="w-full text-left text-sm px-4 py-2 hover:bg-gray-50"
            >
              리마인더 발송
            </button>
            <button
              v-if="sr.status === 'pending'"
              @click="handleCopyLink(sr)"
              class="w-full text-left text-sm px-4 py-2 hover:bg-gray-50"
            >
              서명 링크 복사
            </button>
          </template>
        </div>

        <!-- Inline Edit Form -->
        <div v-if="editingId === sr.id" class="mt-3 pt-3 border-t border-gray-100">
          <div class="space-y-2">
            <input
              v-model="editForm.signerName"
              placeholder="이름"
              class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              v-model="editForm.signerEmail"
              type="email"
              placeholder="이메일"
              class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              v-model="editForm.signerPhone"
              type="tel"
              placeholder="전화번호 (선택)"
              class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex justify-end gap-2 mt-3">
            <button @click="editingId = null" class="text-xs px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded">
              취소
            </button>
            <button
              @click="handleSaveEdit(sr)"
              :disabled="!isEditValid"
              class="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="signers.length === 0" class="text-center py-6 text-gray-400 text-sm">
        서명자가 없습니다
      </div>
    </div>

    <!-- Bulk Send Button (draft only) -->
    <button
      v-if="docStatus === 'draft' && signers.length > 0"
      @click="$emit('send')"
      class="w-full mt-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
    >
      서명요청 일괄 발송
    </button>

    <!-- Confirm Delete Dialog -->
    <div v-if="confirmDeleteId" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" @click.self="confirmDeleteId = null">
      <div class="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
        <h3 class="font-semibold mb-2">서명자 삭제</h3>
        <p class="text-sm text-gray-600 mb-4">이 서명자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
        <div class="flex justify-end gap-2">
          <button @click="confirmDeleteId = null" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            취소
          </button>
          <button @click="confirmDelete" class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            삭제
          </button>
        </div>
      </div>
    </div>

    <!-- Resend Modal -->
    <ResendModal
      v-if="resendTarget"
      :signer="resendTarget"
      :doc-id="docId"
      @close="resendTarget = null"
      @sent="handleResendSent"
    />
  </div>
</template>

<script setup lang="ts">
interface SignRequest {
  id: string
  signerName: string
  signerEmail: string
  signerPhone?: string | null
  status: string
  orderIndex: number
  token?: string
}

const props = defineProps<{
  signers: SignRequest[]
  docStatus: string
  docId: string
}>()

const emit = defineEmits<{
  add: [data: { signerName: string; signerEmail: string; signerPhone?: string }]
  remove: [signRequestId: string]
  update: [signRequestId: string, data: { signerName: string; signerEmail: string; signerPhone?: string }]
  reorder: [signRequestId: string, newIndex: number]
  send: []
  sendRequest: [signRequestId: string]
  sendReminder: [signRequestId: string]
  copyLink: [token: string]
}>()

const toast = useToast()

// Add form state
const showAddForm = ref(false)
const addingInProgress = ref(false)
const newSigner = reactive({
  signerName: '',
  signerEmail: '',
  signerPhone: '',
})

// Edit form state
const editingId = ref<string | null>(null)
const editForm = reactive({
  signerName: '',
  signerEmail: '',
  signerPhone: '',
})

// Menu state
const openMenuId = ref<string | null>(null)
const confirmDeleteId = ref<string | null>(null)
const resendTarget = ref<SignRequest | null>(null)

// Computed
const canAddSigner = computed(() => {
  return props.docStatus === 'draft' || props.docStatus === 'pending'
})

const isAddValid = computed(() => {
  return newSigner.signerName.trim() && newSigner.signerEmail.includes('@')
})

const isEditValid = computed(() => {
  return editForm.signerName.trim() && editForm.signerEmail.includes('@')
})

// Close menu on outside click
function handleClickOutside() {
  openMenuId.value = null
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function canResend(sr: SignRequest): boolean {
  return (props.docStatus === 'pending' || props.docStatus === 'partially_signed') && sr.status === 'pending'
}

function handleResendSent(_method: string) {
  // Could refresh signer data if needed
}

function hasActions(sr: SignRequest): boolean {
  if (props.docStatus === 'draft') return true
  if ((props.docStatus === 'pending' || props.docStatus === 'partially_signed') && sr.status === 'pending') return true
  return false
}

// Add Signer
function cancelAdd() {
  showAddForm.value = false
  newSigner.signerName = ''
  newSigner.signerEmail = ''
  newSigner.signerPhone = ''
}

async function handleAddSigner() {
  if (!isAddValid.value) return
  addingInProgress.value = true
  emit('add', {
    signerName: newSigner.signerName.trim(),
    signerEmail: newSigner.signerEmail.trim(),
    signerPhone: newSigner.signerPhone.trim() || undefined,
  })
  cancelAdd()
  addingInProgress.value = false
}

// Edit Signer
function handleEditSigner(sr: SignRequest) {
  openMenuId.value = null
  editingId.value = sr.id
  editForm.signerName = sr.signerName
  editForm.signerEmail = sr.signerEmail
  editForm.signerPhone = sr.signerPhone || ''
}

function handleSaveEdit(sr: SignRequest) {
  emit('update', sr.id, {
    signerName: editForm.signerName.trim(),
    signerEmail: editForm.signerEmail.trim(),
    signerPhone: editForm.signerPhone.trim() || undefined,
  })
  editingId.value = null
}

// Remove Signer
function handleRemoveSigner(sr: SignRequest) {
  openMenuId.value = null
  confirmDeleteId.value = sr.id
}

function confirmDelete() {
  if (confirmDeleteId.value) {
    emit('remove', confirmDeleteId.value)
    confirmDeleteId.value = null
  }
}

// Reorder
function handleMoveUp(sr: SignRequest, idx: number) {
  if (idx === 0) return
  openMenuId.value = null
  emit('reorder', sr.id, idx - 1)
}

function handleMoveDown(sr: SignRequest, idx: number) {
  if (idx === props.signers.length - 1) return
  openMenuId.value = null
  emit('reorder', sr.id, idx + 1)
}

// Individual actions
function handleSendRequest(sr: SignRequest) {
  openMenuId.value = null
  emit('sendRequest', sr.id)
}

function handleSendReminder(sr: SignRequest) {
  openMenuId.value = null
  emit('sendReminder', sr.id)
}

function handleCopyLink(sr: SignRequest) {
  openMenuId.value = null
  if (sr.token) {
    emit('copyLink', sr.token)
  }
}

// Status helpers
function signerStatusLabel(s: string) {
  return { pending: '대기', signed: '완료', rejected: '거절' }[s] || s
}
function signerStatusClass(s: string) {
  return {
    pending: 'bg-yellow-100 text-yellow-800',
    signed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }[s] || 'bg-gray-100'
}
</script>
