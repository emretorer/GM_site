import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOkulData } from '../../context/OkulContext.jsx'
import '../../styles/panel-pages/okul-ogrenciler.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return '—'
  }
}

function OkulOgrenciler() {
  const { students, classes, setSelectedStudent, loading } = useOkulData()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const navigate = useNavigate()

  if (loading) {
    return <div className="page-header"><p>Yükleniyor...</p></div>
  }

  const filtered = students.filter((s) => {
    const matchesSearch = !searchQuery ||
      (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = !filterClass || s.sinif === filterClass
    return matchesSearch && matchesClass
  })

  const uniqueClasses = [...new Set(students.map(s => s.sinif).filter(Boolean))].sort()

  const handleStudentClick = (student) => {
    setSelectedStudent(student)
    navigate('/okul-panel/ogrenci-detay')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Öğrenciler</h1>
        <p className="page-desc">Kurumunuzdaki tüm öğrencileri görüntüleyin ve detaylarını inceleyin.</p>
      </div>

      <div className="okul-filters">
        <div className="okul-search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Ad veya e-posta ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="okul-class-filter"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">Tüm Sınıflar</option>
          {uniqueClasses.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      <div className="okul-student-count">
        <span>{filtered.length} öğrenci listeleniyor</span>
      </div>

      <div className="okul-student-table-wrapper">
        <table className="data-table okul-student-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Sınıf</th>
              <th>Son Aktiflik</th>
              <th>Aylık Süre</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id || student.email} onClick={() => handleStudentClick(student)} className="okul-student-row">
                <td>
                  <div className="okul-student-name">
                    <div className="okul-student-avatar">
                      {(student.name || student.email || '?')[0].toUpperCase()}
                    </div>
                    <span>{student.name || student.email?.split('@')[0] || '—'}</span>
                  </div>
                </td>
                <td className="okul-muted">{student.email || '—'}</td>
                <td>
                  {student.sinif ? (
                    <span className="okul-class-badge">{student.sinif}</span>
                  ) : '—'}
                </td>
                <td className="okul-muted">{formatDate(student.lastLoginAt)}</td>
                <td>
                  <span className="okul-minutes">{student.gameData?.monthMinutes || 0} dk</span>
                </td>
                <td>
                  <button
                    type="button"
                    className="okul-detail-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStudentClick(student)
                    }}
                  >
                    Detay <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Eşleşen öğrenci bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OkulOgrenciler
