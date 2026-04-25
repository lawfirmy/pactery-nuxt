<template>
  <div class="sign-pad">
    <!-- Mode tabs -->
    <div class="flex gap-1 mb-3">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="mode = tab.value"
        :class="[
          'flex-1 sm:flex-none px-4 py-2.5 text-sm rounded-lg transition',
          mode === tab.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Draw mode -->
    <div v-if="mode === 'draw'" class="relative">
      <canvas
        ref="drawCanvas"
        :width="actualCanvasWidth"
        :height="actualCanvasHeight"
        class="w-full border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-crosshair touch-none"
        :style="{ height: canvasDisplayHeight + 'px' }"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onMouseUp"
      ></canvas>
      <div class="flex items-center justify-between mt-2">
        <div class="flex items-center gap-2">
          <label class="text-xs text-gray-500">굵기:</label>
          <input v-model.number="strokeWidth" type="range" min="1" max="5" class="w-20" />
          <label class="text-xs text-gray-500 ml-2">색상:</label>
          <input v-model="strokeColor" type="color" class="w-8 h-8 cursor-pointer rounded" />
        </div>
        <button @click="clearDraw" class="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">지우기</button>
      </div>
    </div>

    <!-- Text mode -->
    <div v-else-if="mode === 'text'" class="space-y-3">
      <select v-model="textFont" class="w-full px-3 py-2.5 border rounded-lg text-sm">
        <option value="cursive">필기체</option>
        <option value="serif">명조체</option>
        <option value="sans-serif">고딕체</option>
      </select>
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white min-h-[80px] flex items-center justify-center">
        <input
          v-model="textValue"
          type="text"
          placeholder="이름을 입력하세요"
          class="text-center text-2xl sm:text-3xl border-none outline-none bg-transparent w-full"
          :style="{ fontFamily: textFont }"
        />
      </div>
    </div>

    <!-- Image upload mode -->
    <div v-else class="space-y-3">
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 bg-white text-center min-h-[100px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition"
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <img v-if="imagePreview" :src="imagePreview" class="max-h-20 object-contain mb-2" />
        <template v-else>
          <p class="text-gray-400 text-sm">클릭하거나 이미지를 드래그하세요</p>
          <p class="text-gray-300 text-xs mt-1">PNG, JPG (투명 배경 권장)</p>
        </template>
      </div>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
    </div>

    <!-- Action -->
    <div class="flex justify-end mt-4">
      <button
        @click="confirm"
        :disabled="!hasSignature"
        class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition text-sm font-medium"
      >
        서명 적용
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'confirm', data: { type: string; value: string }): void
}>()

const mode = ref('draw')
const tabs = [
  { value: 'draw', label: '그리기' },
  { value: 'text', label: '텍스트' },
  { value: 'image', label: '이미지' },
]

// Draw mode
const drawCanvas = ref<HTMLCanvasElement | null>(null)
const actualCanvasWidth = ref(500)
const actualCanvasHeight = ref(200)
const canvasDisplayHeight = ref(150)
const strokeWidth = ref(2)
const strokeColor = ref('#000000')
const isDrawing = ref(false)
const hasDrawn = ref(false)

// Text mode
const textValue = ref('')
const textFont = ref('cursive')

// Image mode
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref('')

const hasSignature = computed(() => {
  if (mode.value === 'draw') return hasDrawn.value
  if (mode.value === 'text') return textValue.value.trim().length > 0
  if (mode.value === 'image') return !!imagePreview.value
  return false
})

onMounted(() => {
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
})

function updateCanvasSize() {
  if (!drawCanvas.value) return
  const container = drawCanvas.value.parentElement
  if (!container) return
  const w = container.clientWidth
  actualCanvasWidth.value = Math.min(w, 600)
  actualCanvasHeight.value = Math.round(actualCanvasWidth.value * 0.4)
  canvasDisplayHeight.value = Math.round(w * 0.35)
  // Clear on resize
  clearDraw()
}

function getCtx() {
  return drawCanvas.value?.getContext('2d') || null
}

function getPos(e: MouseEvent | { clientX: number; clientY: number }) {
  const rect = drawCanvas.value!.getBoundingClientRect()
  const scaleX = actualCanvasWidth.value / rect.width
  const scaleY = actualCanvasHeight.value / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }
}

function onMouseDown(e: MouseEvent) {
  isDrawing.value = true
  const ctx = getCtx()
  if (!ctx) return
  const pos = getPos(e)
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
  ctx.lineWidth = strokeWidth.value
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = strokeColor.value
}

function onMouseMove(e: MouseEvent) {
  if (!isDrawing.value) return
  const ctx = getCtx()
  if (!ctx) return
  const pos = getPos(e)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
  hasDrawn.value = true
}

function onMouseUp() {
  isDrawing.value = false
}

function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  onMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent)
}

function onTouchMove(e: TouchEvent) {
  const touch = e.touches[0]
  onMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent)
}

function clearDraw() {
  const ctx = getCtx()
  if (ctx && drawCanvas.value) {
    ctx.clearRect(0, 0, actualCanvasWidth.value, actualCanvasHeight.value)
    hasDrawn.value = false
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processImageFile(file)
}

function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) processImageFile(file)
}

function processImageFile(file: File) {
  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target?.result as string
  }
  reader.readAsDataURL(file)
}

function confirm() {
  let value = ''

  if (mode.value === 'draw' && drawCanvas.value) {
    value = drawCanvas.value.toDataURL('image/png')
  } else if (mode.value === 'text') {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 100
    const ctx = canvas.getContext('2d')!
    ctx.font = `36px ${textFont.value}`
    ctx.fillStyle = '#000'
    ctx.textBaseline = 'middle'
    ctx.fillText(textValue.value, 10, 50)
    value = canvas.toDataURL('image/png')
  } else if (mode.value === 'image') {
    value = imagePreview.value
  }

  if (value) {
    emit('confirm', { type: mode.value, value })
  }
}
</script>
