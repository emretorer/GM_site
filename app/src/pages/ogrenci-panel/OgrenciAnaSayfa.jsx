import { useNavigate } from 'react-router-dom'
import { getFirebaseAuthClient } from '../../firebase/clientApp.js'
import SectionHeader from '../../components/panel/SectionHeader.jsx'
import '../../styles/panel-pages/ogrenci-ana-sayfa.css'

function OgrenciAnaSayfa() {
  const navigate = useNavigate()
  const user = getFirebaseAuthClient().currentUser
  const displayName = user?.displayName || 'Öğrenci'

  const menuCards = [
    {
      title: 'Finans',
      desc: 'Oyun içi paranı ve harcamalarını takip et.',
      icon: 'fa-solid fa-wallet',
      color: '#10B981',
      bg: '#ECFDF5',
      to: '/ogrenci-panel/finans',
    },
    {
      title: 'Yetenek Gelişimi',
      desc: 'Yetenek skorlarını ve gelişim alanlarını incele.',
      icon: 'fa-solid fa-arrow-trend-up',
      color: '#3B82F6',
      bg: '#EFF6FF',
      to: '/ogrenci-panel/yetenek',
    },
    {
      title: 'Meslek Rehberi',
      desc: 'Sana uygun meslekleri ve RIASEC alanlarını keşfet.',
      icon: 'fa-solid fa-book-open-reader',
      color: '#8B5CF6',
      bg: '#F5F3FF',
      to: '/ogrenci-panel/meslek-rehberi',
    },
    {
      title: 'Başarılar',
      desc: 'Kazandığın rozetleri ve madalyaları gör.',
      icon: 'fa-solid fa-medal',
      color: '#F59E0B',
      bg: '#FFFBEB',
      to: '/ogrenci-panel/basarilar',
    },
  ]

  return (
    <div>
      <SectionHeader
        title={`${displayName}, Hoş Geldin!`}
        description="Panelinden finansını ve başarılarını takip edebilirsin."
      />

      <div className="ogrenci-welcome-banner">
        <div className="owb-left">
          <h2>Merhaba, {displayName}</h2>
          <p>Bugün neler yapmak istersin?</p>
        </div>
        <div className="owb-right">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
      </div>

      <div className="ogrenci-menu-grid">
        {menuCards.map((card) => (
          <button
            key={card.title}
            className="ogrenci-menu-card"
            onClick={() => navigate(card.to)}
            type="button"
          >
            <div className="omc-icon" style={{ background: card.bg, color: card.color }}>
              <i className={card.icon}></i>
            </div>
            <div className="omc-info">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
            <i className="fa-solid fa-chevron-right omc-arrow"></i>
          </button>
        ))}
      </div>
    </div>
  )
}

export default OgrenciAnaSayfa
