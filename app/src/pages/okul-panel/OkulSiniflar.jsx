import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOkulData } from '../../context/OkulContext.jsx'
import { backendApi } from '../../api/index.js'
import '../../styles/panel-pages/okul-siniflar.css'

function OkulSiniflar() {
  const { classes, students, institutionData, setSelectedStudent, refresh, loading } = useOkulData()
  const [newClassName, setNewClassName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [expandedClassId, setExpandedClassId] = useState(null)
  const [actionError, setActionError] = useState('')
  const navigate = useNavigate()

  if (loading) {
    return <div className="page-header"><p>Yükleniyor...</p></div>
  }

  const getClassStudents = (className) => {
    return students.filter(s => s.sinif === className)
  }

  const handleCreateClass = async (e) => {
    e.preventDefault()
    if (!newClassName.trim() || !institutionData?.id) return
    setIsCreating(true)
    setActionError('')
    try {
      await backendApi.createClass(institutionData.id, newClassName.trim())
      setNewClassName('')
      await refresh()
    } catch (err) {
      setActionError(err?.message || 'Sınıf oluşturulamadı.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteClass = async (classId) => {
    if (!institutionData?.id) return
    setActionError('')
    try {
      await backendApi.deleteClass(institutionData.id, classId)
      await refresh()
    } catch (err) {
      setActionError(err?.message || 'Sınıf silinemedi.')
    }
  }

  const handleStudentClick = (student) => {
    setSelectedStudent(student)
    navigate('/okul-panel/ogrenci-detay')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sınıf Yönetimi</h1>
        <p className="page-desc">Sınıflarınızı yönetin, öğrenci dağılımını görüntüleyin.</p>
      </div>

      <form className="okul-sinif-form" onSubmit={handleCreateClass}>
        <input
          type="text"
          placeholder="Yeni sınıf adı (örn: 10-C)"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          className="okul-sinif-input"
        />
        <button type="submit" className="okul-sinif-add-btn" disabled={isCreating || !newClassName.trim()}>
          <i className="fa-solid fa-plus"></i> {isCreating ? 'Ekleniyor...' : 'Sınıf Ekle'}
        </button>
      </form>

      {actionError && (
        <div className="okul-sinif-error">{actionError}</div>
      )}

      <div className="okul-sinif-list">
        {classes.map((cls) => {
          const classStudents = getClassStudents(cls.name)
          const isExpanded = expandedClassId === cls.id

          return (
            <div className="okul-sinif-card" key={cls.id}>
              <div className="okul-sinif-card-header" onClick={() => setExpandedClassId(isExpanded ? null : cls.id)}>
                <div className="okul-sinif-card-left">
                  <div className="okul-sinif-icon">
                    <i className="fa-solid fa-chalkboard"></i>
                  </div>
                  <div>
                    <h3 className="okul-sinif-name">{cls.name}</h3>
                    <span className="okul-sinif-meta">{classStudents.length} öğrenci</span>
                  </div>
                </div>
                <div className="okul-sinif-card-right">
                  <button
                    type="button"
                    className="okul-sinif-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClass(cls.id)
                    }}
                    title="Sınıfı sil"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} okul-sinif-chevron`}></i>
                </div>
              </div>

              {isExpanded && (
                <div className="okul-sinif-students">
                  {classStudents.length === 0 ? (
                    <p className="okul-sinif-empty">Bu sınıfta henüz öğrenci yok.</p>
                  ) : (
                    <ul className="okul-sinif-student-list">
                      {classStudents.map((s) => (
                        <li key={s.id || s.email} onClick={() => handleStudentClick(s)}>
                          <div className="okul-student-avatar" style={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                            {(s.name || s.email || '?')[0].toUpperCase()}
                          </div>
                          <span>{s.name || s.email?.split('@')[0]}</span>
                          <span className="okul-muted" style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>{s.gameData?.monthMinutes || 0} dk/ay</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {classes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            Henüz sınıf oluşturulmamış.
          </div>
        )}
      </div>
    </div>
  )
}

export default OkulSiniflar
