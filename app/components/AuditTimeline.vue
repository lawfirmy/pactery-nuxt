<template>
  <div class="bg-white rounded-xl shadow-sm p-5">
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-semibold">감사추적</h2>
      <!-- Filter -->
      <select
        v-if="signers.length > 0"
        v-model="filterSignerId"
        class="text-xs border rounded px-2 py-1 text-gray-600"
      >
        <option value="">전체</option>
        <option v-for="sr in signers" :key="sr.id" :value="sr.id">
          {{ sr.signerName }}
        </option>
      </select>
    </div>

    <div class="space-y-0">
      <div
        v-for="(log, idx) in filteredLogs"
        :key="log.id"
        class="flex gap-3"
      >
        <div class="flex flex-col items-center">
          <div :class="dotClass(log.eventType)" class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"></div>
          <div v-if="idx < filteredLogs.length - 1" class="w-px flex-1 bg-gray-200"></div>
        </div>
        <div class="pb-3 min-w-0">
          <p class="text-sm font-medium">{{ eventLabel(log.eventType) }}</p>
          <p v-if="log.signerName" class="text-xs text-gray-500">{{ log.signerName }}</p>
          <p class="text-xs text-gray-400">
            {{ formatDateTime(log.createdAt) }}
            <span v-if="log.ipAddress"> · {{ log.ipAddress }}</span>
          </p>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="filteredLogs.length === 0" class="text-center py-4 text-gray-400 text-sm">
        기록이 없습니다
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AuditLog {
  id: string
  eventType: string
  signRequestId?: string | null
  ipAddress?: string | null
  createdAt: string
  metadata?: any
  signerName?: string
}

interface SignRequest {
  id: string
  signerName: string
}

const props = defineProps<{
  logs: AuditLog[]
  signers: SignRequest[]
}>()

const filterSignerId = ref('')

const filteredLogs = computed(() => {
  if (!filterSignerId.value) return props.logs
  return props.logs.filter(log => log.signRequestId === filterSignerId.value)
})

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('ko-KR')
}

function eventLabel(t: string) {
  return {
    created: '문서 생성',
    sent: '서명요청 발송',
    opened: '문서 열람',
    signed: '서명 완료',
    rejected: '서명 거절',
    downloaded: '다운로드',
    printed: '인쇄',
    signer_added: '서명자 추가',
    signer_removed: '서명자 삭제',
    reminder_sent: '리마인더 발송',
  }[t] || t
}

function dotClass(t: string) {
  return {
    created: 'bg-gray-400',
    sent: 'bg-blue-400',
    opened: 'bg-yellow-400',
    signed: 'bg-green-400',
    rejected: 'bg-red-400',
    downloaded: 'bg-purple-400',
    signer_added: 'bg-indigo-400',
    signer_removed: 'bg-orange-400',
    reminder_sent: 'bg-cyan-400',
  }[t] || 'bg-gray-400'
}
</script>
