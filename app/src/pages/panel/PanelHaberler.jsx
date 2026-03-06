import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { allAchievements, userUnlockedIDs } from './PanelBasarilar.jsx'
import { useParentChildData } from '../../context/ParentChildContext.jsx'
import '../../styles/panel-pages/haberler.css'

function getChildName(activeChild) {
  if (!activeChild) return 'Çocuğunuz'
  if (activeChild.name && String(activeChild.name).trim()) {
    return String(activeChild.name).trim()
  }
  const email = activeChild.email || activeChild.mail || ''
  return email ? email.split('@')[0] : 'Çocuğunuz'
}

function formatDateTime(isoValue) {
  if (!isoValue) return null
  const date = new Date(isoValue)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString('tr-TR')
}

function highlightChildName(textValue, childName) {
  if (!textValue || !childName) return textValue

  const text = String(textValue)
  const name = String(childName)
  const parts = text.split(name)

  if (parts.length < 2) return text

  return parts.flatMap((part, index) => {
    if (index === parts.length - 1) return [part]
    return [
      part,
      <span className="panel-user-name" key={`panel-user-name-${index}`}>
        {name}
      </span>,
    ]
  })
}

function toDate(value) {
  if (!value) return null
  if (typeof value?.toDate === 'function') {
    return value.toDate()
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function toPercent(value) {
  const numeric = Number(value || 0)
  if (!Number.isFinite(numeric)) return 0
  return Math.max(0, Math.min(100, Math.round(numeric)))
}

function findAchievementById(id) {
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) return null
  return allAchievements.find((achievement) => Number(achievement.id) === numericId) || null
}

function normalizeBadge(rawBadge, order) {
  if (rawBadge == null) return null

  if (typeof rawBadge === 'number' || typeof rawBadge === 'string') {
    const knownAchievement = findAchievementById(rawBadge)
    if (knownAchievement) {
      return {
        id: `badge-${knownAchievement.id}`,
        title: knownAchievement.title,
        source: knownAchievement.cat,
        unlocked: true,
        unlockedAt: null,
        order,
      }
    }

    const fallbackTitle = String(rawBadge).trim()
    if (!fallbackTitle) return null
    return {
      id: `badge-${order}`,
      title: fallbackTitle,
      source: null,
      unlocked: true,
      unlockedAt: null,
      order,
    }
  }

  if (typeof rawBadge !== 'object') return null

  const possibleId =
    rawBadge.id ??
    rawBadge.badgeId ??
    rawBadge.achievementId ??
    rawBadge.badge_id ??
    rawBadge.achievement_id

  const knownAchievement = findAchievementById(possibleId)
  const title =
    rawBadge.title ||
    rawBadge.name ||
    rawBadge.badgeName ||
    rawBadge.achievementName ||
    rawBadge.label ||
    knownAchievement?.title

  if (!title) return null

  const source =
    rawBadge.cat || rawBadge.category || rawBadge.source || rawBadge.game || knownAchievement?.cat || null

  const unlockedRaw =
    rawBadge.unlocked ?? rawBadge.isUnlocked ?? rawBadge.earned ?? rawBadge.completed

  return {
    id: `badge-${possibleId ?? order}`,
    title: String(title).trim(),
    source: source ? String(source).trim() : null,
    unlocked: unlockedRaw === undefined ? true : Boolean(unlockedRaw),
    unlockedAt: toDate(
      rawBadge.unlockedAt ||
        rawBadge.earnedAt ||
        rawBadge.date ||
        rawBadge.createdAt ||
        rawBadge.updatedAt ||
        rawBadge.timestamp ||
        null
    ),
    order,
  }
}

function resolveLastBadge(activeChild) {
  const badgeCollections = [
    activeChild?.gameData?.achievements,
    activeChild?.gameData?.badges,
    activeChild?.playerMetrics?.achievements,
    activeChild?.playerMetrics?.badges,
  ].filter((collection) => Array.isArray(collection) && collection.length > 0)

  const dynamicBadges = badgeCollections
    .flatMap((collection) => collection.map((rawBadge, index) => normalizeBadge(rawBadge, index)))
    .filter((badge) => badge && badge.title && badge.unlocked)

  if (dynamicBadges.length > 0) {
    dynamicBadges.sort((a, b) => {
      const aTime = a.unlockedAt?.getTime() || 0
      const bTime = b.unlockedAt?.getTime() || 0
      if (aTime !== bTime) return bTime - aTime
      return b.order - a.order
    })
    return dynamicBadges[0]
  }

  const fallbackId = userUnlockedIDs[userUnlockedIDs.length - 1]
  const fallbackBadge = findAchievementById(fallbackId)
  if (!fallbackBadge) return null

  return {
    id: `badge-${fallbackBadge.id}`,
    title: fallbackBadge.title,
    source: fallbackBadge.cat,
    unlocked: true,
    unlockedAt: null,
    order: 0,
  }
}

function humanizeSkillKey(rawKey) {
  return String(rawKey || '')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function resolveLatestSkillDiscovery(activeChild) {
  const rawMetrics =
    activeChild?.gameData?.playerStats?.metrics ||
    activeChild?.gameData?.rawPlayerStats?.metrics ||
    {}

  const metricCandidate = Object.entries(rawMetrics)
    .map(([label, score]) => ({
      label: String(label).trim(),
      score: toPercent(score),
    }))
    .filter((entry) => entry.label && entry.score > 0)
    .sort((a, b) => b.score - a.score)[0]

  if (metricCandidate) return metricCandidate

  const skillMap = activeChild?.gameData?.skills || {}
  const fallbackSkill = Object.entries(skillMap)
    .map(([key, score]) => ({
      label: humanizeSkillKey(key),
      score: toPercent(score),
    }))
    .filter((entry) => entry.label && entry.score > 0)
    .sort((a, b) => b.score - a.score)[0]

  return fallbackSkill || null
}

function resolveLastCompletedTask(activeChild) {
  const tasks = Array.isArray(activeChild?.gameData?.recentTasks)
    ? activeChild.gameData.recentTasks
    : []

  if (!tasks.length) return null

  const lastTask = tasks[0] || {}
  const game = String(lastTask.game || lastTask.taskName || 'Görev').trim()
  const dateLabel = String(lastTask.timeRange || lastTask.date || '').trim()
  const duration = String(lastTask.duration || '').trim()
  const detail = [dateLabel, duration].filter(Boolean).join(' - ')

  return {
    game,
    detail,
  }
}

function PanelHaberler() {
  const { activeChild } = useParentChildData()
  const childName = getChildName(activeChild)

  const newsItems = useMemo(() => {
    const items = []
    const maxPrimaryCards = 4

    const lastTask = resolveLastCompletedTask(activeChild)
    const lastLogin = formatDateTime(activeChild?.lastLoginAt)
    const lastBadge = resolveLastBadge(activeChild)
    const latestSkill = resolveLatestSkillDiscovery(activeChild)
    const createdAt = formatDateTime(activeChild?.createdAt)

    if (lastTask) {
      items.push({
        id: 'last-task',
        icon: 'fa-solid fa-list-check',
        color: 'grad-blue',
        title: 'Son Tamamlanan Görev',
        time: 'Oyun',
        desc: `${childName} son olarak "${lastTask.game}" görevini tamamladı${
          lastTask.detail ? ` (${lastTask.detail})` : '.'
        }`,
        badge: 'Görev',
      })
    }

    if (lastLogin) {
      items.push({
        id: 'last-login',
        icon: 'fa-solid fa-right-to-bracket',
        color: 'grad-green',
        title: 'Son Giriş Tarihi',
        time: 'Sistem',
        desc: `${childName} son olarak ${lastLogin} tarihinde giriş yaptı.`,
        badge: 'Aktif Kullanıcı',
      })
    }

    if (lastBadge) {
      items.push({
        id: 'last-badge',
        icon: 'fa-solid fa-medal',
        color: 'grad-purple',
        title: 'Son Kazanılan Rozet',
        time: 'Başarılar',
        desc: `${childName} için son kazanılan rozet: ${lastBadge.title}${
          lastBadge.source ? ` (${lastBadge.source})` : ''
        }.`,
        badge: 'Rozet',
      })
    }

    if (latestSkill) {
      items.push({
        id: 'latest-skill',
        icon: 'fa-solid fa-chart-line',
        color: 'grad-orange',
        title: 'Yeni Yetenek Gelişimi',
        time: 'Yetenek',
        desc: `${childName} profilinde yeni bir gelişim sinyali: ${latestSkill.label} (%${latestSkill.score}).`,
        badge: 'Keşif',
      })
    }

    if (createdAt && items.length < maxPrimaryCards) {
      items.push({
        id: 'account-created',
        icon: 'fa-solid fa-user-plus',
        color: 'grad-blue',
        title: 'Hesap Oluşturma Tarihi',
        time: 'Sistem',
        desc: `${childName} hesabı ${createdAt} tarihinde oluşturuldu.`,
        badge: 'Kayıtlı',
      })
    }

    if (items.length === 0) {
      items.push({
        id: 'no-metrics',
        icon: 'fa-solid fa-circle-info',
        color: 'grad-orange',
        title: 'Henüz Aktivite Verisi Yok',
        time: 'Sistem',
        desc: `${childName} için oyun/metrik verisi henüz oluşmamış.`,
        badge: 'Bekleniyor',
      })
    }

    return items
  }, [activeChild, childName])

  return (
    <div className="haberler-page">
      <div className="container">
        <header className="page-header">
          <h1>
            <span className="live-dot"></span> Güncel Akış
          </h1>
          <span className="header-date">
            Merhaba <span className="panel-user-name">{childName}</span>, keşfetmeye devam et!
          </span>
        </header>
        <div className="left-panel">
          <div className="hero-card">
            <div className="hero-content">
              <h2>Canlı Öğrenci Akışı</h2>
              <p>
                Bu alan seçili öğrencinin hesap verilerine göre otomatik olarak güncellenir.
              </p>
            </div>
            <Link className="primary-btn" to="/panel/ana-navigasyon">
              Panele Giriş Yap <i className="fa-solid fa-arrow-right-long"></i>
            </Link>
          </div>
        </div>
        <div className="news-grid">
          {newsItems.map((item) => (
            <div className="news-card" key={item.id}>
              <div className="card-header">
                <div className={`icon-box ${item.color}`}>
                  <i className={item.icon}></i>
                </div>
                <div className="card-info">
                  <h3>{item.title}</h3>
                  <span>{item.time}</span>
                </div>
              </div>
              <p className="card-desc">{highlightChildName(item.desc, childName)}</p>
              <div className="card-badge">{item.badge}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PanelHaberler
