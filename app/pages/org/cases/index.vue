<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">사건 관리</h1>
      <button @click="showNew = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
        + 새 사건
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="사건번호 또는 제목으로 검색..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        @keyup.enter="loadCases"
      />
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="c in cases"
        :key="c.id"
        class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
      >
        <div class="flex items-start justify-between">
          <div>
            <p v-if="c.caseNumber" class="text-xs text-blue-600 font-mono mb-1">{{ c.caseNumber }}</p>
            <h3 class="font-medium">{{ c.title }}</h3>
            <p v-if="c.client" class="text-sm text-gray-500 mt-1">{{ c.client.name }}</p>
          </div>
          <span class="text-xs text-gray-400">{{ c._count?.documents ?? 0 }}건</span>
        </div>
      </div>

      <div v-if="cases.length === 0" class="col-span-full text-center py-12 text-gray-400">
        사건이 없습니다.
      </div>
    </div>

    <!-- New Case Modal -->
    <div v-if="showNew" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNew = false">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">새 사건 등록</h2>
        <form @submit.prevent="createCase" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">사건번호 (선택)</label>
            <input v-model="newCase.caseNumber" class="w-full px-3 py-2 border rounded-lg" placeholder="2024가합12345" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input v-model="newCase.title" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">설명 (선택)</label>
            <textarea v-model="newCase.description" rows="2" class="w-full px-3 py-2 border rounded-lg"></textarea>
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
useHead({ title: '사건 관리 - Pactery' })

const { fetchCases, orgFetch } = useOrganization()

const search = ref('')
const cases = ref<any[]>([])
const showNew = ref(false)
const newCase = reactive({ caseNumber: '', title: '', description: '' })

onMounted(() => loadCases())

async function loadCases() {
  try {
    const params: Record<string, any> = {}
    if (search.value) params.search = search.value
    const data = await fetchCases(params)
    cases.value = data.cases
  } catch (e) {
    console.error('Failed to load cases:', e)
  }
}

async function createCase() {
  try {
    await orgFetch('/cases', { method: 'POST', body: newCase })
    showNew.value = false
    newCase.caseNumber = ''
    newCase.title = ''
    newCase.description = ''
    await loadCases()
  } catch (e: any) {
    alert(e.data?.statusMessage || '사건 등록 실패')
  }
}
</script>
