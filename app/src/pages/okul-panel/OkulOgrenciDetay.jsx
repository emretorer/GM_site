import { Navigate, useNavigate } from 'react-router-dom'
import { useOkulData } from '../../context/OkulContext.jsx'
import PanelYetenek from '../panel/PanelYetenek.jsx'
import '../../styles/panel-pages/okul-ogrenciler.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return '—'
  }
}

function OkulOgrenciDetay() {
  const { selectedStudent } = useOkulData()
  const navigate = useNavigate()

  if (!selectedStudent) {
    return <Navigate to="/okul-panel/ogrenciler" replace />
  }

  const s = selectedStudent
  const gd = s.gameData || {}

  return (
    <div>
      <button
        type="button"
        className="okul-back-btn"
        onClick={() => navigate('/okul-panel/ogrenciler')}
      >
        <i className="fa-solid fa-arrow-left"></i> Öğrenci Listesine Dön
      </button>

      <div className="okul-detay-header">
        <div className="okul-detay-avatar">
          {(s.name || s.email || '?')[0].toUpperCase()}
        </div>
        <div className="okul-detay-info">
          <h1>{s.name || s.email?.split('@')[0] || 'Öğrenci'}</h1>
          <p>{s.email || ''}</p>
          <div className="okul-detay-meta">
            {s.sinif && <span className="okul-class-badge">{s.sinif}</span>}
            <span className="okul-muted">Son giriş: {formatDate(s.lastLoginAt)}</span>
          </div>
        </div>
      </div>

      <div className="okul-detay-stats">
        <div className="okul-detay-stat-card">
          <div className="okul-detay-stat-icon" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
            <i className="fa-solid fa-clock"></i>
          </div>
          <div>
            <span className="okul-detay-stat-value">{gd.todayMinutes || 0} dk</span>
            <span className="okul-detay-stat-label">Bugün</span>
          </div>
        </div>
        <div className="okul-detay-stat-card">
          <div className="okul-detay-stat-icon" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
            <i className="fa-solid fa-calendar"></i>
          </div>
          <div>
            <span className="okul-detay-stat-value">{gd.monthMinutes || 0} dk</span>
            <span className="okul-detay-stat-label">Bu Ay</span>
          </div>
        </div>
        <div className="okul-detay-stat-card">
          <div className="okul-detay-stat-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
            <i className="fa-solid fa-gamepad"></i>
          </div>
          <div>
            <span className="okul-detay-stat-value">{gd.totalMinutes || 0} dk</span>
            <span className="okul-detay-stat-label">Toplam</span>
          </div>
        </div>
        <div className="okul-detay-stat-card">
          <div className="okul-detay-stat-icon" style={{ background: '#FFFBEB', color: '#F59E0B' }}>
            <i className="fa-solid fa-gem"></i>
          </div>
          <div>
            <span className="okul-detay-stat-value">{gd.finance?.totalPrestige || 0}</span>
            <span className="okul-detay-stat-label">Prestij</span>
          </div>
        </div>
      </div>

      <PanelYetenek
        activeChildOverride={selectedStudent}
        headerTitle={`${s.name || 'Öğrenci'} — Yetenek Profili`}
        headerDescription="Bu öğrencinin oyun performansına dayalı yetenek skorları."
      />
    </div>
  )
}

export default OkulOgrenciDetay
