interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatarUrl?: string
  lawyerBarNumber?: string
}

interface Organization {
  id: string
  name: string
  role: string
  logoUrl?: string
  plan?: string
}

interface AuthState {
  token: string | null
  user: User | null
  organizations: Organization[]
  currentOrgId: string | null
}

const authReady = ref(false)
let authInitPromise: Promise<void> | null = null

export const useAuth = () => {
  const state = useState<AuthState>('auth', () => ({
    token: null,
    user: null,
    organizations: [],
    currentOrgId: null,
  }))

  const isLoggedIn = computed(() => !!state.value.token)
  const currentOrg = computed(() =>
    state.value.organizations.find((o) => o.id === state.value.currentOrgId),
  )

  function setAuth(data: { token: string; user: User; organizations?: Organization[] }) {
    state.value.token = data.token
    state.value.user = data.user
    if (data.organizations) {
      state.value.organizations = data.organizations
      if (!state.value.currentOrgId && data.organizations.length > 0) {
        state.value.currentOrgId = data.organizations[0].id
      }
    }

    if (import.meta.client) {
      localStorage.setItem('pactery_token', data.token)
      if (state.value.currentOrgId) {
        localStorage.setItem('pactery_org', state.value.currentOrgId)
      }
    }
  }

  function switchOrg(orgId: string) {
    state.value.currentOrgId = orgId
    if (import.meta.client) {
      localStorage.setItem('pactery_org', orgId)
    }
  }

  function logout() {
    state.value = { token: null, user: null, organizations: [], currentOrgId: null }
    if (import.meta.client) {
      localStorage.removeItem('pactery_token')
      localStorage.removeItem('pactery_org')
    }
    navigateTo('/auth/login')
  }

  async function initAuth() {
    if (import.meta.server) { authReady.value = true; return }

    if (authInitPromise) return authInitPromise

    authInitPromise = (async () => {
      const token = localStorage.getItem('pactery_token')
      if (!token) { authReady.value = true; return }

      state.value.token = token
      state.value.currentOrgId = localStorage.getItem('pactery_org')

      try {
        const data = await $fetch<any>('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        state.value.user = data
        state.value.organizations = data.organizations || []
        if (!state.value.currentOrgId && state.value.organizations.length > 0) {
          state.value.currentOrgId = state.value.organizations[0].id
        }
      } catch {
        logout()
      } finally {
        authReady.value = true
      }
    })()

    return authInitPromise
  }

  async function waitForAuth() {
    if (authReady.value) return
    await initAuth()
  }

  function authFetch<T>(url: string, opts: any = {}): Promise<T> {
    return $fetch(url, {
      ...opts,
      headers: {
        ...opts.headers,
        Authorization: `Bearer ${state.value.token}`,
      },
    }) as Promise<T>
  }

  return {
    state,
    isLoggedIn,
    currentOrg,
    authReady,
    setAuth,
    switchOrg,
    logout,
    initAuth,
    waitForAuth,
    authFetch,
  }
}
