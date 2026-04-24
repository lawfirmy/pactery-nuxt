export const useOrganization = () => {
  const { state, authFetch } = useAuth()

  const orgId = computed(() => state.value.currentOrgId)

  function orgFetch<T>(path: string, opts: any = {}): Promise<T> {
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
  }
}
