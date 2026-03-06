import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { backendApi } from '../api/index.js'
import { TOKEN_EVENT_NAME, TOKEN_STORAGE_KEY } from '../api/authTokenStore.js'

const ParentChildContext = createContext({
  loading: false,
  error: '',
  isParent: false,
  parentUser: null,
  children: [],
  activeChild: null,
  premiumCredits: 0,
  refresh: async () => {},
})

function resolveRole(payload) {
  return payload?.userType || payload?.roles?.[0] || payload?.user_type || ''
}

function createInitialState() {
  return {
    loading: false,
    error: '',
    isParent: false,
    parentUser: null,
    children: [],
    activeChild: null,
    premiumCredits: 0,
  }
}

export function ParentChildProvider({ children }) {
  const [state, setState] = useState(createInitialState)

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }))

    try {
      const verifyPayload = await backendApi.verifyToken()
      const role = resolveRole(verifyPayload)

      if (role !== 'parent') {
        setState({
          loading: false,
          error: '',
          isParent: false,
          parentUser: verifyPayload || null,
          children: [],
          activeChild: null,
          premiumCredits: 0,
        })
        return
      }

      const childrenPayload = await backendApi.fetchChildren()
      const childrenList = Array.isArray(childrenPayload?.children)
        ? childrenPayload.children
        : []

      setState({
        loading: false,
        error: '',
        isParent: true,
        parentUser: verifyPayload || null,
        children: childrenList,
        activeChild: childrenList[0] || null,
        premiumCredits: Number(childrenPayload?.premium_credits || 0),
      })
    } catch (error) {
      if (error?.code === 'AUTH_TOKEN_MISSING' || error?.status === 401) {
        setState(createInitialState())
        return
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: error?.message || 'Parent/child verisi alınamadı.',
      }))
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleTokenChanged = () => {
      refresh()
    }

    const handleStorage = (event) => {
      if (event.key !== TOKEN_STORAGE_KEY) return
      refresh()
    }

    window.addEventListener(TOKEN_EVENT_NAME, handleTokenChanged)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(TOKEN_EVENT_NAME, handleTokenChanged)
      window.removeEventListener('storage', handleStorage)
    }
  }, [refresh])

  const value = useMemo(
    () => ({
      ...state,
      refresh,
    }),
    [state, refresh]
  )

  return <ParentChildContext.Provider value={value}>{children}</ParentChildContext.Provider>
}

export function useParentChildData() {
  return useContext(ParentChildContext)
}
