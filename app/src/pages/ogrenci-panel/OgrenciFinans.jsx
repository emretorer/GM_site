import { useMemo } from 'react'
import SectionHeader from '../../components/panel/SectionHeader.jsx'
import '../../styles/panel-pages/ogrenci-finans.css'

function asPercent(value) {
  const num = Number(value || 0)
  return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 0
}

function OgrenciFinans() {
  // Demo veriler - backend entegrasyonunda gerçek veriyle değiştirilecek
  const balance = 12450
  const monthlyEarning = 2300
  const savingsRate = 42

  const goal = {
    title: 'Yeni Karakter Kostümü',
    target: 15000,
    current: 12450,
    icon: 'fa-solid fa-shirt',
  }
  const goalPercent = Math.round((goal.current / goal.target) * 100)

  const history = useMemo(() => [
    { id: 1, icon: 'fa-solid fa-trophy', iconClass: 'oh-bg-green', title: 'Görev Tamamlama Ödülü', meta: 'Liman Lojistik', amount: 500, date: 'Bugün' },
    { id: 2, icon: 'fa-solid fa-cart-shopping', iconClass: 'oh-bg-red', title: 'Kostüm Satın Alma', meta: 'Mağaza', amount: -200, date: 'Dün' },
    { id: 3, icon: 'fa-solid fa-star', iconClass: 'oh-bg-gold', title: 'Günlük Giriş Bonusu', meta: 'Sistem', amount: 150, date: '2 gün önce' },
    { id: 4, icon: 'fa-solid fa-gamepad', iconClass: 'oh-bg-blue', title: 'Mini Oyun Kazancı', meta: 'Arcade', amount: 350, date: '3 gün önce' },
    { id: 5, icon: 'fa-solid fa-gift', iconClass: 'oh-bg-purple', title: 'Başarı Rozeti Ödülü', meta: 'Başarılar', amount: 1000, date: '4 gün önce' },
  ], [])

  const quickStats = [
    { label: 'Toplam Kazanç', value: '24.500 Gem', icon: 'fa-solid fa-coins', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Toplam Harcama', value: '12.050 Gem', icon: 'fa-solid fa-bag-shopping', color: '#EF4444', bg: '#FEF2F2' },
    { label: 'Bu Hafta', value: '+1.800 Gem', icon: 'fa-solid fa-calendar-week', color: '#3B82F6', bg: '#EFF6FF' },
  ]

  return (
    <div>
      <SectionHeader
        title="Finansım"
        description="Oyun içi para durumunu, kazançlarını ve harcamalarını buradan takip edebilirsin."
      />

      {/* Bakiye Kartı */}
      <div className="ogrenci-balance-card">
        <div className="obc-left">
          <span className="obc-label">Toplam Bakiye</span>
          <div className="obc-amount">
            {balance.toLocaleString('tr-TR')} <span className="obc-currency">Gem</span>
          </div>
          <div className="obc-stats">
            <div className="obc-stat">
              <i className="fa-solid fa-arrow-trend-up"></i>
              <span>Bu Ay: +{monthlyEarning.toLocaleString('tr-TR')} Gem</span>
            </div>
            <div className="obc-stat">
              <i className="fa-solid fa-piggy-bank"></i>
              <span>Tasarruf: %{savingsRate}</span>
            </div>
          </div>
        </div>
        <div className="obc-right">
          <i className="fa-solid fa-gem obc-big-icon"></i>
        </div>
      </div>

      {/* Hızlı İstatistikler */}
      <div className="ogrenci-quick-stats">
        {quickStats.map((stat) => (
          <div className="oqs-card" key={stat.label}>
            <div className="oqs-icon" style={{ background: stat.bg, color: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="oqs-info">
              <span className="oqs-label">{stat.label}</span>
              <span className="oqs-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ogrenci-finans-grid">
        {/* Birikim Hedefi */}
        <div className="of-card">
          <div className="of-card-head">
            <span className="of-card-title">
              <i className="fa-solid fa-bullseye"></i> Birikim Hedefim
            </span>
            <span className="of-goal-badge">%{goalPercent}</span>
          </div>
          <div className="of-goal-item">
            <div className="of-goal-icon">
              <i className={goal.icon}></i>
            </div>
            <div className="of-goal-info">
              <span className="of-goal-name">{goal.title}</span>
              <span className="of-goal-cost">
                {goal.current.toLocaleString('tr-TR')} / {goal.target.toLocaleString('tr-TR')} Gem
              </span>
              <div className="of-goal-bar">
                <div className="of-goal-fill" style={{ width: `${goalPercent}%` }}></div>
              </div>
            </div>
          </div>
          <p className="of-goal-tip">
            <i className="fa-solid fa-lightbulb"></i>
            Hedefe ulaşmana {(goal.target - goal.current).toLocaleString('tr-TR')} Gem kaldı. Görevleri tamamlayarak kazanabilirsin!
          </p>
        </div>

        {/* İşlem Geçmişi */}
        <div className="of-card">
          <div className="of-card-head">
            <span className="of-card-title">
              <i className="fa-solid fa-clock-rotate-left"></i> Son İşlemler
            </span>
          </div>
          <div className="of-history-list">
            {history.map((item) => (
              <div className="of-h-item" key={item.id}>
                <div className="of-h-left">
                  <div className={`of-h-icon ${item.iconClass}`}>
                    <i className={item.icon}></i>
                  </div>
                  <div className="of-h-details">
                    <h5>{item.title}</h5>
                    <span>{item.meta} &middot; {item.date}</span>
                  </div>
                </div>
                <div className={`of-h-amount ${item.amount >= 0 ? 'of-amt-pos' : 'of-amt-neg'}`}>
                  {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString('tr-TR')} Gem
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OgrenciFinans
