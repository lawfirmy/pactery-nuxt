<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
      <h3 class="font-semibold mb-1">서명 재요청</h3>
      <p class="text-sm text-gray-500 mb-4"><span class="font-bold text-gray-800">{{ signer.signerName }}</span> 님에게 재요청할 방법을 선택하세요</p>

      <!-- Method Selection -->
      <div v-if="!selectedMethod" class="grid grid-cols-4 gap-2">
        <button
          @click="selectMethod('email')"
          :class="[
            'flex flex-col items-center gap-2 py-4 rounded-xl transition-all',
            hasEmail
              ? 'hover:bg-blue-50 hover:scale-105'
              : 'opacity-30 cursor-default'
          ]"
        >
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-700">메일</span>
        </button>
        <button
          @click="selectMethod('kakao')"
          :class="[
            'flex flex-col items-center gap-2 py-4 rounded-xl transition-all',
            hasPhone
              ? 'hover:bg-yellow-50 hover:scale-105'
              : 'opacity-30 cursor-default'
          ]"
        >
          <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.56-.95 3.6-.98 3.82 0 0-.02.16.08.22.1.06.22.01.22.01.29-.04 3.37-2.2 3.9-2.57.7.1 1.42.15 2.12.15 5.52 0 10-3.58 10-7.94S17.52 3 12 3z"/>
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-700">카톡</span>
        </button>
        <button
          @click="selectMethod('sms')"
          :class="[
            'flex flex-col items-center gap-2 py-4 rounded-xl transition-all',
            hasPhone
              ? 'hover:bg-green-50 hover:scale-105'
              : 'opacity-30 cursor-default'
          ]"
        >
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-700">문자</span>
        </button>
        <button
          @click="selectMethod('phone')"
          :class="[
            'flex flex-col items-center gap-2 py-4 rounded-xl transition-all',
            hasPhone
              ? 'hover:bg-purple-50 hover:scale-105'
              : 'opacity-30 cursor-default'
          ]"
        >
          <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-700">전화</span>
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
          @keyup.enter="selectedMethod !== 'phone' && handleSend()"
        />
        <div class="flex justify-end gap-2">
          <button @click="selectedMethod = null" class="text-sm px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            뒤로
          </button>
          <a
            v-if="selectedMethod === 'phone' && isPhoneValid"
            :href="'tel:' + inputPhone.replace(/[^0-9]/g, '')"
            @click="savePhoneAndClose"
            class="text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-block text-center"
          >
            이 번호로 전화 걸기
          </a>
          <button
            v-else
            @click="handleSend"
            :disabled="!isPhoneValid || sending"
            :class="[
              'text-sm px-4 py-2 text-white rounded-lg disabled:opacity-50',
              selectedMethod === 'kakao' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
            ]"
          >
            {{ sending ? '발송 중...' : phoneInputButtonLabel }}
          </button>
        </div>
      </div>

      <!-- Confirm send (has contact info - editable) -->
      <div v-else-if="selectedMethod === 'email' || selectedMethod === 'sms'">
        <template v-if="selectedMethod === 'email'">
          <label class="text-sm text-gray-500 mb-1.5 block">수신 이메일</label>
          <input
            v-model="editEmail"
            type="email"
            class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
          />
        </template>
        <template v-else>
          <label class="text-sm text-gray-500 mb-1.5 block">수신 전화번호</label>
          <input
            v-model="editPhone"
            type="tel"
            class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-3"
          />
        </template>
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
        <label class="text-sm text-gray-500 mb-1.5 block">전화번호</label>
        <input
          v-model="editPhone"
          type="tel"
          class="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-3"
        />
        <div class="flex justify-end gap-2">
          <button @click="selectedMethod = null" class="text-sm px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            뒤로
          </button>
          <a
            :href="'tel:' + editPhone"
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
const editEmail = ref(props.signer.signerEmail || '')
const editPhone = ref(props.signer.signerPhone || '')
const sending = ref(false)

const hasEmail = computed(() => !!props.signer.signerEmail)
const hasPhone = computed(() => !!props.signer.signerPhone)
const isEmailValid = computed(() => inputEmail.value.includes('@') && inputEmail.value.includes('.'))
const isPhoneValid = computed(() => inputPhone.value.replace(/[^0-9]/g, '').length >= 10)
const needsPhoneInput = computed(() =>
  (selectedMethod.value === 'sms' || selectedMethod.value === 'kakao' || selectedMethod.value === 'phone') && !props.signer.signerPhone
)
const phoneInputButtonLabel = computed(() => {
  if (selectedMethod.value === 'kakao') return '이 번호로 카카오톡 보내기'
  return '이 번호로 문자 보내기'
})

function selectMethod(method: string) {
  selectedMethod.value = method
}

async function savePhoneAndClose() {
  // Save the phone number to the signer record via API, then close
  try {
    await orgFetch(`/documents/${props.docId}/signers/${props.signer.id}/resend`, {
      method: 'POST',
      body: { method: 'phone', phone: inputPhone.value.replace(/[^0-9]/g, '') },
    })
  } catch {
    // Phone call initiated regardless; saving phone is best-effort
  }
  emit('sent', 'phone')
  emit('close')
}

async function handleSend() {
  if (sending.value) return
  sending.value = true

  try {
    const payload: Record<string, string> = { method: selectedMethod.value! }

    if (selectedMethod.value === 'email') {
      // Use edited email if available, fallback to input email (when signer had no email)
      const email = props.signer.signerEmail ? editEmail.value.trim() : inputEmail.value.trim()
      if (email) payload.email = email
    }
    if (selectedMethod.value === 'sms' || selectedMethod.value === 'kakao' || selectedMethod.value === 'phone') {
      const phone = props.signer.signerPhone ? editPhone.value.replace(/[^0-9]/g, '') : inputPhone.value.replace(/[^0-9]/g, '')
      if (phone) payload.phone = phone
    }

    const resendUrl = `/documents/${props.docId}/signers/${props.signer.id}/resend`
    console.info('[ResendModal] resend request start', {
      url: resendUrl,
      signerId: props.signer.id,
      docId: props.docId,
      method: selectedMethod.value,
      payload,
    })

    const response = await orgFetch(resendUrl, {
      method: 'POST',
      body: payload,
    })
    console.info('[ResendModal] resend request success', {
      url: resendUrl,
      signerId: props.signer.id,
      method: selectedMethod.value,
      response,
    })

    const methodLabels: Record<string, string> = { email: '메일', sms: '문자', kakao: '카카오톡', phone: '전화' }
    toast.success(`${methodLabels[selectedMethod.value!] || '재요청'}이 발송되었습니다`)
    emit('sent', selectedMethod.value!)
    emit('close')
  } catch (e: any) {
    console.error('[ResendModal] resend request failed', {
      signerId: props.signer.id,
      docId: props.docId,
      method: selectedMethod.value,
      error: e,
      statusCode: e?.statusCode,
      statusMessage: e?.data?.statusMessage,
    })
    toast.error(e.data?.statusMessage || '발송에 실패했습니다')
  } finally {
    sending.value = false
  }
}
</script>
