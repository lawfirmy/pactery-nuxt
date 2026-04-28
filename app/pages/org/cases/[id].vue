<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <NuxtLink to="/org/cases" class="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; 사건 목록</NuxtLink>

    <div v-if="loading" class="text-center py-20 text-gray-400">불러오는 중...</div>

    <template v-else-if="caseItem">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold">{{ caseItem.title }}</h1>
            <span :class="statusClass(caseItem.status)" class="text-xs px-2 py-1 rounded-full">
              {{ statusLabel(caseItem.status) }}
            </span>
          </div>
          <p v-if="caseItem.caseNumber" class="text-sm text-blue-600 font-mono mt-1">{{ caseItem.caseNumber }}</p>
          <p v-if="caseItem.description" class="text-sm text-gray-500 mt-2">{{ caseItem.description }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="showNewDoc = true" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            + 문서 추가
          </button>
          <select v-model="caseItem.status" @change="updateStatus" class="text-sm border rounded-lg px-3 py-2">
            <option value="active">진행 중</option>
            <option value="closed">종결</option>
            <option value="archived">보관</option>
          </select>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Document timeline -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm p-5">
            <h2 class="font-semibold mb-4">문서 타임라인 ({{ caseItem.documents.length }}건)</h2>

            <div v-if="caseItem.documents.length === 0" class="text-center py-8 text-gray-400">
              이 사건에 연결된 문서가 없습니다.
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="doc in caseItem.documents"
                :key="doc.id"
                class="flex gap-4 group cursor-pointer"
                @click="navigateTo(`/org/documents/${doc.id}`)"
              >
                <div class="flex flex-col items-center">
                  <div :class="docDotClass(doc.status)" class="w-3 h-3 rounded-full mt-1.5"></div>
                  <div class="w-px flex-1 bg-gray-200 group-last:hidden"></div>
                </div>
                <div class="flex-1 pb-4 border-b group-last:border-0">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium group-hover:text-blue-600">{{ doc.title }}</h3>
                    <span :class="docStatusClass(doc.status)" class="text-xs px-2 py-0.5 rounded-full">
                      {{ docStatusLabel(doc.status) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ doc.creator?.name }} | {{ formatDate(doc.createdAt) }}
                  </p>
                  <div v-if="doc.signRequests.length" class="flex gap-2 mt-2">
                    <span
                      v-for="sr in doc.signRequests"
                      :key="sr.id"
                      :class="sr.status === 'signed' ? 'text-green-600' : 'text-gray-400'"
                      class="text-xs"
                    >
                      {{ sr.signerName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
          <!-- Client info -->
          <div class="bg-white rounded-xl shadow-sm p-5">
            <h2 class="font-semibold mb-3">의뢰인</h2>
            <template v-if="caseItem.client">
              <p class="text-sm font-medium">{{ caseItem.client.name }}</p>
              <p v-if="caseItem.client.email" class="text-xs text-gray-400">{{ caseItem.client.email }}</p>
              <p v-if="caseItem.client.phone" class="text-xs text-gray-400">{{ caseItem.client.phone }}</p>
            </template>
            <p v-else class="text-sm text-gray-400">미지정</p>
          </div>

          <!-- Stats -->
          <div class="bg-white rounded-xl shadow-sm p-5">
            <h2 class="font-semibold mb-3">요약</h2>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-500">총 문서</dt>
                <dd>{{ caseItem.documents.length }}건</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">완료</dt>
                <dd class="text-green-600">{{ completedCount }}건</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">서명 대기</dt>
                <dd class="text-yellow-600">{{ pendingCount }}건</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- New doc modal -->
      <div v-if="showNewDoc" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNewDoc = false">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <h2 class="text-lg font-semibold mb-4">이 사건에 문서 추가</h2>
          <form @submit.prevent="createDocForCase" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">문서 제목</label>
              <input v-model="newDocTitle" required class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div class="flex justify-end gap-3">
              <button type="button" @click="showNewDoc = false" class="px-4 py-2 text-gray-600">취소</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">생성</button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '사건 상세 - Pactery' })

const route = useRoute()
const caseId = route.params.id as string
const { orgFetch, createDocument } = useOrganization()

const loading = ref(true)
const caseItem = ref<any>(null)
const showNewDoc = ref(false)
const newDocTitle = ref('')

const completedCount = computed(() => caseItem.value?.documents.filter((d: any) => d.status === 'completed').length || 0)
const pendingCount = computed(() => caseItem.value?.documents.filter((d: any) => d.status === 'pending' || d.status === 'partially_signed').length || 0)

onMounted(async () => {
  try {
    caseItem.value = await orgFetch(`/cases/${caseId}`)
    useHead({ title: `${caseItem.value.title} - Pactery` })
  } catch (e) {
    console.error('Failed to load case:', e)
  } finally {
    loading.value = false
  }
})

async function updateStatus() {
  try {
    await orgFetch(`/cases/${caseId}`, { method: 'PATCH', body: { status: caseItem.value.status } })
  } catch (e: any) {
    useToast().error(e.data?.statusMessage || '상태 변경 실패')
  }
}

async function createDocForCase() {
  try {
    const doc = await createDocument({ title: newDocTitle.value, caseId })
    showNewDoc.value = false
    newDocTitle.value = ''
    navigateTo(`/org/documents/${doc.id}`)
  } catch (e: any) {
    useToast().error(e.data?.statusMessage || '문서 생성 실패')
  }
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('ko-KR') }
function statusLabel(s: string) { return { active: '진행 중', closed: '종결', archived: '보관' }[s] || s }
function statusClass(s: string) { return { active: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-700', archived: 'bg-gray-50 text-gray-500' }[s] || 'bg-gray-100' }
function docStatusLabel(s: string) { return { draft: '초안', pending: '대기', partially_signed: '부분서명', completed: '완료', rejected: '거절' }[s] || s }
function docStatusClass(s: string) { return { draft: 'bg-gray-100 text-gray-700', pending: 'bg-yellow-100 text-yellow-800', completed: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' }[s] || 'bg-gray-100' }
function docDotClass(s: string) { return { draft: 'bg-gray-400', pending: 'bg-yellow-400', partially_signed: 'bg-blue-400', completed: 'bg-green-400', rejected: 'bg-red-400' }[s] || 'bg-gray-400' }
</script>
