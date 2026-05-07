<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <NuxtLink to="/admin" class="text-sm text-gray-400 hover:text-gray-600">&larr; 관리자</NuxtLink>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">홍보 이메일</h1>
        <p class="mt-1 text-sm text-gray-500">이메일 캠페인 작성 및 발송</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-gray-200 mb-8">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px"
        :class="activeTab === tab.key ? 'border-brand-700 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Campaigns Tab -->
    <div v-if="activeTab === 'campaigns'">
      <!-- New campaign form -->
      <div class="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingCampaign ? '캠페인 수정' : '새 캠페인' }}
        </h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">캠페인명</label>
              <input v-model="form.name" type="text" placeholder="예: 5월 런칭 홍보" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">이메일 제목</label>
              <input v-model="form.subject" type="text" placeholder="예: 전자서명, 더 쉽게 시작하세요" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">HTML 본문</label>
            <textarea v-model="form.bodyHtml" rows="10" placeholder="HTML 이메일 본문..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-brand-500 focus:border-brand-500"></textarea>
            <p class="mt-1 text-xs text-gray-400">변수: &#123;&#123;name&#125;&#125;, &#123;&#123;email&#125;&#125;, &#123;&#123;siteUrl&#125;&#125;, &#123;&#123;unsubscribeUrl&#125;&#125;</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="saveCampaign"
              :disabled="saving"
              class="px-4 py-2 bg-brand-800 text-white text-sm font-medium rounded-lg hover:bg-brand-900 transition disabled:opacity-50"
            >
              {{ saving ? '저장 중...' : (editingCampaign ? '수정' : '생성') }}
            </button>
            <button
              v-if="editingCampaign"
              @click="cancelEdit"
              class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              취소
            </button>
          </div>
        </div>
      </div>

      <!-- Campaign list -->
      <div v-if="campaignsLoading" class="text-center py-10 text-gray-400 text-sm">불러오는 중...</div>
      <div v-else class="space-y-4">
        <div
          v-for="c in campaigns"
          :key="c.id"
          class="bg-white border border-gray-200 rounded-xl overflow-hidden"
        >
          <div class="px-6 py-4 flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-900">{{ c.name }}</h3>
              <p class="text-sm text-gray-500">{{ c.subject }}</p>
              <div class="flex gap-4 mt-2 text-xs text-gray-400">
                <span>발송 {{ c.sent }}건</span>
                <span>실패 {{ c.failed }}건</span>
                <span v-if="c.pending > 0">대기 {{ c.pending }}건</span>
                <span>{{ formatDate(c.createdAt) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="editCampaign(c)" class="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition">수정</button>
              <button @click="openSendModal(c)" class="px-3 py-1.5 text-xs text-white bg-brand-700 hover:bg-brand-800 rounded-lg transition">발송</button>
            </div>
          </div>
        </div>
        <div v-if="campaigns.length === 0" class="text-center py-16 text-gray-400 text-sm">캠페인이 없습니다.</div>
      </div>
    </div>

    <!-- Recipients Tab -->
    <div v-if="activeTab === 'recipients'">
      <!-- Add recipients -->
      <div class="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">수신자 추가</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이메일 목록 (한 줄에 하나, 또는 이름,이메일 형식)</label>
            <textarea v-model="recipientInput" rows="5" placeholder="example@email.com&#10;홍길동,hong@email.com&#10;김변호사,kim@law.co.kr" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-brand-500 focus:border-brand-500"></textarea>
          </div>
          <button
            @click="addRecipients"
            :disabled="addingRecipients"
            class="px-4 py-2 bg-brand-800 text-white text-sm font-medium rounded-lg hover:bg-brand-900 transition disabled:opacity-50"
          >
            {{ addingRecipients ? '추가 중...' : '추가' }}
          </button>
          <p v-if="addResult" class="text-sm text-gray-600">{{ addResult }}</p>
        </div>
      </div>

      <!-- Recipient list -->
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-semibold text-gray-900">수신자 목록 ({{ recipientTotal }}명)</h3>
          <input v-model="recipientSearch" type="text" placeholder="검색..." class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-48" @input="searchRecipients" />
        </div>
        <div v-if="recipientsLoading" class="px-6 py-8 text-center text-gray-400 text-sm">불러오는 중...</div>
        <table v-else class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
              <th class="px-6 py-3">이메일</th>
              <th class="px-4 py-3">이름</th>
              <th class="px-4 py-3">출처</th>
              <th class="px-4 py-3">마지막 발송</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in recipients" :key="r.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="px-6 py-3 text-gray-900">{{ r.email }}</td>
              <td class="px-4 py-3 text-gray-600">{{ r.name || '-' }}</td>
              <td class="px-4 py-3 text-gray-500">{{ r.source }}</td>
              <td class="px-4 py-3 text-gray-400">{{ r.lastSentAt ? formatDate(r.lastSentAt) : '-' }}</td>
            </tr>
            <tr v-if="recipients.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-400">수신자가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Send modal -->
    <Teleport to="body">
      <div v-if="sendModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="sendModal = null">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">이메일 발송</h3>
          <p class="text-sm text-gray-500 mb-4">캠페인: {{ sendModal.name }}</p>

          <div class="space-y-4">
            <!-- Test send -->
            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">테스트 발송</label>
              <div class="flex gap-2">
                <input v-model="testEmail" type="email" placeholder="test@example.com" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <button @click="sendTest" :disabled="sending" class="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 shrink-0">
                  {{ sending ? '...' : '테스트' }}
                </button>
              </div>
            </div>

            <!-- Batch send -->
            <div class="bg-blue-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">일괄 발송</label>
              <div class="flex items-center gap-3">
                <label class="text-sm text-gray-600">발송 수:</label>
                <select v-model.number="batchSize" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option :value="1">1건</option>
                  <option :value="5">5건</option>
                  <option :value="10">10건</option>
                  <option :value="25">25건</option>
                  <option :value="50">50건</option>
                  <option :value="100">100건</option>
                </select>
                <button @click="sendBatch" :disabled="sending" class="px-4 py-2 text-sm bg-brand-700 text-white rounded-lg hover:bg-brand-800 disabled:opacity-50">
                  {{ sending ? '발송 중...' : '발송' }}
                </button>
              </div>
            </div>

            <div v-if="sendResult" class="text-sm p-3 rounded-lg" :class="sendResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'">
              {{ sendResult.message }}
            </div>
          </div>

          <div class="mt-6 text-right">
            <button @click="sendModal = null" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">닫기</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: '홍보 이메일 | Pactery Admin' })

const { isLoggedIn, waitForAuth, authFetch, state: authState } = useAuth()

await waitForAuth()
if (!isLoggedIn.value) navigateTo('/auth/login')

const ADMIN_EMAILS = ['sangemi@daum.net', 'ksaksk2112@gmail.com']
if (!ADMIN_EMAILS.includes(authState.value.user?.email || '')) {
  navigateTo('/admin')
}

// Tabs
const tabs = [
  { key: 'campaigns', label: '캠페인' },
  { key: 'recipients', label: '수신자' },
]
const activeTab = ref('campaigns')

// ── Campaigns ──
interface Campaign {
  id: string; name: string; subject: string; isActive: boolean
  createdAt: string; updatedAt: string
  totalSends: number; pending: number; sent: number; failed: number; bounced: number
}

const campaigns = ref<Campaign[]>([])
const campaignsLoading = ref(true)
const saving = ref(false)
const editingCampaign = ref<Campaign | null>(null)

const form = ref({ name: '', subject: '', bodyHtml: '' })

async function loadCampaigns() {
  campaignsLoading.value = true
  try {
    campaigns.value = await authFetch<Campaign[]>('/api/admin/emails/campaigns')
  } finally {
    campaignsLoading.value = false
  }
}

async function saveCampaign() {
  if (!form.value.name || !form.value.subject || !form.value.bodyHtml) return
  saving.value = true
  try {
    if (editingCampaign.value) {
      await authFetch(`/api/admin/emails/${editingCampaign.value.id}`, {
        method: 'PATCH',
        body: form.value,
      })
    } else {
      await authFetch('/api/admin/emails/campaigns', {
        method: 'POST',
        body: form.value,
      })
    }
    cancelEdit()
    await loadCampaigns()
  } catch (e: any) {
    useToast().error(e?.data?.message || '저장 실패')
  } finally {
    saving.value = false
  }
}

async function editCampaign(c: Campaign) {
  editingCampaign.value = c
  form.value = { name: c.name, subject: c.subject, bodyHtml: '' }
  try {
    const full = await authFetch<any>(`/api/admin/emails/${c.id}`)
    form.value.bodyHtml = full.bodyHtml || ''
  } catch { /* ignore */ }
}

function cancelEdit() {
  editingCampaign.value = null
  form.value = { name: '', subject: '', bodyHtml: '' }
}

// ── Send modal ──
const sendModal = ref<Campaign | null>(null)
const testEmail = ref('')
const batchSize = ref(10)
const sending = ref(false)
const sendResult = ref<{ message: string; error?: boolean } | null>(null)

function openSendModal(c: Campaign) {
  sendModal.value = c
  sendResult.value = null
  testEmail.value = authState.value.user?.email || ''
}

async function sendTest() {
  if (!sendModal.value || !testEmail.value) return
  sending.value = true
  sendResult.value = null
  try {
    await authFetch(`/api/admin/emails/${sendModal.value.id}/send`, {
      method: 'POST',
      body: { testEmail: testEmail.value },
    })
    sendResult.value = { message: `테스트 이메일 발송 완료: ${testEmail.value}` }
  } catch (e: any) {
    sendResult.value = { message: e?.data?.message || '발송 실패', error: true }
  } finally {
    sending.value = false
  }
}

async function sendBatch() {
  if (!sendModal.value) return
  sending.value = true
  sendResult.value = null
  try {
    const res = await authFetch<any>(`/api/admin/emails/${sendModal.value.id}/send`, {
      method: 'POST',
      body: { batchSize: batchSize.value },
    })
    sendResult.value = {
      message: `발송 ${res.sent}건, 실패 ${res.failed}건, 남은 수신자 ${res.remaining}명`,
    }
    await loadCampaigns()
  } catch (e: any) {
    sendResult.value = { message: e?.data?.message || '발송 실패', error: true }
  } finally {
    sending.value = false
  }
}

// ── Recipients ──
interface Recipient {
  id: string; email: string; name: string | null; source: string
  lastSentAt: string | null; createdAt: string
}

const recipients = ref<Recipient[]>([])
const recipientTotal = ref(0)
const recipientsLoading = ref(false)
const recipientSearch = ref('')
const recipientInput = ref('')
const addingRecipients = ref(false)
const addResult = ref('')

let searchTimeout: ReturnType<typeof setTimeout> | null = null

function searchRecipients() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => loadRecipients(), 300)
}

async function loadRecipients() {
  recipientsLoading.value = true
  try {
    const res = await authFetch<any>(`/api/admin/emails/recipients?q=${recipientSearch.value}`)
    recipients.value = res.recipients
    recipientTotal.value = res.total
  } finally {
    recipientsLoading.value = false
  }
}

async function addRecipients() {
  if (!recipientInput.value.trim()) return
  addingRecipients.value = true
  addResult.value = ''

  const lines = recipientInput.value.split('\n').filter(l => l.trim())
  const emails = lines.map(line => {
    const parts = line.split(',').map(s => s.trim())
    if (parts.length >= 2) {
      return { name: parts[0], email: parts[1] }
    }
    return { email: parts[0] }
  }).filter(e => e.email && e.email.includes('@'))

  try {
    const res = await authFetch<any>('/api/admin/emails/recipients', {
      method: 'POST',
      body: { emails },
    })
    addResult.value = `추가 ${res.added}건, 중복 ${res.skipped}건`
    recipientInput.value = ''
    await loadRecipients()
  } catch (e: any) {
    addResult.value = e?.data?.message || '추가 실패'
  } finally {
    addingRecipients.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Init
onMounted(async () => {
  await loadCampaigns()
  await loadRecipients()
})

watch(activeTab, (tab) => {
  if (tab === 'recipients') loadRecipients()
  if (tab === 'campaigns') loadCampaigns()
})
</script>
