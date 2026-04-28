export const useOrganization = () => {
  const { state, authFetch, waitForAuth } = useAuth()

  const orgId = computed(() => state.value.currentOrgId)

  async function orgFetch<T>(path: string, opts: any = {}): Promise<T> {
    if (!orgId.value) await waitForAuth()
    if (!orgId.value) throw new Error('No organization selected')
    return authFetch<T>(`/api/organizations/${orgId.value}${path}`, opts)
  }

  async function fetchStats() {
    return orgFetch<any>('/stats')
  }

  async function fetchDocuments(params?: Record<string, any>) {
    const query = new URLSearchParams(params).toString()
    return orgFetch<any>(`/documents${query ? `?${query}` : ''}`)
  }

  async function fetchDocument(docId: string) {
    return orgFetch<any>(`/documents/${docId}`)
  }

  async function createDocument(data: any) {
    return orgFetch<any>('/documents', { method: 'POST', body: data })
  }

  async function fetchMembers() {
    return orgFetch<any>('/members')
  }

  async function inviteMember(data: { email: string; role: string }) {
    return orgFetch<any>('/members/invite', { method: 'POST', body: data })
  }

  async function fetchCases(params?: Record<string, any>) {
    const query = new URLSearchParams(params).toString()
    return orgFetch<any>(`/cases${query ? `?${query}` : ''}`)
  }

  async function fetchClients(params?: Record<string, any>) {
    const query = new URLSearchParams(params).toString()
    return orgFetch<any>(`/clients${query ? `?${query}` : ''}`)
  }

  async function fetchTemplates() {
    return orgFetch<any>('/templates')
  }

  async function addSigner(docId: string, data: { signerName: string; signerEmail: string; signerPhone?: string }) {
    return orgFetch<any>(`/documents/${docId}/signers`, { method: 'POST', body: data })
  }

  async function removeSigner(docId: string, signRequestId: string) {
    return orgFetch<any>(`/documents/${docId}/signers/${signRequestId}`, { method: 'DELETE' })
  }

  async function uploadDocumentPdf(docId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    if (!orgId.value) await waitForAuth()
    if (!orgId.value) throw new Error('No organization selected')
    return $fetch<any>(`/api/organizations/${orgId.value}/documents/${docId}/upload`, {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${state.value.token}` },
    })
  }

  async function saveFields(docId: string, fields: any[]) {
    return orgFetch<any>(`/documents/${docId}/fields`, { method: 'PUT', body: { fields } })
  }

  async function sendDocument(docId: string) {
    return orgFetch<any>(`/documents/${docId}/send`, { method: 'POST' })
  }

  function getPdfUrl(docId: string) {
    if (!orgId.value) return null
    return `/api/organizations/${orgId.value}/documents/${docId}/pdf`
  }

  async function fetchPdfBuffer(docId: string): Promise<ArrayBuffer> {
    if (!orgId.value) await waitForAuth()
    if (!orgId.value) throw new Error('No organization selected')
    const res = await fetch(`/api/organizations/${orgId.value}/documents/${docId}/pdf`, {
      headers: { Authorization: `Bearer ${state.value.token}` },
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error(`[fetchPdfBuffer] status=${res.status}, body=${errText}`)
      throw new Error(`PDF fetch failed: ${res.status} — ${errText}`)
    }
    return res.arrayBuffer()
  }

  return {
    orgId,
    orgFetch,
    fetchStats,
    fetchDocuments,
    fetchDocument,
    createDocument,
    fetchMembers,
    inviteMember,
    fetchCases,
    fetchClients,
    fetchTemplates,
    addSigner,
    removeSigner,
    uploadDocumentPdf,
    saveFields,
    sendDocument,
    getPdfUrl,
    fetchPdfBuffer,
  }
}
