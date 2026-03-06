import { useEffect, useRef, useState } from 'react'
import { useMarketingLanguage } from '../../../context/MarketingLanguageContext.jsx'

const STATS_COPY = {
  tr: {
    label: 'RAKAMLARLA BİZ',
    title: 'Rakamlarla',
    description: 'Büyüyen ekibimiz ve genişleyen etkimizle geleceğe emin adımlarla ilerliyoruz.',
    items: [
      {
        icon: 'fas fa-users',
        iconClass: 'icon-indigo',
        value: 15,
        suffix: '+',
        label: 'Uzman Ekip Üyesi',
        desc: 'Mühendis, psikolog ve veri bilimcileri',
      },
      {
        icon: 'fas fa-flask',
        iconClass: 'icon-amber',
        value: 8,
        suffix: '+',
        label: 'AR-GE Projesi',
        desc: 'Aktif geliştirme ve araştırma süreçleri',
      },
      {
        icon: 'fas fa-user-graduate',
        iconClass: 'icon-purple',
        value: 10,
        suffix: 'K+',
        label: 'Ulaşılan Kullanıcı',
        desc: 'Öğrenci, ebeveyn ve eğitimciler',
      },
      {
        icon: 'fas fa-gamepad',
        iconClass: 'icon-green',
        value: 50,
        suffix: 'K+',
        label: 'Simülasyon Saati',
        desc: 'Analiz edilen davranışsal veri',
      },
    ],
  },
  en: {
    label: 'BY THE NUMBERS',
    title: 'GeniusMethods in Numbers',
    description: 'With a growing team and expanding impact, we are moving toward the future with confidence.',
    items: [
      {
        icon: 'fas fa-users',
        iconClass: 'icon-indigo',
        value: 15,
        suffix: '+',
        label: 'Expert Team Members',
        desc: 'Engineers, psychologists, and data scientists',
      },
      {
        icon: 'fas fa-flask',
        iconClass: 'icon-amber',
        value: 8,
        suffix: '+',
        label: 'R&D Projects',
        desc: 'Active development and research streams',
      },
      {
        icon: 'fas fa-user-graduate',
        iconClass: 'icon-purple',
        value: 10,
        suffix: 'K+',
        label: 'Users Reached',
        desc: 'Students, parents, and educators',
      },
      {
        icon: 'fas fa-gamepad',
        iconClass: 'icon-green',
        value: 50,
        suffix: 'K+',
        label: 'Simulation Hours',
        desc: 'Behavioral data analyzed',
      },
    ],
  },
}

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    hasRun.current = false
    setCount(0)
  }, [target])

  const start = () => {
    if (hasRun.current) return
    hasRun.current = true

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      setCount(target)
      return
    }

    const startTime = performance.now()

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }

  return { count, start }
}

function StatCard({ icon, iconClass, value, suffix, label, desc, delay }) {
  const { count, start } = useCountUp(value)
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          start()
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [start])

  return (
    <div
      className="stat-card fade-up"
      ref={cardRef}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className={`stat-icon ${iconClass}`}>
        <i className={icon}></i>
      </div>
      <div className="stat-number">
        {count}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-desc">{desc}</div>
    </div>
  )
}

function StatsSection() {
  const { language } = useMarketingLanguage()
  const copy = STATS_COPY[language]

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-header">
          <span className="section-label fade-up">{copy.label}</span>
          <h2 className="fade-up" style={{ transitionDelay: '0.1s' }}>
            {copy.title === 'Rakamlarla'
              ? <>Rakamlarla <span className="text-gradient">GeniusMethods</span></>
              : <span className="text-gradient">{copy.title}</span>}
          </h2>
          <p className="fade-up" style={{ transitionDelay: '0.15s' }}>
            {copy.description}
          </p>
        </div>

        <div className="stats-grid">
          {copy.items.map((stat, index) => (
            <StatCard key={stat.label} {...stat} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
