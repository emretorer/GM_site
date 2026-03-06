import { Link } from 'react-router-dom'
import { useOkulData } from '../../context/OkulContext.jsx'
import '../../styles/panel-pages/okul-dashboard.css'

const navCards = [
  {
    to: '/okul-panel/ogrenciler',
    icon: 'fa-solid fa-users',
    title: 'Öğrenciler',
    desc: 'Tüm öğrencileri listeleyin, detaylarını inceleyin.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    to: '/okul-panel/siniflar',
    icon: 'fa-solid fa-chalkboard-user',
    title: 'Sınıf Yönetimi',
    desc: 'Sınıfları oluşturun, öğrenci atayın.',
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    to: '/okul-panel/ayarlar',
    icon: 'fa-solid fa-gear',
    title: 'Kurum Ayarları',
    desc: 'Kurum bilgilerini düzenleyin, davet kodu oluşturun.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
]

function OkulDashboard() {
  const { institutionData, students, classes, teachers, loading } = useOkulData()

  if (loading) {
    return <div className="page-header"><p>Yükleniyor...</p></div>
  }

  const stats = [
    {
      label: 'Toplam Öğrenci',
      value: students.length,
      icon: 'fa-solid fa-user-graduate',
      color: '#8B5CF6',
      bg: '#F5F3FF',
    },
    {
      label: 'Toplam Sınıf',
      value: classes.length,
      icon: 'fa-solid fa-chalkboard',
      color: '#3B82F6',
      bg: '#EFF6FF',
    },
    {
      label: 'Toplam Öğretmen',
      value: teachers.length,
      icon: 'fa-solid fa-person-chalkboard',
      color: '#10B981',
      bg: '#ECFDF5',
    },
  ]

  const activeToday = students.filter(s => s.gameData?.todayMinutes > 0).length
  const totalMinutesThisMonth = students.reduce((sum, s) => sum + (s.gameData?.monthMinutes || 0), 0)
  const avgMinutes = students.length > 0 ? Math.round(totalMinutesThisMonth / students.length) : 0

  return (
    <div>
      <div className="welcome-header">
        <h1>Hoş Geldiniz, <span className="panel-user-name">{institutionData?.name || 'Okul Yöneticisi'}</span></h1>
        <p>Kurumunuzun genel durumunu buradan takip edebilirsiniz.</p>
      </div>

      <div className="okul-stat-grid">
        {stats.map((stat) => (
          <div className="okul-stat-card" key={stat.label}>
            <div className="okul-stat-icon" style={{ background: stat.bg, color: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="okul-stat-info">
              <span className="okul-stat-value">{stat.value}</span>
              <span className="okul-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="okul-quick-stats">
        <div className="okul-quick-item">
          <i className="fa-solid fa-circle-check" style={{ color: '#10B981' }}></i>
          <span><strong>{activeToday}</strong> öğrenci bugün aktif</span>
        </div>
        <div className="okul-quick-item">
          <i className="fa-solid fa-clock" style={{ color: '#F59E0B' }}></i>
          <span>Aylık ort. <strong>{avgMinutes} dk</strong> / öğrenci</span>
        </div>
      </div>

      <h2 className="okul-section-title">Hızlı Erişim</h2>
      <div className="nav-grid">
        {navCards.map((card) => (
          <Link className="nav-card" to={card.to} key={card.to}>
            <div className="card-icon-box" style={{ background: card.bg, color: card.color }}>
              <i className={card.icon}></i>
            </div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-desc">{card.desc}</p>
            <div className="card-footer">
              <span>Görüntüle</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default OkulDashboard
