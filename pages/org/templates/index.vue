<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">템플릿</h1>
      <button @click="showNew = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
        + 새 템플릿
      </button>
    </div>

    <!-- Preset templates -->
    <div v-if="presets.length" class="mb-8">
      <h2 class="text-lg font-semibold mb-4 text-gray-700">기본 법률 템플릿</h2>
      <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="t in presets"
          :key="t.id"
          class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer border-l-4 border-blue-400"
        >
          <h3 class="font-medium text-sm">{{ t.title }}</h3>
          <p class="text-xs text-gray-400 mt-1">{{ t.category }}</p>
          <p v-if="t.description" class="text-xs text-gray-500 mt-2">{{ t.description }}</p>
        </div>
      </div>
    </div>

    <!-- Custom templates -->
    <div>
      <h2 class="text-lg font-semibold mb-4 text-gray-700">내 템플릿</h2>
      <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="t in customs"
          :key="t.id"
          class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
        >
          <h3 class="font-medium text-sm">{{ t.title }}</h3>
          <p class="text-xs text-gray-500 mt-1">사용: {{ t._count?.documents ?? 0 }}건</p>
          <p class="text-xs text-gray-400 mt-1">{{ t.creator?.name }}</p>
        </div>

        <div v-if="customs.length === 0" class="col-span-full text-center py-8 text-gray-400">
          아직 만든 템플릿이 없습니다.
        </div>
      </div>
    </div>

    <!-- New Template Modal -->
    <div v-if="showNew" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNew = false">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">새 템플릿</h2>
        <form @submit.prevent="createTemplate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">템플릿 이름</label>
            <input v-model="newTpl.title" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <select v-model="newTpl.category" class="w-full px-3 py-2 border rounded-lg">
              <option value="">선택</option>
              <option value="legal">법률</option>
              <option value="general">일반</option>
              <option value="hr">인사</option>
              <option value="nda">NDA</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea v-model="newTpl.description" rows="2" class="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showNew = false" class="px-4 py-2 text-gray-600">취소</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">생성</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '템플릿 - Pactery' })

const { fetchTemplates, orgFetch } = useOrganization()

const templates = ref<any[]>([])
const showNew = ref(false)
const newTpl = reactive({ title: '', category: '', description: '' })

const presets = computed(() => templates.value.filter((t) => t.isPreset))
const customs = computed(() => templates.value.filter((t) => !t.isPreset))

onMounted(async () => {
  try {
    templates.value = await fetchTemplates()
  } catch (e) {
    console.error('Failed to load templates:', e)
  }
})

async function createTemplate() {
  try {
    await orgFetch('/templates', { method: 'POST', body: newTpl })
    showNew.value = false
    Object.assign(newTpl, { title: '', category: '', description: '' })
    templates.value = await fetchTemplates()
  } catch (e: any) {
    alert(e.data?.statusMessage || '생성 실패')
  }
}
</script>
