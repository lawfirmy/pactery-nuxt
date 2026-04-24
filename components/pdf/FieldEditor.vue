<template>
  <div class="field-editor">
    <!-- Field palette -->
    <div class="flex items-center gap-2 bg-white border-b px-4 py-2">
      <span class="text-sm text-gray-500 mr-2">필드 추가:</span>
      <button
        v-for="ft in fieldTypes"
        :key="ft.type"
        @click="addField(ft.type)"
        class="flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
        :class="{ 'ring-2 ring-blue-400': selectedFieldType === ft.type }"
      >
        <span>{{ ft.icon }}</span>
        <span>{{ ft.label }}</span>
      </button>
      <button
        @click="$emit('aiDetect')"
        class="flex items-center gap-1 px-3 py-1.5 text-xs border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition ml-2"
      >
        <span>&#x2728;</span>
        <span>AI 자동감지</span>
      </button>
      <div class="flex-1"></div>
      <div v-if="selectedField" class="flex items-center gap-2">
        <select
          v-model="selectedField.signRequestId"
          class="text-xs border rounded px-2 py-1"
        >
          <option :value="undefined">서명자 미지정</option>
          <option v-for="sr in signers" :key="sr.id" :value="sr.id">
            {{ sr.signerName }}
          </option>
        </select>
        <label class="flex items-center gap-1 text-xs">
          <input type="checkbox" v-model="selectedField.required" />
          필수
        </label>
        <button @click="removeField(selectedField.id)" class="text-xs text-red-500 hover:text-red-700 ml-2">
          삭제
        </button>
      </div>
    </div>

    <!-- PDF Viewer with field overlays -->
    <PdfViewer
      :src="pdfSrc"
      :height="height"
      @loaded="onPdfLoaded"
      @page-change="onPageChange"
      ref="viewerRef"
    >
      <template #overlay="{ page, scale, width, height }">
        <div
          class="absolute inset-0"
          @click.self="deselectField"
          @mousedown.self="handleCanvasMouseDown($event, page, scale)"
        >
          <div
            v-for="field in fieldsOnPage(page)"
            :key="field.id"
            class="absolute border-2 rounded cursor-move group"
            :class="fieldClasses(field)"
            :style="fieldStyle(field, scale)"
            @mousedown.stop="startDrag($event, field, scale)"
            @click.stop="selectField(field)"
          >
            <!-- Field label -->
            <div class="absolute -top-5 left-0 text-[10px] font-medium whitespace-nowrap px-1 rounded-t"
              :class="fieldLabelClass(field)"
            >
              {{ fieldLabel(field) }}
              <span v-if="field.signRequestId" class="opacity-70">
                - {{ getSignerName(field.signRequestId) }}
              </span>
            </div>

            <!-- Resize handle -->
            <div
              v-if="selectedField?.id === field.id"
              class="absolute -right-1 -bottom-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-sm cursor-se-resize"
              @mousedown.stop="startResize($event, field, scale)"
            ></div>
          </div>
        </div>
      </template>
    </PdfViewer>
  </div>
</template>

<script setup lang="ts">
interface SignField {
  id: string
  signRequestId?: string
  type: 'signature' | 'date' | 'text' | 'checkbox' | 'initial'
  page: number
  x: number
  y: number
  width: number
  height: number
  required: boolean
  value?: string
}

interface Signer {
  id: string
  signerName: string
  signerEmail: string
}

const props = defineProps<{
  pdfSrc: string | ArrayBuffer | null
  modelValue: SignField[]
  signers?: Signer[]
  height?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', fields: SignField[]): void
  (e: 'aiDetect'): void
}>()

const viewerRef = ref()
const fields = ref<SignField[]>([...props.modelValue])
const selectedField = ref<SignField | null>(null)
const selectedFieldType = ref<string>('')
const currentPageNum = ref(1)
const dragState = ref<{ field: SignField; startX: number; startY: number; fieldStartX: number; fieldStartY: number } | null>(null)
const resizeState = ref<{ field: SignField; startX: number; startY: number; startW: number; startH: number } | null>(null)

watch(() => props.modelValue, (v) => { fields.value = [...v] }, { deep: true })
watch(fields, (v) => { emit('update:modelValue', v) }, { deep: true })

const fieldTypes = [
  { type: 'signature', label: '서명', icon: '✍️' },
  { type: 'initial', label: '이니셜', icon: '🔤' },
  { type: 'date', label: '날짜', icon: '📅' },
  { type: 'text', label: '텍스트', icon: '📝' },
  { type: 'checkbox', label: '체크', icon: '☑️' },
]

const defaultSizes: Record<string, { w: number; h: number }> = {
  signature: { w: 150, h: 50 },
  initial: { w: 80, h: 40 },
  date: { w: 120, h: 25 },
  text: { w: 150, h: 25 },
  checkbox: { w: 20, h: 20 },
}

function fieldsOnPage(page: number) {
  return fields.value.filter((f) => f.page === page)
}

function addField(type: string) {
  selectedFieldType.value = type
  const size = defaultSizes[type] || { w: 150, h: 50 }
  const newField: SignField = {
    id: crypto.randomUUID(),
    type: type as SignField['type'],
    page: currentPageNum.value,
    x: 100,
    y: 300,
    width: size.w,
    height: size.h,
    required: true,
    signRequestId: props.signers?.[0]?.id,
  }
  fields.value.push(newField)
  selectedField.value = newField
}

function selectField(field: SignField) {
  selectedField.value = field
}

function deselectField() {
  selectedField.value = null
}

function removeField(id: string) {
  fields.value = fields.value.filter((f) => f.id !== id)
  if (selectedField.value?.id === id) selectedField.value = null
}

function handleCanvasMouseDown(e: MouseEvent, page: number, scale: number) {
  if (!selectedFieldType.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const size = defaultSizes[selectedFieldType.value] || { w: 150, h: 50 }
  const newField: SignField = {
    id: crypto.randomUUID(),
    type: selectedFieldType.value as SignField['type'],
    page,
    x: (e.clientX - rect.left) / scale,
    y: (e.clientY - rect.top) / scale,
    width: size.w,
    height: size.h,
    required: true,
    signRequestId: props.signers?.[0]?.id,
  }
  fields.value.push(newField)
  selectedField.value = newField
  selectedFieldType.value = ''
}

function startDrag(e: MouseEvent, field: SignField, scale: number) {
  selectedField.value = field
  dragState.value = {
    field,
    startX: e.clientX,
    startY: e.clientY,
    fieldStartX: field.x,
    fieldStartY: field.y,
  }

  const onMove = (ev: MouseEvent) => {
    if (!dragState.value) return
    const dx = (ev.clientX - dragState.value.startX) / scale
    const dy = (ev.clientY - dragState.value.startY) / scale
    dragState.value.field.x = Math.max(0, dragState.value.fieldStartX + dx)
    dragState.value.field.y = Math.max(0, dragState.value.fieldStartY + dy)
  }

  const onUp = () => {
    dragState.value = null
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

function startResize(e: MouseEvent, field: SignField, scale: number) {
  resizeState.value = {
    field,
    startX: e.clientX,
    startY: e.clientY,
    startW: field.width,
    startH: field.height,
  }

  const onMove = (ev: MouseEvent) => {
    if (!resizeState.value) return
    const dx = (ev.clientX - resizeState.value.startX) / scale
    const dy = (ev.clientY - resizeState.value.startY) / scale
    resizeState.value.field.width = Math.max(20, resizeState.value.startW + dx)
    resizeState.value.field.height = Math.max(15, resizeState.value.startH + dy)
  }

  const onUp = () => {
    resizeState.value = null
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

function fieldStyle(field: SignField, scale: number) {
  return {
    left: `${field.x * scale}px`,
    top: `${field.y * scale}px`,
    width: `${field.width * scale}px`,
    height: `${field.height * scale}px`,
  }
}

function fieldClasses(field: SignField) {
  const isSelected = selectedField.value?.id === field.id
  const colorMap: Record<string, string> = {
    signature: 'border-blue-400 bg-blue-50/50',
    initial: 'border-purple-400 bg-purple-50/50',
    date: 'border-green-400 bg-green-50/50',
    text: 'border-yellow-400 bg-yellow-50/50',
    checkbox: 'border-gray-400 bg-gray-50/50',
  }
  return [
    colorMap[field.type] || 'border-gray-400',
    isSelected ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow',
  ]
}

function fieldLabelClass(field: SignField) {
  const map: Record<string, string> = {
    signature: 'bg-blue-500 text-white',
    initial: 'bg-purple-500 text-white',
    date: 'bg-green-500 text-white',
    text: 'bg-yellow-500 text-white',
    checkbox: 'bg-gray-500 text-white',
  }
  return map[field.type] || 'bg-gray-500 text-white'
}

function fieldLabel(field: SignField) {
  const map: Record<string, string> = {
    signature: '서명',
    initial: '이니셜',
    date: '날짜',
    text: '텍스트',
    checkbox: '체크',
  }
  return map[field.type] || field.type
}

function getSignerName(signRequestId: string) {
  return props.signers?.find((s) => s.id === signRequestId)?.signerName || ''
}

function onPdfLoaded(totalPages: number) {
  // PDF loaded
}

function onPageChange(page: number) {
  currentPageNum.value = page
}
</script>
