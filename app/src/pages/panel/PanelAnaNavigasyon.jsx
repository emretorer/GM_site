import { Link } from 'react-router-dom'
import { useParentChildData } from '../../context/ParentChildContext.jsx'
import '../../styles/panel-pages/ana-navigasyon.css'

function getChildName(activeChild) {
  if (!activeChild) return 'Veli'
  if (activeChild.name && String(activeChild.name).trim()) {
    return String(activeChild.name).trim()
  }
  const email = activeChild.email || activeChild.mail || ''
  return email ? email.split('@')[0] : 'Veli'
}

const widgetCards = [
  {
    to: '/panel/haberler',
    icon: 'fa-regular fa-newspaper',
    title: 'Haber Akışı',
    desc: 'Sistem duyuruları ve güncel gelişmeleri takip edin.',
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    to: '/panel/oyun-suresi',
    icon: 'fa-solid fa-chart-simple',
    title: 'Oyun Süresi',
    desc: 'Günlük ve haftalık oyun süresi istatistikleri.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    to: '/panel/yetenek',
    icon: 'fa-solid fa-arrow-trend-up',
    title: 'Yetenek Gelişimi',
    desc: 'Çocuğunuzun yetenek ve beceri gelişim grafiği.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    to: '/panel/kariyer-yolu',
    icon: 'fa-solid fa-road',
    title: 'Kariyer Yolu',
    desc: 'Oyun verilerine dayalı kariyer yönelim analizi.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    to: '/panel/meslek-rehberi',
    icon: 'fa-solid fa-book-open-reader',
    title: 'Meslek Rehberi',
    desc: 'Meslekleri keşfedin ve uygunluk analizini görün.',
    color: '#EC4899',
    bg: '#FDF2F8',
  },
  {
    to: '/panel/basarilar',
    icon: 'fa-solid fa-medal',
    title: 'Başarılar',
    desc: 'Kazanılan rozetler, madalyalar ve koleksiyonlar.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    to: '/panel/ilgi-alanlari',
    icon: 'fa-regular fa-lightbulb',
    title: 'İlgi Alanları',
    desc: 'Çocuğunuzun öne çıkan ilgi ve merak alanları.',
    color: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    to: '/panel/gelisim-agaci',
    icon: 'fa-solid fa-tree',
    title: 'Gelişim Ağacı',
    desc: 'Pedagojik büyüme haritası ve ilerleme takibi.',
    color: '#22C55E',
    bg: '#F0FDF4',
  },
  {
    to: '/panel/finans',
    icon: 'fa-solid fa-gem',
    title: 'Finans Yönetimi',
    desc: 'Oyun içi ekonomi verileri ve harcama analizi.',
    color: '#14B8A6',
    bg: '#F0FDFA',
  },
  {
    to: '/panel/oyun-bilgileri',
    icon: 'fa-solid fa-circle-info',
    title: 'Oyunumuz Hakkında',
    desc: 'Oyun mekanikleri ve eğitim metodolojisi.',
    color: '#64748B',
    bg: '#F8FAFC',
  },
  {
    to: '/panel/yardim',
    icon: 'fa-regular fa-circle-question',
    title: 'Yardım Paneli',
    desc: 'Sıkça sorulan sorular ve destek merkezi.',
    color: '#0EA5E9',
    bg: '#F0F9FF',
  },
]

function PanelAnaNavigasyon() {
  const { activeChild } = useParentChildData()
  const childName = getChildName(activeChild)

  return (
    <div>
      <div className="welcome-header">
        <h1>Merhaba, <span className="panel-user-name">{childName}</span></h1>
        <p>{activeChild?.email || activeChild?.mail || 'Çocuk verisi yükleniyor.'}</p>
      </div>
      <div className="nav-grid">
        {widgetCards.map((card) => (
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

export default PanelAnaNavigasyon
