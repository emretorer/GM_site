import { useMemo } from 'react'
import SectionHeader from '../../components/panel/SectionHeader.jsx'
import { useParentChildData } from '../../context/ParentChildContext.jsx'
import '../../styles/panel-pages/finans.css'

function getChildName(activeChild) {
  if (!activeChild) return 'Çocuğunuz'
  if (activeChild.name && String(activeChild.name).trim()) {
    return String(activeChild.name).trim()
  }
  const email = activeChild.email || activeChild.mail || ''
  return email ? email.split('@')[0] : 'Çocuğunuz'
}

function asPercent(value) {
  const num = Number(value || 0)
  return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 0
}

function PanelFinans() {
  const { activeChild, premiumCredits } = useParentChildData()
  const childName = getChildName(activeChild)

  const gameFinance = activeChild?.gameData?.finance || {}

  const prestigeStats = useMemo(() => {
    const total = Number(gameFinance.totalPrestige || 0)
    const monthlyGain = Number(gameFinance.monthlyGain || 0)
    const savingsRate = asPercent(gameFinance.savingsRate)
    return {
      total: total.toLocaleString('tr-TR'),
      monthlyGain: `${monthlyGain >= 0 ? '+' : ''}${monthlyGain.toLocaleString('tr-TR')} P`,
      savingsRate: `%${savingsRate}`,
    }
  }, [gameFinance])

  const investmentSplit = useMemo(
    () => ({
      edu: asPercent(gameFinance.educationRatio),
      fun: asPercent(gameFinance.funRatio),
    }),
    [gameFinance]
  )

  const goal = useMemo(() => {
    const percent = asPercent(gameFinance.goalPercent)
    return {
      title: gameFinance.goalTitle || 'Henüz birikim hedefi yok',
      target: gameFinance.goalTarget ? `${gameFinance.goalTarget} P` : '-',
      percent,
      icon: gameFinance.goalIcon || 'fa-solid fa-bullseye',
    }
  }, [gameFinance])

  const history = useMemo(() => {
    if (!Array.isArray(gameFinance.history)) {
      return []
    }
    return gameFinance.history.map((item, index) => ({
      id: item.id || `h${index}`,
      icon: item.icon || 'fa-solid fa-receipt',
      iconClass: item.amount >= 0 ? 'h-bg-green' : 'h-bg-red',
      title: item.title || 'Hareket',
      meta: item.meta || 'Sistem',
      amount: `${item.amount >= 0 ? '+' : '-'} ${Math.abs(Number(item.amount || 0)).toLocaleString('tr-TR')} P`,
      amountClass: item.amount >= 0 ? 'amt-pos' : 'amt-neg',
    }))
  }, [gameFinance.history])

  const premiumFeatures = ['Sınırsız Raporlama', 'Uzman Analizi', 'Reklamsız Deneyim']

  const spendingLimit = {
    value: Math.max(0, Number(gameFinance.dailyLimit || 0)),
    min: 0,
    max: 5000,
  }

  return (
    <div>
      <SectionHeader
        title="Finans Yönetimi"
        description={
          <>
            <span className="panel-user-name">{childName}</span> için oyun içi ekonomi verileri.
            Veri gelmeyen alanlar 0/boş gösterilir.
          </>
        }
      />
      <div className="finance-layout">
        <div className="economy-section">
          <div className="prestige-banner">
            <div className="pb-left">
              <h4>Toplam Varlık</h4>
              <div className="pb-balance">
                {prestigeStats.total} <span className="currency-symbol">P</span>
              </div>
              <div className="pb-stats">
                <div className="pb-stat-item">
                  <span className="stat-lbl">Bu Ay Kazanılan</span>
                  <span className="stat-val">
                    {prestigeStats.monthlyGain} <span className="trend-pos"></span>
                  </span>
                </div>
                <div className="pb-stat-item">
                  <span className="stat-lbl">Tasarruf Oranı</span>
                  <span className="stat-val">{prestigeStats.savingsRate}</span>
                </div>
              </div>
            </div>
            <div className="pb-right">
              <i className="fa-solid fa-gem vault-icon"></i>
            </div>
          </div>
          <div className="analysis-row">
            <div className="content-card">
              <div className="card-head">
                <span className="card-h-title">
                  <i className="fa-solid fa-chart-pie"></i> Yatırım Dengesi
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#64748B', marginBottom: 10 }}>
                Prestij harcamasının eğitim ve eğlence dağılımı.
              </p>
              <div className="quality-bar">
                <div className="qb-segment qb-edu" style={{ width: `${investmentSplit.edu}%` }}></div>
                <div className="qb-segment qb-fun" style={{ width: `${investmentSplit.fun}%` }}></div>
              </div>
              <div className="qb-legend">
                <span style={{ color: '#3B82F6' }}>%{investmentSplit.edu} Gelişim & Araçlar</span>
                <span style={{ color: '#F59E0B' }}>%{investmentSplit.fun} Kozmetik</span>
              </div>
            </div>
            <div className="content-card">
              <div className="card-head">
                <span className="card-h-title">
                  <i className="fa-solid fa-bullseye"></i> Birikim Hedefi
                </span>
                <span
                  style={{
                    fontSize: 11,
                    background: '#ECFDF5',
                    color: '#059669',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  Aktif
                </span>
              </div>
              <div className="goal-item">
                <div className="goal-img">
                  <i className={goal.icon}></i>
                </div>
                <div className="goal-info">
                  <span className="goal-name">{goal.title}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span className="goal-cost">Hedef: {goal.target}</span>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>%{goal.percent}</span>
                  </div>
                  <div className="goal-progress">
                    <div className="goal-fill" style={{ width: `${goal.percent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-card">
            <div className="card-head">
              <span className="card-h-title">
                <i className="fa-solid fa-list-check"></i> Prestij Hareketleri
              </span>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="h-item">
                  <div className="h-left">
                    <div className="h-icon h-bg-blue">
                      <i className="fa-solid fa-circle-info"></i>
                    </div>
                    <div className="h-details">
                      <h5>Henüz hareket bulunmuyor</h5>
                      <span>Bu öğrenci için finansal oyun verisi henüz üretilmedi.</span>
                    </div>
                  </div>
                </div>
              ) : (
                history.map((item) => (
                  <div className="h-item" key={item.id}>
                    <div className="h-left">
                      <div className={`h-icon ${item.iconClass}`}>
                        <i className={item.icon}></i>
                      </div>
                      <div className="h-details">
                        <h5>{item.title}</h5>
                        <span>{item.meta}</span>
                      </div>
                    </div>
                    <div className={`h-amount ${item.amountClass}`}>{item.amount}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="real-world-section">
          <div className="premium-card">
            <span className="p-badge">ÜYELİK DURUMU</span>
            <h3 className="p-title">Genius Premium</h3>
            <p className="p-sub">Ebeveyn kredisi: {premiumCredits}</p>
            <div className="p-features">
              {premiumFeatures.map((feature) => (
                <div className="pf-item" key={feature}>
                  <i className="fa-solid fa-check"></i> {feature}
                </div>
              ))}
            </div>
            <button className="p-btn">Aboneliği Yönet</button>
          </div>
          <div className="limit-card">
            <div className="card-head">
              <span className="card-h-title">
                <i className="fa-solid fa-shield-halved"></i> Harcama Limiti
              </span>
            </div>
            <p className="limit-desc">
              <span className="panel-user-name">{childName}</span> için günlük harcama limiti
              (oyun verisinden okunur).
            </p>
            <div className="limit-val">{spendingLimit.value.toLocaleString('tr-TR')} P</div>
            <div className="slider-container">
              <input
                className="limit-slider"
                type="range"
                min={spendingLimit.min}
                max={spendingLimit.max}
                value={spendingLimit.value}
                readOnly
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 5,
                  fontSize: 10,
                  color: '#94A3B8',
                }}
              >
                <span>{spendingLimit.min} P</span>
                <span>{spendingLimit.max} P</span>
              </div>
            </div>
          </div>
          <div className="content-card" style={{ background: '#FFFBEB', borderColor: '#FEF3C7' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <i className="fa-solid fa-lightbulb" style={{ color: '#F59E0B', marginTop: 2 }}></i>
              <div>
                <h5 style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 5 }}>
                  Ebeveyn İpucu
                </h5>
                <p style={{ fontSize: 12, color: '#B45309', lineHeight: 1.4 }}>
                  Oyun metrikleri geldikçe bu alandaki öneriler otomatik olarak güncellenecek.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelFinans
