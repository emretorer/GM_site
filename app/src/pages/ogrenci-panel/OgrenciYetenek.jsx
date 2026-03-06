import { useEffect, useState } from 'react'
import { backendApi } from '../../api/index.js'
import { apiPost } from '../../api/httpClient.js'
import { getFirebaseApp } from '../../firebase/clientApp.js'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import PanelYetenek from '../panel/PanelYetenek.jsx'

async function fetchPlayerMetricsFromFirestore(studentId) {
  try {
    const db = getFirestore(getFirebaseApp())
    const metricsRef = doc(db, 'PlayerMetrics', studentId)
    const metricsSnap = await getDoc(metricsRef)
    if (!metricsSnap.exists()) return null
    return metricsSnap.data() || null
  } catch (_error) {
    return null
  }
}

function OgrenciYetenek() {
  const [activeChildOverride, setActiveChildOverride] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadStudentMetrics() {
      try {
        try {
          const ownPanelPayload = await backendApi.fetchOwnStudentPanelData()
          if (isMounted && ownPanelPayload) {
            setActiveChildOverride({
              gameData: ownPanelPayload?.gameData || {},
              playerMetrics: ownPanelPayload?.playerMetrics || {},
            })
          }
          return
        } catch (ownPanelError) {
          if (ownPanelError?.status === 401) {
            if (isMounted) setActiveChildOverride({})
            return
          }
          // Some backend deployments do not expose this endpoint yet.
        }

        const verifyPayload = await backendApi.verifyToken()
        const studentId = verifyPayload?.uid
        if (!studentId) {
          if (isMounted) setActiveChildOverride({})
          return
        }

        let playerMetrics = await fetchPlayerMetricsFromFirestore(studentId)

        if (!playerMetrics) {
          try {
            const metricsPayload = await backendApi.fetchStudentPlayerMetrics(studentId)
            playerMetrics = metricsPayload?.playerMetrics || null
          } catch (error) {
            if (error?.status === 404) {
              try {
                const metricsPayload = await apiPost('/api/fetchStudentPlayerMetrics', { studentId })
                playerMetrics = metricsPayload?.playerMetrics || null
              } catch (_fallbackError) {
                playerMetrics = null
              }
            }
          }
        }

        if (isMounted) {
          setActiveChildOverride({
            gameData: {},
            playerMetrics: playerMetrics || {},
          })
        }
      } catch (_error) {
        if (isMounted) setActiveChildOverride({})
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadStudentMetrics()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <PanelYetenek
      activeChildOverride={activeChildOverride}
      headerTitle="Yetenek Gelişimi"
      headerDescription="Kendi oyun performansına dayalı canlı yetenek skorlarını görüntüle."
      isLoading={isLoading}
    />
  )
}

export default OgrenciYetenek
