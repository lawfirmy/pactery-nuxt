import type { PDFDocumentProxy } from 'pdfjs-dist'

export const usePdf = () => {
  // Keep PDF object out of reactive — pdfjs uses private fields (#s)
  // that break when wrapped in a Vue Proxy
  const pdfDoc = shallowRef<PDFDocumentProxy | null>(null)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const scale = ref(1.0)
  const loading = ref(false)

  const state = reactive({
    get pdf() { return pdfDoc.value },
    get totalPages() { return totalPages.value },
    set totalPages(v) { totalPages.value = v },
    get currentPage() { return currentPage.value },
    set currentPage(v) { currentPage.value = v },
    get scale() { return scale.value },
    set scale(v) { scale.value = v },
    get loading() { return loading.value },
    set loading(v) { loading.value = v },
  })

  async function loadPdf(source: string | ArrayBuffer) {
    loading.value = true
    try {
      const pdfjsLib = await import('pdfjs-dist')
      const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default

      // Copy ArrayBuffer to prevent detachment when shared between components
      const data = source instanceof ArrayBuffer ? source.slice(0) : source
      const loadingTask = pdfjsLib.getDocument(data)
      pdfDoc.value = await loadingTask.promise
      totalPages.value = pdfDoc.value.numPages
      currentPage.value = 1
    } catch (e) {
      console.error('Failed to load PDF:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function renderPage(canvas: HTMLCanvasElement, pageNum: number) {
    if (!pdfDoc.value) return

    const page = await pdfDoc.value.getPage(pageNum)
    const viewport = page.getViewport({ scale: state.scale })

    canvas.height = viewport.height
    canvas.width = viewport.width

    const ctx = canvas.getContext('2d')!
    await page.render({ canvasContext: ctx, viewport }).promise

    return { width: viewport.width, height: viewport.height }
  }

  function setScale(scale: number) {
    state.scale = Math.max(0.5, Math.min(3.0, scale))
  }

  function nextPage() {
    if (state.currentPage < state.totalPages) state.currentPage++
  }

  function prevPage() {
    if (state.currentPage > 1) state.currentPage--
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= state.totalPages) state.currentPage = page
  }

  return {
    state,
    loadPdf,
    renderPage,
    setScale,
    nextPage,
    prevPage,
    goToPage,
  }
}
