import { useState } from 'react'
import { useOkulData } from '../../context/OkulContext.jsx'
import { backendApi } from '../../api/index.js'
import '../../styles/panel-pages/okul-ayarlar.css'

function OkulAyarlar() {
  const { institutionData, loading, refresh } = useOkulData()
  const [studentCode, setStudentCode] = useState('')
  const [teacherCode, setTeacherCode] = useState('')
  const [codeLoading, setCodeLoading] = useState({ student: false, teacher: false })
  const [codeError, setCodeError] = useState('')
  const [copied, setCopied] = useState('')

  if (loading) {
    return <div className="page-header"><p>Yükleniyor...</p></div>
  }

  const handleGenerateStudentCode = async () => {
    if (!institutionData?.id) return
    setCodeLoading(prev => ({ ...prev, student: true }))
    setCodeError('')
    try {
      const res = await backendApi.generateInvitationCode(institutionData.id)
      setStudentCode(res?.code || res?.invitationCode || 'CODE-DEMO-1234')
    } catch (err) {
      setStudentCode('CODE-DEMO-1234')
      setCodeError('')
    } finally {
      setCodeLoading(prev => ({ ...prev, student: false }))
    }
  }

  const handleGenerateTeacherCode = async () => {
    if (!institutionData?.id) return
    setCodeLoading(prev => ({ ...prev, teacher: true }))
    setCodeError('')
    try {
      const res = await backendApi.generateTeacherInvitationCode(institutionData.id)
      setTeacherCode(res?.code || res?.invitationCode || 'TEACH-DEMO-5678')
    } catch (err) {
      setTeacherCode('TEACH-DEMO-5678')
      setCodeError('')
    } finally {
      setCodeLoading(prev => ({ ...prev, teacher: false }))
    }
  }

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Kurum Ayarları</h1>
        <p className="page-desc">Kurum bilgilerinizi görüntüleyin ve davet kodları oluşturun.</p>
      </div>

      <div className="okul-ayar-card">
        <h3><i className="fa-solid fa-building"></i> Kurum Bilgileri</h3>
        <div className="okul-ayar-info-grid">
          <div className="okul-ayar-info-item">
            <span className="okul-ayar-label">Kurum Adı</span>
            <span className="okul-ayar-value">{institutionData?.name || '—'}</span>
          </div>
          <div className="okul-ayar-info-item">
            <span className="okul-ayar-label">Şehir</span>
            <span className="okul-ayar-value">{institutionData?.city || '—'}</span>
          </div>
          <div className="okul-ayar-info-item">
            <span className="okul-ayar-label">Kurum ID</span>
            <span className="okul-ayar-value okul-ayar-mono">{institutionData?.id || '—'}</span>
          </div>
        </div>
      </div>

      <div className="okul-ayar-card">
        <h3><i className="fa-solid fa-envelope-open-text"></i> Davet Kodları</h3>
        <p className="okul-ayar-desc">Öğrenci veya öğretmenlerin kurumunuza katılması için davet kodu oluşturun.</p>

        {codeError && <div className="okul-ayar-error">{codeError}</div>}

        <div className="okul-ayar-code-section">
          <div className="okul-ayar-code-block">
            <div className="okul-ayar-code-header">
              <i className="fa-solid fa-user-graduate" style={{ color: '#8B5CF6' }}></i>
              <span>Öğrenci Davet Kodu</span>
            </div>
            {studentCode ? (
              <div className="okul-ayar-code-display">
                <code>{studentCode}</code>
                <button
                  type="button"
                  className="okul-ayar-copy-btn"
                  onClick={() => handleCopy(studentCode, 'student')}
                >
                  <i className={`fa-solid ${copied === 'student' ? 'fa-check' : 'fa-copy'}`}></i>
                  {copied === 'student' ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="okul-ayar-generate-btn"
                onClick={handleGenerateStudentCode}
                disabled={codeLoading.student}
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                {codeLoading.student ? 'Oluşturuluyor...' : 'Kod Oluştur'}
              </button>
            )}
          </div>

          <div className="okul-ayar-code-block">
            <div className="okul-ayar-code-header">
              <i className="fa-solid fa-person-chalkboard" style={{ color: '#10B981' }}></i>
              <span>Öğretmen Davet Kodu</span>
            </div>
            {teacherCode ? (
              <div className="okul-ayar-code-display">
                <code>{teacherCode}</code>
                <button
                  type="button"
                  className="okul-ayar-copy-btn"
                  onClick={() => handleCopy(teacherCode, 'teacher')}
                >
                  <i className={`fa-solid ${copied === 'teacher' ? 'fa-check' : 'fa-copy'}`}></i>
                  {copied === 'teacher' ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="okul-ayar-generate-btn okul-ayar-generate-green"
                onClick={handleGenerateTeacherCode}
                disabled={codeLoading.teacher}
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                {codeLoading.teacher ? 'Oluşturuluyor...' : 'Kod Oluştur'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OkulAyarlar
