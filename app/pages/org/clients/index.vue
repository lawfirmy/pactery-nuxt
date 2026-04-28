<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">의뢰인 관리</h1>
      <button @click="showNew = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
        + 의뢰인 등록
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="이름, 이메일, 회사명으로 검색..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        @keyup.enter="loadClients"
      />
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">회사</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">사건</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="c in clients" :key="c.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium">{{ c.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ c.email || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ c.phone || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ c.company || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ c._count?.cases ?? 0 }}건</td>
          </tr>
        </tbody>
      </table>

      <div v-if="clients.length === 0" class="text-center py-12 text-gray-400">
        등록된 의뢰인이 없습니다.
      </div>
    </div>

    <!-- New Client Modal -->
    <div v-if="showNew" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNew = false">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">의뢰인 등록</h2>
        <form @submit.prevent="createClient" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input v-model="newClient.name" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input v-model="newClient.email" type="email" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">연락처</label>
            <input v-model="newClient.phone" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">회사</label>
            <input v-model="newClient.company" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">메모</label>
            <textarea v-model="newClient.memo" rows="2" class="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showNew = false" class="px-4 py-2 text-gray-600">취소</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">등록</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '의뢰인 관리 - Pactery' })

const { fetchClients, orgFetch } = useOrganization()

const search = ref('')
const clients = ref<any[]>([])
const showNew = ref(false)
const newClient = reactive({ name: '', email: '', phone: '', company: '', memo: '' })

onMounted(() => loadClients())

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

async function createClient() {
  try {
    await orgFetch('/clients', { method: 'POST', body: newClient })
    showNew.value = false
    Object.assign(newClient, { name: '', email: '', phone: '', company: '', memo: '' })
    await loadClients()
  } catch (e: any) {
    useToast().error(e.data?.statusMessage || '등록 실패')
  }
}
</script>
