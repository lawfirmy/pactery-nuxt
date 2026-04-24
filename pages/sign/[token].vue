<template>
  <div>
    <div v-if="loading" class="text-center py-20 text-gray-400">문서를 불러오는 중...</div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-500 text-lg">{{ error }}</p>
      <p class="text-gray-400 mt-2">링크가 유효하지 않거나 이미 서명이 완료되었습니다.</p>
    </div>

    <div v-else-if="signData" class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <div v-if="signData.document.org.logoUrl" class="w-10 h-10 rounded-full overflow-hidden">
            <img :src="signData.document.org.logoUrl" class="w-full h-full object-cover" />
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ signData.document.org.name }}에서 서명을 요청했습니다</p>
            <h1 class="text-xl font-bold">{{ signData.document.title }}</h1>
          </div>
        </div>
        <p class="text-sm text-gray-600">
          안녕하세요, <strong>{{ signData.signerName }}</strong>님. 아래 문서를 확인하고 서명해주세요.
        </p>
      </div>

      <!-- PDF Viewer with field overlays -->
      <div class="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
        <ClientOnly>
          <PdfViewer :src="pdfUrl" height="500px" ref="pdfViewerRef">
            <template #overlay="{ page, scale }">
              <FieldOverlay
                :fields="signData.fields"
                :page="page - 1"
                :scale="scale"
                :interactive="true"
                :highlight-signer-id="signData.id"
                @field-click="onFieldClick"
              />
            </template>
          </PdfViewer>
        </ClientOnly>
      </div>

      <!-- Signature area -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-4">
        <h2 class="text-lg font-semibold mb-4">서명하기</h2>
        <p class="text-sm text-gray-500 mb-4">
          서명 필드 {{ signedFieldCount }}/{{ totalFieldCount }}개 완료
        </p>
        <SignPad @confirm="onSignatureConfirm" />
      </div>

      <!-- Submit -->
      <div class="flex justify-end gap-3 mb-8">
        <button
          @click="handleReject"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          서명 거절
        </button>
        <button
          @click="handleSign"
          :disabled="submitting || !allFieldsSigned"
          class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ submitting ? '처리 중...' : '서명 제출' }}
        </button>
      </div>

      <!-- Completion overlay -->
      <div v-if="completed" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-8 text-center max-w-md">
          <div class="text-5xl mb-4">&#x2705;</div>
          <h2 class="text-2xl font-bold mb-2">서명 완료!</h2>
          <p class="text-gray-500 mb-6">서명이 성공적으로 제출되었습니다.</p>
          <NuxtLink to="/my" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            내 서명 이력 보기
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'sign' })

const route = useRoute()
const token = route.params.token as string
const { state: authState } = useAuth()

const loading = ref(true)
const error = ref('')
const signData = ref<any>(null)
const submitting = ref(false)
const completed = ref(false)
const pdfViewerRef = ref()
const signatureValue = ref('')
const fieldValues = ref<Record<string, string>>({})

const pdfUrl = computed(() => {
  if (!signData.value?.document?.originalFileKey) return null
  return `/api/documents/${signData.value.document.id}/pdf`
})

const totalFieldCount = computed(() => signData.value?.fields?.length || 0)
const signedFieldCount = computed(() => Object.keys(fieldValues.value).length)
const allFieldsSigned = computed(() => {
  if (!signData.value?.fields?.length) return !!signatureValue.value
  const requiredFields = signData.value.fields.filter((f: any) => f.required)
  return requiredFields.every((f: any) => fieldValues.value[f.id])
})

onMounted(async () => {
  try {
    signData.value = await $fetch<any>(`/api/signatures/${token}`)
    useHead({ title: `${signData.value.document.title} - 서명` })
  } catch (e: any) {
    error.value = e.data?.statusMessage || '문서를 불러올 수 없습니다'
  } finally {
    loading.value = false
  }
})

function onFieldClick(field: any) {
  // Scroll to signature pad or highlight field
}

function onSignatureConfirm(data: { type: string; value: string }) {
  signatureValue.value = data.value
  // Apply to all unfilled fields for this signer
  if (signData.value?.fields) {
    for (const field of signData.value.fields) {
      if (!fieldValues.value[field.id]) {
        fieldValues.value[field.id] = data.value
        field.value = data.value
      }
    }
  }
}

async function handleSign() {
  if (!signatureValue.value && !allFieldsSigned.value) {
    alert('서명을 입력해주세요')
    return
  }

  submitting.value = true
  try {
    const fields = (signData.value.fields || []).map((f: any) => ({
      fieldId: f.id,
      value: fieldValues.value[f.id] || signatureValue.value,
    }))

    const result = await $fetch<any>(`/api/signatures/${token}/sign`, {
      method: 'POST',
      body: { fields },
    })

    completed.value = true
  } catch (e: any) {
    alert(e.data?.statusMessage || '서명 처리 중 오류가 발생했습니다')
  } finally {
    submitting.value = false
  }
}

async function handleReject() {
  if (!confirm('서명을 거절하시겠습니까? 이 작업은 취소할 수 없습니다.')) return

  try {
    await $fetch(`/api/signatures/${token}/reject`, { method: 'POST' })
    alert('서명이 거절되었습니다.')
    navigateTo('/')
  } catch (e: any) {
    alert(e.data?.statusMessage || '처리 중 오류가 발생했습니다')
  }
}
</script>
