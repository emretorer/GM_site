import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { backendApi } from '../api/index.js'
import { TOKEN_EVENT_NAME, TOKEN_STORAGE_KEY } from '../api/authTokenStore.js'

const OkulContext = createContext({
  loading: false,
  error: '',
  institutionData: null,
  students: [],
  classes: [],
  teachers: [],
  selectedStudent: null,
  setSelectedStudent: () => {},
  refresh: async () => {},
})

function createInitialState() {
  return {
    loading: false,
    error: '',
    institutionData: null,
    students: [],
    classes: [],
    teachers: [],
    selectedStudent: null,
  }
}

function toIsoDate(value) {
  if (!value) return ''
  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString()
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString()
  }
  if (typeof value?.seconds === 'number') {
    return new Date(value.seconds * 1000).toISOString()
  }
  return ''
}

function normalizeStudent(student = {}) {
  const firstName = typeof student.first_name === 'string' ? student.first_name.trim() : ''
  const lastName = typeof student.last_name === 'string' ? student.last_name.trim() : ''
  const nameFromParts = [firstName, lastName].filter(Boolean).join(' ').trim()
  const resolvedName = (
    nameFromParts ||
    student.name ||
    student.full_name ||
    student.displayName ||
    ''
  ).toString().trim()
  const resolvedEmail = (student.email || student.mail || '').toString().trim()
  const resolvedClass = (
    student.sinif ||
    student.class_name ||
    student.className ||
    student.class_level ||
    ''
  ).toString().trim()

  return {
    ...student,
    name: resolvedName,
    email: resolvedEmail,
    sinif: resolvedClass,
    lastLoginAt:
      student.lastLoginAt ||
      student.last_login_at ||
      toIsoDate(student.updatedAt) ||
      toIsoDate(student.createdAt) ||
      toIsoDate(student.account_creation_date),
    gameData:
      student.gameData && typeof student.gameData === 'object'
        ? student.gameData
        : {
          todayMinutes: 0,
          monthMinutes: 0,
          totalMinutes: 0,
        },
  }
}

function normalizeClasses(classesResp) {
  if (Array.isArray(classesResp?.classes)) {
    return classesResp.classes
  }

  if (classesResp?.classes && typeof classesResp.classes === 'object') {
    return Object.entries(classesResp.classes).map(([id, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return { id, ...value }
      }
      return { id, name: String(value || id) }
    })
  }

  if (Array.isArray(classesResp)) {
    return classesResp
  }

  return []
}

function normalizeTeachers(teachersResp) {
  if (Array.isArray(teachersResp?.teachers)) {
    return teachersResp.teachers
  }

  if (Array.isArray(teachersResp)) {
    return teachersResp
  }

  return []
}

export function OkulProvider({ children }) {
  const [state, setState] = useState(createInitialState)

  const setSelectedStudent = useCallback((student) => {
    setState((prev) => ({ ...prev, selectedStudent: student }))
  }, [])

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }))

    try {
      await backendApi.verifyToken()

      let institutionData = null
      let students = []
      let classes = []
      let teachers = []

      try {
        const instResp = await backendApi.fetchInstitutionData()
        const resolvedInstitution = instResp?.institution || instResp
        if (resolvedInstitution?.id) {
          institutionData = resolvedInstitution
        }
      } catch {
        institutionData = null
      }

      if (institutionData?.id) {
        const [studentsResp, classesResp, teachersResp] = await Promise.all([
          backendApi.fetchAllStudents({ institutionId: institutionData.id }).catch(() => null),
          backendApi.fetchClasses(institutionData.id).catch(() => null),
          backendApi.fetchTeachers(institutionData.id).catch(() => null),
        ])

        if (Array.isArray(studentsResp?.students)) {
          students = studentsResp.students.map(normalizeStudent)
        } else if (Array.isArray(studentsResp)) {
          students = studentsResp.map(normalizeStudent)
        }

        classes = normalizeClasses(classesResp)
        teachers = normalizeTeachers(teachersResp)
      }

      setState({
        loading: false,
        error: '',
        institutionData,
        students,
        classes,
        teachers,
        selectedStudent: null,
      })
    } catch (error) {
      if (error?.code === 'AUTH_TOKEN_MISSING' || error?.status === 401) {
        setState(createInitialState())
        return
      }

      setState({
        ...createInitialState(),
        error: error?.message || 'Veri alinamadi.',
      })
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleTokenChanged = () => { refresh() }
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
    () => ({ ...state, setSelectedStudent, refresh }),
    [state, setSelectedStudent, refresh]
  )

  return <OkulContext.Provider value={value}>{children}</OkulContext.Provider>
}

export function useOkulData() {
  return useContext(OkulContext)
}
