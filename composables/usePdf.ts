import type { PDFDocumentProxy } from 'pdfjs-dist'

interface PdfState {
  pdf: PDFDocumentProxy | null
  totalPages: number
  currentPage: number
  scale: number
  loading: boolean
}

export const usePdf = () => {
  const state = reactive<PdfState>({
    pdf: null,
    totalPages: 0,
    currentPage: 1,
    scale: 1.0,
    loading: false,
  })

  async function loadPdf(source: string | ArrayBuffer) {
    state.loading = true
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

      const loadingTask = pdfjsLib.getDocument(source)
      state.pdf = await loadingTask.promise
      state.totalPages = state.pdf.numPages
      state.currentPage = 1
    } catch (e) {
      console.error('Failed to load PDF:', e)
      throw e
    } finally {
      state.loading = false
    }
  }

  async function renderPage(canvas: HTMLCanvasElement, pageNum: number) {
    if (!state.pdf) return

    const page = await state.pdf.getPage(pageNum)
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
