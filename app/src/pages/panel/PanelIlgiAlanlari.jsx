import { useEffect, useMemo, useRef, useState } from 'react'
import SectionHeader from '../../components/panel/SectionHeader.jsx'
import { useParentChildData } from '../../context/ParentChildContext.jsx'
import '../../styles/panel-pages/ilgi-alanlari.css'

const RIASEC_BASE = [
  {
    key: 'R',
    label: 'Gerçekçi',
    color: '#EF4444',
    desc: 'Pratik çözümler, araç kullanımı ve uygulamalı görevler.',
  },
  {
    key: 'I',
    label: 'Araştırmacı',
    color: '#3B82F6',
    desc: 'Analitik düşünme, merak ve problem çözme odağı.',
  },
  {
    key: 'A',
    label: 'Yaratıcı',
    color: '#8B5CF6',
    desc: 'Hayal gücü, estetik ifade ve özgün üretim eğilimi.',
  },
  {
    key: 'S',
    label: 'Sosyal',
    color: '#10B981',
    desc: 'İletişim, empati ve iş birliği becerileri.',
  },
  {
    key: 'E',
    label: 'Girişimci',
    color: '#F59E0B',
    desc: 'Liderlik, hedef takibi ve inisiyatif alma gücü.',
  },
  {
    key: 'C',
    label: 'Sistematik',
    color: '#06B6D4',
    desc: 'Düzen, planlama, süreç takibi ve dikkat.',
  },
]

const RIASEC_DETAILS = [
  {
    key: 'R',
    title: 'Gerçekçi (Realistic)',
    summary: 'Somut ve uygulamalı görevlerde güçlüdür.',
    detail:
      'Bu profil, araç-gereç kullanımı ve teknik görevlerde hızlı sonuç üretir.',
    focus: 'Uygulama, teknik beceri, sahada çözüm',
    areas: 'Teknik işler, saha operasyonları, üretim odaklı roller',
  },
  {
    key: 'I',
    title: 'Araştırmacı (Investigative)',
    summary: 'Neden-sonuç ilişkisi kurma ve analiz becerisi yüksektir.',
    detail:
      'Veriyle düşünür, karmaşık konuları parçalayarak anlamlandırır.',
    focus: 'Analiz, araştırma, modelleme',
    areas: 'Veri analizi, AR-GE, analist rolleri',
  },
  {
    key: 'A',
    title: 'Yaratıcı (Artistic)',
    summary: 'Özgün fikir üretimi ve estetik yaklaşım öne çıkar.',
    detail:
      'Standart çözümler yerine farklı bakış açıları geliştirmeyi sever.',
    focus: 'Yaratıcılık, tasarım, ifade',
    areas: 'Tasarım, içerik üretimi, yaratıcı proje ekipleri',
  },
  {
    key: 'S',
    title: 'Sosyal (Social)',
    summary: 'İnsanlarla iletişim ve destek verme motivasyonu güçlüdür.',
    detail:
      'Takım içinde uyum kurar, rehberlik eder ve etkileşimi artırır.',
    focus: 'Empati, iletişim, rehberlik',
    areas: 'Eğitim, insan kaynakları, danışmanlık',
  },
  {
    key: 'E',
    title: 'Girişimci (Enterprising)',
    summary: 'Yönlendirme, karar alma ve etki oluşturma becerisi belirgindir.',
    detail:
      'Hedef belirler, insanları motive eder ve sonuç odaklı ilerler.',
    focus: 'Liderlik, ikna, hedef yönetimi',
    areas: 'Satış, iş geliştirme, ürün yönetimi',
  },
  {
    key: 'C',
    title: 'Sistematik (Conventional)',
    summary: 'Düzenli çalışma ve süreç takibinde istikrarlıdır.',
    detail:
      'Planlı adımlarla ilerler, kayıt tutma ve kalite kontrolde güven verir.',
    focus: 'Düzen, standardizasyon, raporlama',
    areas: 'Operasyon, finans süreçleri, koordinasyon',
  },
]

const CX = 200
const CY = 200
const MAX_R = 130
const LABEL_R = MAX_R + 32

function getPoint(index, radius) {
  const angle = -Math.PI / 2 + (index * Math.PI) / 3
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)]
}

function makeHex(radius) {
  return Array.from({ length: 6 }, (_, i) => getPoint(i, radius).join(',')).join(' ')
}

function asPercent(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return 0
  return Math.max(0, Math.min(100, Math.round(number)))
}

function toRiasecScoresFromSummary(riasecSummary = {}) {
  const normalizedSummary = Object.entries(riasecSummary || {}).reduce((acc, [rawKey, rawValue]) => {
    const key = String(rawKey || '').trim().toLowerCase()
    if (!key) return acc
    acc[key] = rawValue || {}
    return acc
  }, {})

  return {
    R: asPercent(normalizedSummary?.realistic?.report_score),
    I: asPercent(normalizedSummary?.investigative?.report_score),
    A: asPercent(normalizedSummary?.artistic?.report_score),
    S: asPercent(normalizedSummary?.social?.report_score),
    E: asPercent(normalizedSummary?.enterprising?.report_score),
    C: asPercent(normalizedSummary?.conventional?.report_score),
  }
}

function PanelIlgiAlanlari() {
  const { activeChild } = useParentChildData()
  const [showPopup, setShowPopup] = useState(true)
  const [closing, setClosing] = useState(false)
  const [selected, setSelected] = useState([])
  const [isRiasecDetailsOpen, setIsRiasecDetailsOpen] = useState(false)
  const [focusedModelKey, setFocusedModelKey] = useState(null)
  const [highlightInspectButtons, setHighlightInspectButtons] = useState(false)
  const [didRunInspectAnimation, setDidRunInspectAnimation] = useState(false)
  const comparePanelRef = useRef(null)
  const inspectAnimationTimeoutRef = useRef(null)

  const riasecScores = useMemo(() => {
    const riasecSummary =
      activeChild?.gameData?.playerStats?.riasec_summary ||
      activeChild?.gameData?.rawPlayerStats?.riasec_summary ||
      {}

    return toRiasecScoresFromSummary(riasecSummary)
  }, [activeChild])
  const riasecData = useMemo(
    () =>
      RIASEC_BASE.map((dim) => ({
        ...dim,
        score: asPercent(riasecScores?.[dim.key]),
      })),
    [riasecScores]
  )

  const dataPolygon = useMemo(
    () => riasecData.map((d, i) => getPoint(i, (d.score / 100) * MAX_R).join(',')).join(' '),
    [riasecData]
  )

  const focusedModel = RIASEC_DETAILS.find((item) => item.key === focusedModelKey) || null

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setShowPopup(false)
      setClosing(false)
    }, 600)
  }

  const toggle = (key) => {
    const isRemoving = selected.includes(key)
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
    if (!isRemoving) {
      setTimeout(() => {
        comparePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
    }
  }

  const toggleRiasecDetails = () => {
    setIsRiasecDetailsOpen((prev) => {
      const next = !prev
      if (!next) {
        setFocusedModelKey(null)
      }
      return next
    })
  }

  const openModelDetail = (key) => setFocusedModelKey(key)
  const closeModelDetail = () => setFocusedModelKey(null)

  useEffect(() => {
    return () => {
      if (inspectAnimationTimeoutRef.current) {
        clearTimeout(inspectAnimationTimeoutRef.current)
      }
    }
  }, [])

  const handleRiasecWidgetTransitionEnd = (event) => {
    if (event.propertyName !== 'max-height') return
    if (!isRiasecDetailsOpen) return
    if (focusedModel) return
    if (didRunInspectAnimation) return

    setHighlightInspectButtons(true)
    setDidRunInspectAnimation(true)

    if (inspectAnimationTimeoutRef.current) {
      clearTimeout(inspectAnimationTimeoutRef.current)
    }
    inspectAnimationTimeoutRef.current = setTimeout(() => {
      setHighlightInspectButtons(false)
      inspectAnimationTimeoutRef.current = null
    }, 850)
  }

  return (
    <div>
      {showPopup && (
        <div className={`riasec-overlay ${closing ? 'closing' : ''}`} onClick={handleClose}>
          <div className="riasec-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-badge">
              <i className="fa-solid fa-compass"></i>
            </div>
            <h2 className="popup-title">RIASEC Kişilik Modeli</h2>
            <p className="popup-desc">
              Holland&apos;ın RIASEC modeli, bireylerin ilgi alanlarını 6 boyutta analiz eder.
              Oyun içi performans verileriyle bu profil otomatik hesaplanır.
            </p>
            <div className="popup-dims">
              {riasecData.map((d) => (
                <div className="popup-dim" key={d.key}>
                  <span className="pd-dot" style={{ background: d.color }}>
                    {d.key}
                  </span>
                  <div className="pd-info">
                    <strong>{d.label}</strong>
                    <span>{d.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="popup-btn" type="button" onClick={handleClose}>
              <i className="fa-solid fa-play"></i> Keşfetmeye Başla
            </button>
          </div>
        </div>
      )}

      <div className={`ilgi-content ${!showPopup ? 'visible' : ''}`}>
        <SectionHeader
          title="İlgi Alanları ve Kişilik Haritası"
          description="RIASEC modeline dayalı kişilik analizi ve boyut karşılaştırması."
        />

        <div className="ilgi-main-col">
          <div className="radar-card">
            <div className="radar-card-header">
              <div>
                <h3 className="radar-title">
                  <i className="fa-solid fa-chart-pie"></i> Holland (RIASEC) Analizi
                </h3>
                <p className="radar-subtitle">
                  Grafikteki harflere tıklayarak boyutları karşılaştır.
                </p>
              </div>
            </div>

            <div className="radar-layout">
              <div className="radar-body">
                <div className="radar-chart-area">
                  <svg viewBox="0 0 400 400" className="radar-svg">
                    <polygon points={makeHex(MAX_R)} className="hex-grid" />
                    <polygon points={makeHex(MAX_R * 0.66)} className="hex-grid" />
                    <polygon points={makeHex(MAX_R * 0.33)} className="hex-grid" />

                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const [x, y] = getPoint(i, MAX_R)
                      return <line key={i} x1={CX} y1={CY} x2={x} y2={y} className="hex-axis" />
                    })}

                    <polygon points={dataPolygon} className="data-polygon" />

                    {riasecData.map((d, i) => {
                      const [x, y] = getPoint(i, (d.score / 100) * MAX_R)
                      return <circle key={d.key} cx={x} cy={y} r="5" fill={d.color} />
                    })}

                    {riasecData.map((d, i) => {
                      const [x, y] = getPoint(i, LABEL_R)
                      const isActive = selected.includes(d.key)
                      return (
                        <g
                          key={d.key}
                          onClick={() => toggle(d.key)}
                          style={{ cursor: 'pointer' }}
                          className="radar-node"
                        >
                          <circle
                            cx={x}
                            cy={y}
                            r="20"
                            className={`node-bg ${isActive ? 'active' : ''}`}
                            style={isActive ? { fill: d.color } : undefined}
                          />
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`node-text ${isActive ? 'active' : ''}`}
                          >
                            {d.key}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>

                <div className="riasec-legend">
                  {riasecData.map((d) => {
                    const isActive = selected.includes(d.key)
                    return (
                      <button
                        key={d.key}
                        type="button"
                        className={`legend-btn ${isActive ? 'active' : ''}`}
                        style={
                          isActive ? { borderColor: d.color, background: `${d.color}0D` } : undefined
                        }
                        onClick={() => toggle(d.key)}
                      >
                        <span className="lb-dot" style={{ background: d.color }}>
                          {d.key}
                        </span>
                        <span className="lb-name">{d.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="riasec-side-col">
                <div className="riasec-drawer-toolbar">
                  <button
                    className={`riasec-drawer-toggle ${isRiasecDetailsOpen ? 'open' : ''}`}
                    type="button"
                    onClick={toggleRiasecDetails}
                    aria-expanded={isRiasecDetailsOpen}
                    aria-controls="riasecInfoWidget"
                  >
                    <span className="riasec-toggle-left">
                      <i className="fa-solid fa-book-open"></i> RIASEC Açıklamaları
                    </span>
                    <i className="fa-solid fa-chevron-down riasec-toggle-icon"></i>
                  </button>
                </div>

                <aside
                  id="riasecInfoWidget"
                  className={`riasec-info-widget ${isRiasecDetailsOpen ? 'open' : ''} ${
                    focusedModel ? 'focus-mode' : ''
                  }`}
                  aria-hidden={!isRiasecDetailsOpen}
                  onTransitionEnd={handleRiasecWidgetTransitionEnd}
                >
                  <div className="riasec-widget-head">
                    <h3 className="riasec-widget-title">
                      <i className="fa-solid fa-circle-info"></i> RIASEC Detayları
                    </h3>
                    <p className="riasec-widget-subtitle">
                      Holland modelindeki 6 boyutun davranışsal anlamları.
                    </p>
                  </div>

                  {focusedModel ? (
                    <div className="riasec-focus-card">
                      <div className="riasec-focus-head">
                        <div className="riasec-focus-title-wrap">
                          <span
                            className="rw-dot"
                            style={{
                              background: riasecData.find((d) => d.key === focusedModel.key)?.color,
                            }}
                          >
                            {focusedModel.key}
                          </span>
                          <h4>{focusedModel.title}</h4>
                        </div>
                        <button type="button" className="riasec-focus-close" onClick={closeModelDetail}>
                          Kapat
                        </button>
                      </div>
                      {focusedModel.key === 'R' ? (
                        <div className="riasec-focus-rich">
                          <p className="riasec-focus-summary">
                            Holland&apos;ın teorisinde &quot;Yapanlar&quot; (Doers) olarak tanımlanan bu
                            grup, sözden çok eyleme, teoriden çok pratiğe odaklanmasıyla bilinir.
                          </p>

                          <div className="riasec-rich-section">
                            <h5>1. Temel Felsefe: &quot;Somut ve Uygulanabilir Olmalı&quot;</h5>
                            <p>
                              Gerçekçi tipin dünyası nesneler, makineler ve doğa üzerine kuruludur.
                              Soyut tartışmalar veya karmaşık duygusal analizler yerine; &quot;Bu nasıl
                              çalışır?&quot; veya &quot;Bu nasıl inşa edilir?&quot; gibi net cevabı olan somut
                              problemlerle ilgilenirler. Öğrenme tarzları, dinlemekten ziyade
                              &quot;söküp takarak&quot; deneyimlemektir.
                            </p>
                          </div>

                          <div className="riasec-rich-section">
                            <h5>2. Karakter Yapısı: Doğal ve Pratik</h5>
                            <ul className="riasec-rich-list">
                              <li>
                                Dürüst ve Net: Yapmacıklıktan uzak, oldukları gibi davranırlar.
                                Düşüncelerini dolandırmadan ifade ederler.
                              </li>
                              <li>
                                Sabırlı: Fiziksel bir işi tamamlarken (bir motoru onarmak gibi)
                                yüksek odaklanma ve sabır gösterirler.
                              </li>
                              <li>
                                Sessiz Güç: Sosyal becerileri sergilemektense, teknik becerileriyle
                                konuşmayı tercih ederler. İnsanları ikna etme süreçlerinde çekingen
                                kalabilirler.
                              </li>
                            </ul>
                          </div>

                          <div className="riasec-rich-section">
                            <h5>3. Neleri Severler, Nelerden Kaçarlar?</h5>
                            <ul className="riasec-rich-list">
                              <li>
                                Sevdikleri: Açık havada olmak, el aletleri kullanmak, elektronik
                                cihazlarla uğraşmak, bitki yetiştirmek ve somut projeler üretmek.
                              </li>
                              <li>
                                Sevmedikleri: Başkalarına öğretmenlik yapmak, satış odaklı ikna
                                süreçleri veya sürekli masa başı evrak işleri. &quot;İnsan odaklı&quot;
                                sorunlar onları &quot;nesne odaklı&quot; sorunlardan daha fazla yorar.
                              </li>
                            </ul>
                          </div>

                          <div className="riasec-rich-section">
                            <h5>4. Örnek Durum: Kahve Makinesi Arızası</h5>
                            <p>
                              Bir ofiste kahve makinesi bozulduğunda, Gerçekçi tip sorunu konuşarak
                              veya teorik kılavuzları okuyarak çözmeye çalışmaz. Doğrudan alet
                              çantasını getirir, makineyi söker, sorunu fiziksel olarak tespit eder
                              ve tamir eder. Süreç kelimelerle değil, eylemle tamamlanır.
                            </p>
                          </div>

                          <div className="riasec-rich-section">
                            <h5>5. Uygun Kariyer Alanları</h5>
                            <p>
                              Teknik ve mekanik yeteneklerin somut çıktıya dönüştüğü alanlar bu
                              profil için idealdir:
                            </p>
                            <ul className="riasec-rich-list">
                              <li>Mühendislik: Makine, İnşaat, Elektrik-Elektronik, Yazılım.</li>
                              <li>
                                Teknik ve Zanaat: Otomobil tamirciliği, elektrikçilik, marangozluk.
                              </li>
                              <li>Doğa: Ziraat mühendisliği, veterinerlik, ormancılık.</li>
                              <li>Operasyonel: Pilotluk, şoförlük, cerrahlık.</li>
                            </ul>
                          </div>

                          <p className="riasec-rich-note">
                            Özetle: Gerçekçi tip, dünyayı fiziksel olarak inşa eden ve onaran
                            kişidir. Onlar için geçerli kural şudur: &quot;Bana anlatma, nasıl
                            yapıldığını göster.&quot;
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="riasec-focus-summary">{focusedModel.summary}</p>
                          <p className="riasec-focus-detail">{focusedModel.detail}</p>
                          <div className="riasec-focus-meta">
                            <div className="riasec-focus-meta-item">
                              <span>Odak</span>
                              <p>{focusedModel.focus}</p>
                            </div>
                            <div className="riasec-focus-meta-item">
                              <span>Uygun Alanlar</span>
                              <p>{focusedModel.areas}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="riasec-widget-list">
                      {RIASEC_DETAILS.map((item) => {
                        const dim = riasecData.find((d) => d.key === item.key)
                        return (
                          <article className="riasec-widget-item" key={item.key}>
                            <span className="rw-dot" style={{ background: dim?.color }}>
                              {item.key}
                            </span>
                            <div className="rw-text">
                              <div className="rw-head">
                                <h4>{item.title}</h4>
                                <button
                                  type="button"
                                  className={`rw-btn ${highlightInspectButtons ? 'shake' : ''}`}
                                  onClick={() => openModelDetail(item.key)}
                                >
                                  İncele
                                </button>
                              </div>
                              <p>{item.summary}</p>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  )}

                  {!focusedModel ? (
                    <p className="riasec-widget-source">
                      Kaynak:{' '}
                      <a
                        href="https://personalityjunkie.com/holland-code-riasec-career-interests-myers-briggs-types/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Personality Junkie - Holland Code (RIASEC)
                      </a>
                    </p>
                  ) : null}
                </aside>
              </div>
            </div>
          </div>

          <div className="compare-panel" ref={comparePanelRef}>
            <div className="compare-header">
              <h3 className="compare-title">
                <i className="fa-solid fa-sliders"></i> Karşılaştırma Paneli
              </h3>
              {selected.length > 0 && (
                <button className="compare-clear" type="button" onClick={() => setSelected([])}>
                  <i className="fa-solid fa-rotate-left"></i> Temizle
                </button>
              )}
            </div>

            {selected.length === 0 ? (
              <div className="compare-empty">
                <i className="fa-solid fa-arrow-pointer"></i>
                <p>Karşılaştırmak için grafikteki harflere veya alttaki etiketlere tıkla.</p>
              </div>
            ) : (
              <div className="compare-bars">
                {selected.map((key) => {
                  const dim = riasecData.find((d) => d.key === key)
                  if (!dim) return null
                  return (
                    <div className="compare-row" key={key}>
                      <div className="cr-info">
                        <span className="cr-dot" style={{ background: dim.color }}>
                          {dim.key}
                        </span>
                        <div className="cr-text">
                          <span className="cr-name">{dim.label}</span>
                          <span className="cr-desc">{dim.desc}</span>
                        </div>
                      </div>
                      <div className="cr-bar-area">
                        <div className="cr-track">
                          <div
                            className="cr-fill"
                            style={{ width: `${dim.score}%`, background: dim.color }}
                          ></div>
                        </div>
                      </div>
                      <button className="cr-remove" type="button" onClick={() => toggle(key)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelIlgiAlanlari
