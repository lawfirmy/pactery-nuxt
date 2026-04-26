<template>
  <div class="absolute inset-0 pointer-events-none">
    <div
      v-for="field in visibleFields"
      :key="field.id"
      class="absolute border-2 rounded flex items-center justify-center pointer-events-auto"
      :class="fieldClasses(field)"
      :style="fieldStyle(field)"
      @click="$emit('fieldClick', field)"
    >
      <!-- Show value if filled -->
      <template v-if="field.value">
        <img
          v-if="field.type === 'signature' && field.value.startsWith('data:')"
          :src="field.value"
          class="w-full h-full object-contain"
        />
        <span v-else class="text-xs text-gray-700 truncate px-1">{{ field.value }}</span>
      </template>

      <!-- Show placeholder if not filled -->
      <template v-else>
        <span v-if="interactive" class="text-xs text-gray-400 cursor-pointer">
          {{ placeholder(field) }}
        </span>
        <span v-else class="text-xs text-gray-300">
          {{ placeholder(field) }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SignField {
  id: string
  type: string
  page: number
  x: number
  y: number
  width: number
  height: number
  value?: string
  required?: boolean
  signRequestId?: string
}

const props = defineProps<{
  fields: SignField[]
  page: number
  scale: number
  interactive?: boolean
  highlightSignerId?: string
}>()

defineEmits<{
  (e: 'fieldClick', field: SignField): void
}>()

const visibleFields = computed(() =>
  props.fields.filter((f) => f.page === props.page),
)

function fieldStyle(field: SignField) {
  return {
    left: `${field.x * props.scale}px`,
    top: `${field.y * props.scale}px`,
    width: `${field.width * props.scale}px`,
    height: `${field.height * props.scale}px`,
  }
}

function fieldClasses(field: SignField) {
  const isHighlighted = props.highlightSignerId && field.signRequestId === props.highlightSignerId
  if (field.value) {
    return 'border-green-300 bg-green-50/30'
  }
  if (isHighlighted) {
    return 'border-blue-500 bg-blue-100/50 animate-pulse'
  }
  return 'border-gray-300 bg-gray-50/30'
}

function placeholder(field: SignField) {
  const map: Record<string, string> = {
    signature: '서명',
    initial: '이니셜',
    date: '날짜',
    text: '텍스트',
    checkbox: '☐',
  }
  return map[field.type] || field.type
}
</script>
