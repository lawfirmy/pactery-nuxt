<template>
  <div class="max-w-5xl mx-auto py-8 px-4">
    <NuxtLink to="/org/clients" class="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; 의뢰인 목록</NuxtLink>

    <div v-if="loading" class="text-center py-20 text-gray-400">불러오는 중...</div>

    <template v-else-if="client">
      <!-- Client info card -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-bold">{{ client.name }}</h1>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span v-if="client.email">{{ client.email }}</span>
              <span v-if="client.phone">{{ client.phone }}</span>
              <span v-if="client.company">{{ client.company }}</span>
            </div>
          </div>
          <button @click="editing = !editing" class="text-sm text-blue-600 hover:underline">
            {{ editing ? '취소' : '수정' }}
          </button>
        </div>

        <!-- Edit form -->
        <form v-if="editing" @submit.prevent="saveClient" class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input v-model="editForm.name" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input v-model="editForm.email" type="email" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">연락처</label>
            <input v-model="editForm.phone" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">회사</label>
            <input v-model="editForm.company" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">메모</label>
            <textarea v-model="editForm.memo" rows="2" class="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          <div class="col-span-2 flex justify-end">
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">저장</button>
          </div>
        </form>

        <p v-if="client.memo && !editing" class="text-sm text-gray-500 mt-3 border-t pt-3">{{ client.memo }}</p>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Cases -->
        <div class="bg-white rounded-xl shadow-sm p-5">
          <h2 class="font-semibold mb-3">관련 사건 ({{ client.cases.length }}건)</h2>
          <div v-if="client.cases.length === 0" class="text-sm text-gray-400 py-4">관련 사건 없음</div>
          <div v-else class="space-y-2">
            <div
              v-for="c in client.cases"
              :key="c.id"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="navigateTo(`/org/cases/${c.id}`)"
            >
              <div>
                <p class="text-sm font-medium">{{ c.title }}</p>
                <p v-if="c.caseNumber" class="text-xs text-blue-600 font-mono">{{ c.caseNumber }}</p>
              </div>
              <span class="text-xs text-gray-400">{{ c._count?.documents }}건</span>
            </div>
          </div>
        </div>

        <!-- Signature history -->
        <div class="bg-white rounded-xl shadow-sm p-5">
          <h2 class="font-semibold mb-3">서명 이력 ({{ client.signHistory?.length || 0 }}건)</h2>
          <div v-if="!client.signHistory?.length" class="text-sm text-gray-400 py-4">서명 이력 없음</div>
          <div v-else class="space-y-2">
            <div
              v-for="sr in client.signHistory"
              :key="sr.id"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="navigateTo(`/org/documents/${sr.document.id}`)"
            >
              <div>
                <p class="text-sm font-medium">{{ sr.document.title }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(sr.createdAt) }}</p>
              </div>
              <span :class="srClass(sr.status)" class="text-xs px-2 py-0.5 rounded-full">
                {{ srLabel(sr.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '의뢰인 상세 - Pactery' })

const route = useRoute()
const clientId = route.params.id as string
const { orgFetch } = useOrganization()

const loading = ref(true)
const client = ref<any>(null)
const editing = ref(false)
const editForm = reactive({ name: '', email: '', phone: '', company: '', memo: '' })

onMounted(async () => {
  try {
    client.value = await orgFetch(`/clients/${clientId}`)
    Object.assign(editForm, {
      name: client.value.name || '',
      email: client.value.email || '',
      phone: client.value.phone || '',
      company: client.value.company || '',
      memo: client.value.memo || '',
    })
  } catch (e) {
    console.error('Failed to load client:', e)
  } finally {
    loading.value = false
  }
})

async function saveClient() {
  try {
    await orgFetch(`/clients/${clientId}`, { method: 'PATCH', body: editForm })
    client.value = { ...client.value, ...editForm }
    editing.value = false
  } catch (e: any) {
    useToast().error(e.data?.statusMessage || '저장 실패')
  }
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('ko-KR') }
function srLabel(s: string) { return { pending: '대기', signed: '완료', rejected: '거절' }[s] || s }
function srClass(s: string) { return { pending: 'bg-yellow-100 text-yellow-800', signed: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' }[s] || 'bg-gray-100' }
</script>
