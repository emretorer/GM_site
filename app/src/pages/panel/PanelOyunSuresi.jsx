import { useMemo, useState } from 'react'
import { useParentChildData } from '../../context/ParentChildContext.jsx'
import '../../styles/panel-pages/oyun-suresi.css'

function toDisplayDateTime(isoValue) {
  if (!isoValue) return '-'
  const date = new Date(isoValue)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('tr-TR')
}

function getChildName(activeChild) {
  if (!activeChild) return 'Çocuğunuz'
  if (activeChild.name && String(activeChild.name).trim()) {
    return String(activeChild.name).trim()
  }
  const email = activeChild.email || activeChild.mail || ''
  return email ? email.split('@')[0] : 'Çocuğunuz'
}

function asDuration(minutesValue) {
  const minutes = Number(minutesValue || 0)
  if (!Number.isFinite(minutes) || minutes <= 0) return '0dk'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours <= 0) return `${mins}dk`
  if (mins <= 0) return `${hours}s`
  return `${hours}s ${mins}dk`
}

function PanelOyunSuresi() {
  const [logsOpen, setLogsOpen] = useState(false)
  const { activeChild } = useParentChildData()

  const childName = getChildName(activeChild)
  const gameData = activeChild?.gameData || {}

  const metrics = useMemo(
    () => [
      {
        id: 'last-active',
        icon: 'fa-solid fa-calendar-check',
        color: 'mc-blue',
        title: 'Son Aktiflik',
        value: toDisplayDateTime(activeChild?.lastLoginAt),
        sub: null,
      },
      {
        id: 'weekly-gain',
        icon: 'fa-solid fa-coins',
        color: 'mc-orange',
        title: 'Haftalık Kazanç',
        value: `${Number(gameData?.weeklyGain || 0).toLocaleString('tr-TR')} Gem`,
        sub: null,
      },
      {
        id: 'fav-type',
        icon: 'fa-solid fa-star',
        color: 'mc-purple',
        title: 'Güncel Favori Oyun',
        value: gameData?.favoriteGame || 'Henüz oyun verisi yok',
        sub: null,
      },
    ],
    [activeChild?.lastLoginAt, gameData?.favoriteGame, gameData?.weeklyGain]
  )

  const weeklyUsage = useMemo(() => {
    const labels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    const usage = Array.isArray(gameData?.weeklyUsageMinutes)
      ? gameData.weeklyUsageMinutes
      : []
    return labels.map((day, i) => {
      const minutes = Number(usage[i] || 0)
      const heightPct = Math.max(0, Math.min(100, Math.round((minutes / 180) * 100)))
      return {
        day,
        val: asDuration(minutes),
        height: `${Math.max(heightPct, 4)}%`,
        current: i === new Date().getDay() - 1,
      }
    })
  }, [gameData?.weeklyUsageMinutes])

  const timeBreakdown = useMemo(
    () => [
      { label: 'BUGÜN', value: asDuration(gameData?.todayMinutes || 0) },
      { label: 'BU AY', value: asDuration(gameData?.monthMinutes || 0) },
      { label: 'BU YIL', value: asDuration(gameData?.yearMinutes || 0) },
      {
        label: 'BAŞLANGIÇTAN BERİ',
        value: asDuration(gameData?.totalMinutes || 0),
        highlight: true,
      },
    ],
    [gameData?.monthMinutes, gameData?.todayMinutes, gameData?.totalMinutes, gameData?.yearMinutes]
  )

  const recentTasks = useMemo(() => {
    if (!Array.isArray(gameData?.recentTasks)) {
      return []
    }
    return gameData.recentTasks.map((task, idx) => ({
      id: task.id || idx + 1,
      game: task.game || task.name || 'Görev',
      timeRange: task.timeRange || '-',
      duration: task.duration || asDuration(task.minutes || 0),
    }))
  }, [gameData?.recentTasks])

  const logRows = useMemo(() => {
    if (!Array.isArray(gameData?.accessLogs)) return []
    return gameData.accessLogs.map((row, idx) => ({
      date: row.date || '-',
      time: row.time || '-',
      type: row.type === 'out' ? 'out' : 'in',
      device: row.device || '-',
      duration: row.duration || '-',
      key: row.id || `${row.date || 'x'}-${row.time || 'y'}-${idx}`,
    }))
  }, [gameData?.accessLogs])

  const logLabelClass = useMemo(
    () => (type) => (type === 'in' ? 'log-type log-in' : 'log-type log-out'),
    []
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dijital Aktivite ve Performans</h1>
          <p className="page-desc">
            <span className="panel-user-name">{childName}</span> için canlı oyun süreleri, görev
            performansı ve erişim özetleri.
          </p>
        </div>
        <div className="date-filter">
          <select>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
        </div>
      </div>
      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div className="metric-card" key={metric.id}>
            <div className={`mc-icon ${metric.color}`}>
              <i className={metric.icon}></i>
            </div>
            <div className="mc-info">
              <h3>{metric.title}</h3>
              <div className="mc-value">{metric.value}</div>
              {metric.sub && <div className="mc-sub">{metric.sub}</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="analysis-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fa-solid fa-chart-column"></i> Haftalık Kullanım ve Toplam Süreler
            </h3>
          </div>
          <div className="chart-container">
            {weeklyUsage.map((bar) => (
              <div className="chart-bar-group" key={bar.day}>
                <div
                  className={`chart-bar ${bar.current ? 'current-day' : ''}`}
                  data-val={bar.val}
                  style={{ height: bar.height }}
                ></div>
                <span className={`chart-label ${bar.current ? 'current-day-label' : ''}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '24px 0 12px' }}>
            Toplam Oyun Süresi Kırılımı
          </h4>
          <div className="time-breakdown-grid">
            {timeBreakdown.map((item) => (
              <div
                className="tb-box"
                key={item.label}
                style={item.highlight ? { background: '#EFF6FF', borderColor: '#DBEAFE' } : undefined}
              >
                <span className="tb-label" style={item.highlight ? { color: '#2563EB' } : undefined}>
                  {item.label}
                </span>
                <span className="tb-val" style={item.highlight ? { color: '#2563EB' } : undefined}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fa-solid fa-gamepad"></i> En Son Görevler
            </h3>
          </div>
          <div className="recent-tasks-list">
            {recentTasks.length === 0 ? (
              <div className="recent-task-item">
                <div className="rt-top">
                  <span className="rt-game">Henüz görev verisi yok</span>
                  <span className="rt-time">-</span>
                </div>
                <div className="rt-duration">0dk</div>
              </div>
            ) : (
              recentTasks.map((task) => (
                <div className="recent-task-item" key={task.id}>
                  <div className="rt-top">
                    <span className="rt-game">{task.game}</span>
                    <span className="rt-time">{task.timeRange}</span>
                  </div>
                  <div className="rt-duration">{task.duration}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="logs-section">
        <button
          className={`logs-toggle-btn ${logsOpen ? 'open' : ''}`}
          type="button"
          onClick={() => setLogsOpen((prev) => !prev)}
        >
          <i className="fa-solid fa-clock-rotate-left"></i>
          Tüm Giriş/Çıkış Logları
          <i className={`fa-solid fa-chevron-down logs-chevron ${logsOpen ? 'rotated' : ''}`}></i>
        </button>
        <div className={`logs-slide-panel ${logsOpen ? 'open' : ''}`}>
          <div
            className="card"
            style={{ padding: 0, overflow: 'hidden', borderRadius: '0 0 20px 20px', borderTop: 'none' }}
          >
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tarih (G/A/Y)</th>
                  <th>Saat</th>
                  <th>İşlem Türü</th>
                  <th>Cihaz / Platform</th>
                  <th>Süre</th>
                </tr>
              </thead>
              <tbody>
                {logRows.length === 0 ? (
                  <tr>
                    <td colSpan={5}>Henüz erişim logu bulunmuyor.</td>
                  </tr>
                ) : (
                  logRows.map((row) => (
                    <tr key={row.key}>
                      <td>{row.date}</td>
                      <td>{row.time}</td>
                      <td>
                        <span className={logLabelClass(row.type)}>
                          {row.type === 'in' ? 'Giriş' : 'Çıkış'}
                        </span>
                      </td>
                      <td>{row.device}</td>
                      <td>{row.duration}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelOyunSuresi
