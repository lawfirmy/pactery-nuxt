<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
      <h3 class="font-semibold mb-1">서명 재요청</h3>
      <p class="text-sm text-gray-500 mb-4">{{ signer.signerName }}에게 재요청할 방법을 선택하세요</p>

      <!-- Method Selection -->
      <div v-if="!selectedMethod" class="grid grid-cols-2 gap-3">
        <button
          @click="selectMethod('email')"
          :class="[
            'flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors',
            hasEmail
              ? 'hover:bg-blue-50 hover:border-blue-300'
              : 'opacity-40 cursor-default'
          ]"
        >
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span class="text-sm font-medium">메일</span>
        </button>
        <button
          @click="selectMethod('kakao')"
          :class="[
            'flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors',
            hasPhone
              ? 'hover:bg-yellow-50 hover:border-yellow-300'
              : 'opacity-40 cursor-default'
          ]"
        >
          <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.56-.95 3.6-.98 3.82 0 0-.02.16.08.22.1.06.22.01.22.01.29-.04 3.37-2.2 3.9-2.57.7.1 1.42.15 2.12.15 5.52 0 10-3.58 10-7.94S17.52 3 12 3z"/>
          </svg>
          <span class="text-sm font-medium">카톡</span>
        </button>
        <button
          @click="selectMethod('sms')"
          :class="[
            'flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors',
            hasPhone
              ? 'hover:bg-green-50 hover:border-green-300'
              : 'opacity-40 cursor-default'
          ]"
        >
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
          <span class="text-sm font-medium">문자</span>
        </button>
        <button
          @click="selectMethod('phone')"
          :class="[
            'flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors',
            hasPhone
              ? 'hover:bg-purple-50 hover:border-purple-300'
              : 'opacity-40 cursor-default'
          ]"
        >
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <span class="text-sm font-medium">전화</span>
        </button>
      </div>

      <!-- Email Input (if no email on signer) -->
      <div v-else-if="selectedMethod === 'email' && !signer.signerEmail">
        <p class="text-sm text-orange-600 mb-2">이메일 정보가 없습니다. 입력해주세요.</p>
        <label class="text-sm text-gray-600 mb-1 block">이메일 주소 입력</label>
        <input
          v-model="inputEmail"
          type="email"
          placeholder="example@email.com"
          class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
          @keyup.enter="handleSend"
        />
        <div class="flex justify-end gap-2">
          <button @click="selectedMethod = null" class="text-sm px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            뒤로
          </button>
          <button
            @click="handleSend"
            :disabled="!isEmailValid || sending"
            class="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ sending ? '발송 중...' : '이 주소로 메일 보내기' }}
          </button>
        </div>
      </div>

      <!-- Phone number input (sms/kakao/phone without phone on signer) -->
      <div v-else-if="needsPhoneInput">
        <p class="text-sm text-orange-600 mb-2">전화번호 정보가 없습니다. 입력해주세요.</p>
        <label class="text-sm text-gray-600 mb-1 block">전화번호 입력</label>
        <input
          v-model="inputPhone"
          type="tel"
          placeholder="010-0000-0000"
          class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-3"
          @keyup.enter="handleSend"
        />
        <div class="flex justify-end gap-2">
          <button @click="selectedMethod = null" class="text-sm px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            뒤로
          </button>
          <button
            @click="handleSend"
            :disabled="!isPhoneValid || sending"
            class="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {{ sending ? '발송 중...' : '이 번호로 문자 보내기' }}
          </button>
        </div>
      </div>

      <!-- Confirm send (has contact info already) -->
      <div v-else-if="selectedMethod === 'email' || selectedMethod === 'sms'">
        <p class="text-sm text-gray-600 mb-3">
          <template v-if="selectedMethod === 'email'">
            <span class="font-medium">{{ signer.signerEmail }}</span>으로 메일을 발송합니다.
          </template>
          <template v-else>
            <span class="font-medium">{{ signer.signerPhone }}</span>으로 문자를 발송합니다.
          </template>
        </p>
        <div class="flex justify-end gap-2">
          <button @click="selectedMethod = null" class="text-sm px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            뒤로
          </button>
          <button
            @click="handleSend"
            :disabled="sending"
            class="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ sending ? '발송 중...' : '발송' }}
          </button>
        </div>
      </div>

      <!-- Kakao placeholder (has phone) -->
      <div v-else-if="selectedMethod === 'kakao'">
        <p class="text-sm text-gray-500 mb-3">
          카카오톡 발송 기능은 준비 중입니다.
        </p>
        <div class="flex justify-end">
          <button @click="selectedMethod = null" class="text-sm px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            뒤로
          </button>
        </div>
      </div>

      <!-- Phone call (has phone) -->
      <div v-else-if="selectedMethod === 'phone'">
        <p class="text-sm text-gray-600 mb-3">
          <span class="font-medium">{{ signer.signerPhone }}</span>으로 전화를 겁니다.
        </p>
        <div class="flex justify-end gap-2">
          <button @click="selectedMethod = null" class="text-sm px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            뒤로
          </button>
          <a
            :href="'tel:' + signer.signerPhone"
            class="text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-block text-center"
          >
            전화 걸기
          </a>
        </div>
      </div>

      <!-- Close button -->
      <button
        v-if="!selectedMethod"
        @click="$emit('close')"
        class="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 py-2"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Signer {
  id: string
  signerName: string
  signerEmail: string
  signerPhone?: string | null
}

const props = defineProps<{
  signer: Signer
  docId: string
}>()

const emit = defineEmits<{
  close: []
  sent: [method: string]
}>()

const { orgFetch } = useOrganization()
const toast = useToast()

const selectedMethod = ref<string | null>(null)
const inputEmail = ref('')
const inputPhone = ref('')
const sending = ref(false)

const hasEmail = computed(() => !!props.signer.signerEmail)
const hasPhone = computed(() => !!props.signer.signerPhone)
const isEmailValid = computed(() => inputEmail.value.includes('@') && inputEmail.value.includes('.'))
const isPhoneValid = computed(() => inputPhone.value.replace(/[^0-9]/g, '').length >= 10)
const needsPhoneInput = computed(() =>
  (selectedMethod.value === 'sms' || selectedMethod.value === 'kakao' || selectedMethod.value === 'phone') && !props.signer.signerPhone
)

function selectMethod(method: string) {
  selectedMethod.value = method
}

async function handleSend() {
  if (sending.value) return
  sending.value = true

  try {
    const payload: Record<string, string> = { method: selectedMethod.value! }

    if (selectedMethod.value === 'email' && !props.signer.signerEmail) {
      payload.email = inputEmail.value.trim()
    }
    if ((selectedMethod.value === 'sms' || selectedMethod.value === 'kakao' || selectedMethod.value === 'phone') && !props.signer.signerPhone) {
      payload.phone = inputPhone.value.replace(/[^0-9]/g, '')
    }

    await orgFetch(`/documents/${props.docId}/signers/${props.signer.id}/resend`, {
      method: 'POST',
      body: payload,
    })

    const methodLabels: Record<string, string> = { email: '메일', sms: '문자', kakao: '카카오톡', phone: '전화' }
    toast.success(`${methodLabels[selectedMethod.value!] || '재요청'}이 발송되었습니다`)
    emit('sent', selectedMethod.value!)
    emit('close')
  } catch (e: any) {
    toast.error(e.data?.statusMessage || '발송에 실패했습니다')
  } finally {
    sending.value = false
  }
}
</script>
