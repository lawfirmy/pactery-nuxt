<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">조직 설정</h1>

    <div class="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">조직명</label>
        <input v-model="form.name" class="w-full px-3 py-2 border rounded-lg" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
        <input v-model="form.businessNumber" class="w-full px-3 py-2 border rounded-lg" placeholder="000-00-00000" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">대표자</label>
        <input v-model="form.representative" class="w-full px-3 py-2 border rounded-lg" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">브랜드 색상</label>
        <input v-model="form.primaryColor" type="color" class="w-16 h-10 border rounded cursor-pointer" />
      </div>

      <button @click="saveSettings" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        저장
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '설정 - Pactery' })

const { orgFetch, orgId } = useOrganization()

const form = reactive({
  name: '',
  businessNumber: '',
  representative: '',
  primaryColor: '#2563eb',
})

onMounted(async () => {
  try {
    const org = await orgFetch<any>('')
    form.name = org.name || ''
    form.businessNumber = org.businessNumber || ''
    form.representative = org.representative || ''
    form.primaryColor = org.primaryColor || '#2563eb'
  } catch (e) {
    console.error('Failed to load org settings:', e)
  }
})

async function saveSettings() {
  try {
    await orgFetch('', { method: 'PATCH', body: form })
    alert('저장되었습니다')
  } catch (e: any) {
    alert(e.data?.statusMessage || '저장 실패')
  }
}
</script>
