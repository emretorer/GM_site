import { useState, useRef, useCallback, useEffect } from 'react'
import SectionHeader from '../../components/panel/SectionHeader.jsx'
import '../../styles/panel-pages/oyun-bilgileri.css'

const sections = [
  {
    id: 'what',
    icon: 'fa-solid fa-circle-question',
    color: '#3B82F6',
    title: 'Bu Oyun Ne Yapıyor?',
    text: 'Çocuğunuz bu oyunda kısa görevler ve mini oyunlar oynuyor. Her görevde farklı kararlar alıyor, farklı yollar deniyor. Oyun bu sırada arka planda çocuğunuzun nelerde iyi olduğunu, neleri sevdiğini ve nasıl düşündüğünü fark ediyor. Yani çocuğunuz eğlenirken, biz onun güçlü yönlerini öğreniyoruz.'
  },
  {
    id: 'how',
    icon: 'fa-solid fa-wand-magic-sparkles',
    color: '#8B5CF6',
    title: 'Nasıl Çalışıyor?',
    text: 'Çocuğunuz oynarken yaptığı tercihler (hangi görevi seçtiği, nasıl çözdüğü, ne kadar sürede karar verdiği gibi) sessizce kaydediliyor. Bunlar bir sınav gibi değil, hiçbir doğru ya da yanlış cevap yok. Oyun, bu bilgileri birleştirip çocuğunuzun kişilik eğilimlerini ve yeteneklerini anlamlı bir haritaya dönüştürüyor.'
  },
  {
    id: 'panel',
    icon: 'fa-solid fa-chart-pie',
    color: '#10B981',
    title: 'Bu Panelde Ne Görüyorum?',
    text: 'Bu paneldeki sayfalar, çocuğunuzun oyun içindeki davranışlarından çıkan sonuçları gösteriyor. Hangi alanlarda güçlü olduğunu, nelere ilgi duyduğunu, nasıl bir kişilik yapısına sahip olduğunu buradan takip edebilirsiniz. Zamanla bu sonuçlar değişebilir, çünkü çocuğunuz büyüdükçe ilgileri ve yetenekleri de gelişiyor.'
  },
  {
    id: 'riasec',
    icon: 'fa-solid fa-shapes',
    color: '#F59E0B',
    title: 'RIASEC, Yetenek Barları Falan... Bunlar Ne?',
    text: 'Panelde göreceğiniz grafik ve barlar, çocuğunuzun oyundaki davranışlarını özetliyor. Örneğin "Araştırmacı" yüksekse merak eden, sorgulayan bir yapıda demek. "Yaratıcı" yüksekse hayal gücü kuvvetli demek. Bunlar etiket değil, sadece o an için gözlemlenen eğilimler. Hiçbir şey kesin ya da kalıcı değil, zaman içinde değişebilir.'
  },
  {
    id: 'safe',
    icon: 'fa-solid fa-shield-halved',
    color: '#06B6D4',
    title: 'Güvenli mi?',
    text: 'Çocuğunuzun verileri sadece size ait. Kimseyle paylaşılmıyor, reklam için kullanılmıyor. İstediğiniz zaman tüm verileri silebilirsiniz. Oyun içinde çocuğunuza hiçbir puan, başarısızlık ya da sıralama gösterilmiyor. Amacımız onu test etmek değil, anlamak.'
  },
  {
    id: 'parent',
    icon: 'fa-solid fa-heart',
    color: '#EF4444',
    title: 'Benden Ne Bekleniyor?',
    text: 'Sizden teknik bir şey beklenmiyor. Çocuğunuzun arada oyun oynamasına izin vermeniz yeterli. Siz de bu panelden gelişimini takip edebilir, ilgilendiği alanlara göre ona gerçek hayatta fırsatlar sunabilirsiniz. Mesela yaratıcılığı yüksek çıkıyorsa bir resim kursu, araştırmacı yönü güçlüyse bir bilim seti güzel bir adım olabilir.'
  }
]

const iconDefs = [
  { icon: 'fa-solid fa-gamepad', color: '#3B82F6' },
  { icon: 'fa-solid fa-puzzle-piece', color: '#6D28D9' },
  { icon: 'fa-solid fa-star', color: '#F59E0B' },
  { icon: 'fa-solid fa-brain', color: '#10B981' },
  { icon: 'fa-solid fa-rocket', color: '#EF4444' },
  { icon: 'fa-solid fa-lightbulb', color: '#06B6D4' },
  { icon: 'fa-solid fa-trophy', color: '#F59E0B' },
  { icon: 'fa-solid fa-medal', color: '#7C3AED' },
  { icon: 'fa-solid fa-chart-line', color: '#3B82F6' },
  { icon: 'fa-solid fa-gem', color: '#EF4444' },
]

const ICON_SIZE = 28
const ICON_R = 20
const CURSOR_R = 60
const BOUNCE = 0.85
const SPEED_MIN = 0.6
const SPEED_MAX = 1.4

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function FloatingIcons({ popupRef }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const mouse = useRef({ x: -999, y: -999 })
  const raf = useRef(null)

  useEffect(() => {
    const container = canvasRef.current
    if (!container) return

    const W = container.clientWidth
    const H = container.clientHeight

    // Init particles around edges, away from center
    particles.current = iconDefs.map(() => {
      const angle = Math.random() * Math.PI * 2
      const speed = randomBetween(SPEED_MIN, SPEED_MAX)
      return {
        x: randomBetween(ICON_R, W - ICON_R),
        y: randomBetween(ICON_R, H - ICON_R),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      }
    })

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onMouseLeave = () => {
      mouse.current = { x: -999, y: -999 }
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    const els = container.querySelectorAll('.about-float-icon')

    function tick() {
      const popup = popupRef?.current
      let popupRect = null
      if (popup) {
        const cr = popup.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        popupRect = {
          left: cr.left - containerRect.left - 16,
          top: cr.top - containerRect.top - 16,
          right: cr.right - containerRect.left + 16,
          bottom: cr.bottom - containerRect.top + 16,
        }
      }

      const cW = container.clientWidth
      const cH = container.clientHeight

      particles.current.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        // Wall bounce
        if (p.x <= ICON_R) { p.x = ICON_R; p.vx = Math.abs(p.vx) * BOUNCE }
        if (p.x >= cW - ICON_R) { p.x = cW - ICON_R; p.vx = -Math.abs(p.vx) * BOUNCE }
        if (p.y <= ICON_R) { p.y = ICON_R; p.vy = Math.abs(p.vy) * BOUNCE }
        if (p.y >= cH - ICON_R) { p.y = cH - ICON_R; p.vy = -Math.abs(p.vy) * BOUNCE }

        // Popup bounce
        if (popupRect) {
          const cx = p.x
          const cy = p.y
          const nearestX = Math.max(popupRect.left, Math.min(cx, popupRect.right))
          const nearestY = Math.max(popupRect.top, Math.min(cy, popupRect.bottom))
          const dx = cx - nearestX
          const dy = cy - nearestY
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < ICON_R) {
            const angle = Math.atan2(dy || 0.01, dx || 0.01)
            const pushDist = ICON_R - dist + 2
            p.x += Math.cos(angle) * pushDist
            p.y += Math.sin(angle) * pushDist
            // Reflect velocity
            const dot = p.vx * Math.cos(angle) + p.vy * Math.sin(angle)
            if (dot < 0) {
              p.vx -= 2 * dot * Math.cos(angle)
              p.vy -= 2 * dot * Math.sin(angle)
            }
            p.vx *= BOUNCE
            p.vy *= BOUNCE
          }
        }

        // Cursor repel
        const mdx = p.x - mouse.current.x
        const mdy = p.y - mouse.current.y
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mDist < CURSOR_R && mDist > 0) {
          const force = (CURSOR_R - mDist) / CURSOR_R * 3
          const mAngle = Math.atan2(mdy, mdx)
          p.vx += Math.cos(mAngle) * force
          p.vy += Math.sin(mAngle) * force
        }

        // Speed clamp
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 3) {
          p.vx = (p.vx / spd) * 3
          p.vy = (p.vy / spd) * 3
        }
        if (spd < SPEED_MIN) {
          const bump = SPEED_MIN / (spd || 0.1)
          p.vx *= bump
          p.vy *= bump
        }

        if (els[i]) {
          els[i].style.transform = `translate(${p.x - ICON_SIZE / 2}px, ${p.y - ICON_SIZE / 2}px)`
        }
      })

      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf.current)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [popupRef])

  return (
    <div className="about-floating-icons" ref={canvasRef}>
      {iconDefs.map((fi, i) => (
        <i
          key={i}
          className={`${fi.icon} about-float-icon`}
          style={{ color: fi.color }}
        ></i>
      ))}
    </div>
  )
}

function PanelOyunBilgileri() {
  const [showPopup, setShowPopup] = useState(true)
  const [closing, setClosing] = useState(false)
  const [openId, setOpenId] = useState(null)
  const blockRefs = useRef({})
  const popupRef = useRef(null)

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setShowPopup(false)
      setClosing(false)
    }, 600)
  }

  const handleToggle = useCallback((id) => {
    const isClosing = openId === id
    setOpenId(isClosing ? null : id)

    if (!isClosing) {
      setTimeout(() => {
        blockRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 80)
    }
  }, [openId])

  return (
    <div>
      {showPopup && (
        <div className={`about-overlay ${closing ? 'closing' : ''}`} onClick={handleClose}>
          <FloatingIcons popupRef={popupRef} />
          <div className="about-popup" ref={popupRef} onClick={(e) => e.stopPropagation()}>
            <div className="about-popup-badge">
              <i className="fa-solid fa-hand-holding-heart"></i>
            </div>
            <p className="about-popup-text">
              Bu sayfayı, oyunu hiç bilmeseniz bile her şeyi rahatça anlayabilesiniz diye
              hazırladık. Teknik terimler yerine, sade bir dille anlatmaya çalıştık.
            </p>
            <button className="about-popup-btn" type="button" onClick={handleClose}>
              <i className="fa-solid fa-arrow-right"></i> Sayfaya Geç
            </button>
          </div>
        </div>
      )}

      <div className={`about-page-content ${!showPopup ? 'visible' : ''}`}>
        <SectionHeader
          title="Oyunumuz Hakkında"
          description="Veliler için sade bir anlatımla, bu platformda neler olduğunu ve ne işe yaradığını öğrenin."
        />

        <div className="about-sections">
          {sections.map((s) => {
            const isOpen = openId === s.id
            return (
              <div
                className={`about-block ${isOpen ? 'open' : ''}`}
                key={s.id}
                ref={(el) => { blockRefs.current[s.id] = el }}
              >
                <button
                  className="ab-header"
                  type="button"
                  onClick={() => handleToggle(s.id)}
                >
                  <div className="ab-icon" style={{ background: `${s.color}14`, color: s.color }}>
                    <i className={s.icon}></i>
                  </div>
                  <h3 className="ab-title">{s.title}</h3>
                  <i className={`fa-solid fa-chevron-down ab-chevron ${isOpen ? 'rotated' : ''}`}></i>
                </button>
                <div className={`ab-body ${isOpen ? 'open' : ''}`}>
                  <p className="ab-text">{s.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PanelOyunBilgileri
