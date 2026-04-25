<template>
  <div class="pdf-viewer">
    <!-- Toolbar -->
    <div class="flex items-center justify-between bg-gray-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-t-lg">
      <div class="flex items-center gap-1 sm:gap-2">
        <button @click="prevPage" :disabled="currentPage <= 1" class="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded hover:bg-gray-700 disabled:opacity-30">
          &larr;
        </button>
        <span class="text-sm">
          <input
            :value="currentPage"
            @change="handlePageInput"
            type="number"
            min="1"
            :max="totalPages"
            class="w-12 bg-gray-700 text-center text-sm rounded px-1 py-1"
          />
          / {{ totalPages }}
        </span>
        <button @click="nextPage" :disabled="currentPage >= totalPages" class="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded hover:bg-gray-700 disabled:opacity-30">
          &rarr;
        </button>
      </div>
      <div class="flex items-center gap-1 sm:gap-2">
        <button @click="zoomOut" class="min-w-[36px] min-h-[36px] flex items-center justify-center rounded hover:bg-gray-700 text-sm">-</button>
        <span class="text-xs sm:text-sm w-12 sm:w-14 text-center">{{ Math.round(scale * 100) }}%</span>
        <button @click="zoomIn" class="min-w-[36px] min-h-[36px] flex items-center justify-center rounded hover:bg-gray-700 text-sm">+</button>
        <button @click="fitWidth" class="min-w-[36px] min-h-[36px] flex items-center justify-center rounded hover:bg-gray-700 text-xs">맞춤</button>
      </div>
    </div>

    <!-- PDF Canvas Container -->
    <div ref="containerRef" class="pdf-container bg-gray-200 overflow-auto relative" :style="{ height: containerHeight }">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="text-gray-400">PDF 로딩 중...</div>
      </div>
      <div v-else class="inline-block relative mx-auto" :style="{ display: 'block', textAlign: 'center' }">
        <canvas ref="canvasRef" class="shadow-lg mx-auto block"></canvas>
        <!-- Field overlay layer -->
        <div
          class="absolute top-0 left-0"
          :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', left: '50%', transform: 'translateX(-50%)' }"
        >
          <slot name="overlay" :page="currentPage" :scale="scale" :width="canvasWidth" :height="canvasHeight" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src?: string | ArrayBuffer | null
  height?: string
  initialScale?: number
}>(), {
  height: '600px',
  initialScale: 1.0,
})

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
  (e: 'loaded', totalPages: number): void
}>()

const { state, loadPdf, renderPage, setScale, nextPage: goNext, prevPage: goPrev, goToPage } = usePdf()

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWidth = ref(0)
const canvasHeight = ref(0)

const loading = computed(() => state.loading)
const currentPage = computed(() => state.currentPage)
const totalPages = computed(() => state.totalPages)
const scale = computed(() => state.scale)
const containerHeight = computed(() => props.height)

// Watch source changes
watch(() => props.src, async (src) => {
  if (src) {
    await loadPdf(src)
    state.scale = props.initialScale
    emit('loaded', state.totalPages)
    await renderCurrentPage()
    // Auto fit-width on mobile
    nextTick(() => {
      if (containerRef.value && containerRef.value.clientWidth < 600) {
        fitWidth()
      }
    })
  }
}, { immediate: true })

// Re-render on page/scale change
watch([() => state.currentPage, () => state.scale], async () => {
  await renderCurrentPage()
  emit('pageChange', state.currentPage)
})

async function renderCurrentPage() {
  if (!canvasRef.value || !state.pdf) return
  const dims = await renderPage(canvasRef.value, state.currentPage)
  if (dims) {
    canvasWidth.value = dims.width
    canvasHeight.value = dims.height
  }
}

function nextPage() {
  goNext()
}

function prevPage() {
  goPrev()
}

function handlePageInput(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  if (!isNaN(val)) goToPage(val)
}

function zoomIn() {
  setScale(state.scale + 0.15)
}

function zoomOut() {
  setScale(state.scale - 0.15)
}

function fitWidth() {
  if (!containerRef.value || !state.pdf) return
  const containerWidth = containerRef.value.clientWidth - 40
  setScale(containerWidth / 595)
}

defineExpose({ goToPage, setScale, currentPage, totalPages })
</script>

<style scoped>
.pdf-container {
  scrollbar-width: thin;
}
.pdf-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.pdf-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
