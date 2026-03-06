import { useState, useEffect, useMemo } from 'react'
import SectionHeader from '../../components/panel/SectionHeader.jsx'
import { useParentChildData } from '../../context/ParentChildContext.jsx'
import '../../styles/panel-pages/gelisim-agaci.css'

const baseCategories = [
  {
    id: 'realistic', name: 'Gerçekçi', icon: 'fa-solid fa-hammer', color: '#EF4444',
    tasks: [
      { name: 'Plajda İçecek', metric: 'El Becerisi ve Hassas Motor Kontrolü Yeteneği', progress: 0 },
      { name: 'Bozuk Traktör', metric: 'Araç ve Ekipman Kullanımı', progress: 0 },
      { name: 'Liman Lojistik', metric: 'İş Akışını ve Sıralamayı Yönetme', progress: 0 },
      { name: 'Nükleer Santral', metric: 'Duyusal Algı Yeteneği', progress: 0 },
      { name: 'Arcade', metric: 'Dayanıklılık ve Refleks', progress: 0 }
    ]
  },
  {
    id: 'artistic', name: 'Yaratıcı', icon: 'fa-solid fa-palette', color: '#EC4899',
    tasks: [
      { name: 'Reklamcı', metric: 'Harmoni ve Kompozisyon Yeteneği', progress: 100 },
      { name: 'Araç Modifiye', metric: 'Yaratıcı Düşünme ve Soyutlama', progress: 95 },
      { name: 'Sanat Galerisi', metric: 'Duyusal Estetik Algısı (Ses)', progress: 88 },
      { name: 'Ressam', metric: 'Bütüne ve Detaylara Hakim Olma', progress: 72 },
      { name: 'İnşaat Müh.', metric: 'Malzeme ve Dokularla Çalışma', progress: 35 }
    ]
  },
  {
    id: 'social', name: 'Sosyal', icon: 'fa-solid fa-users', color: '#06B6D4',
    tasks: [
      { name: 'Su Tasarruf', metric: 'Toplumu Bilgilendirme ve Farkındalık Yaratma', progress: 100 },
      { name: 'Okul', metric: 'Esneklik ve Bireysel İhtiyaçlara Çözüm', progress: 92 },
      { name: 'Huzur Evi', metric: 'Esneklik ve Bireysel İhtiyaçlara Çözüm', progress: 85 },
      { name: 'Başkana Ulaş', metric: 'İnsanlarla Hızlı ve Etkili İletişim Kurma', progress: 48 },
      { name: 'Gazeteci', metric: 'Empati ve Toplumsal Duyarlılık', progress: 20 }
    ]
  },
  {
    id: 'conventional', name: 'Düzenli', icon: 'fa-solid fa-clipboard-check', color: '#F59E0B',
    tasks: [
      { name: 'Kütüphane', metric: 'Arşivleme ve Bilgi Saklama Yeteneği', progress: 100 },
      { name: 'Giyim Mağazası', metric: 'Dökümantasyon ve Raporlama Yeteneği', progress: 40 },
      { name: 'Hastahane', metric: 'Kural ve Prosedürlere Üst Düzey Uyumluluk', progress: 15 },
      { name: 'Temizlik', metric: 'Rutin ve Tekrarlayan İşlerde Yüksek Performans', progress: 8 },
      { name: 'Manav', metric: 'İnce Ayrıntıları Farketme', progress: 0 }
    ]
  },
  {
    id: 'enterprising', name: 'Girişimci', icon: 'fa-solid fa-briefcase', color: '#EF4444',
    tasks: [
      { name: 'Komisyoncu', metric: 'Yerel ve Küresel Pazarı Okuyabilme', progress: 100 },
      { name: 'Koleksiyoncu', metric: 'Fırsat Algısı ve Avantaj Yakalama', progress: 78 },
      { name: 'Gazete Küpür', metric: 'İnsan Psikolojisini Kâr Stratejisine Dönüştürme', progress: 52 },
      { name: 'Balıkçı', metric: 'Kendi Ekosistemini Yönetebilme', progress: 25 },
      { name: 'Dondurma', metric: 'Rekabet ve Pazar Stratejisi', progress: 5 }
    ]
  },
  {
    id: 'investigative', name: 'Araştırmacı', icon: 'fa-solid fa-microscope', color: '#14B8A6',
    tasks: [
      { name: 'BrainClub', metric: 'Karmaşık Sistemleri Analiz Etme', progress: 100 },
      { name: 'Müze Dedektif', metric: 'Sebep-Sonuç İlişkisi Kurma', progress: 100 },
      { name: 'Diyetisyen', metric: 'Veri Temelli Karar Alma', progress: 100 },
      { name: 'Motel', metric: 'Hata ve Tutarsızlıkları Tespit Etme', progress: 100 },
      { name: 'Uçak', metric: 'Modelleme ve Simülasyon Yapabilme', progress: 100 }
    ]
  }
]

function PanelGelisimAgaci() {
  const { activeChild } = useParentChildData()
  const [animated, setAnimated] = useState(false)

  const taskProgressMap = activeChild?.gameData?.taskProgress || {}
  const categories = useMemo(
    () =>
      baseCategories.map((category) => ({
        ...category,
        tasks: category.tasks.map((task) => ({
          ...task,
          progress: Math.max(
            0,
            Math.min(
              100,
              Number(taskProgressMap?.[task.name] ?? taskProgressMap?.[task.metric] ?? 0)
            )
          ),
        })),
      })),
    [taskProgressMap]
  )

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 1300)
    return () => clearTimeout(t)
  }, [])

  const totalTasks = categories.reduce((s, c) => s + c.tasks.length, 0)
  const playedTasks = categories.reduce((s, c) => s + c.tasks.filter((t) => t.progress > 0).length, 0)
  const certCount = categories.filter((c) => c.tasks.every((t) => t.progress > 0)).length
  const strongest = categories.reduce((best, cat) => {
    const avg = cat.tasks.reduce((s, t) => s + t.progress, 0) / cat.tasks.length
    const bestAvg = best.tasks.reduce((s, t) => s + t.progress, 0) / best.tasks.length
    return avg > bestAvg ? cat : best
  })

  return (
    <div>
      <SectionHeader
        title="Gelişim Ağacı"
        description="Bu alanda çocuğunuzun hangi görevleri yaptığı, hangi alanlarda daha rahat ilerlediği ve nerelerde desteğe ihtiyaç duyduğu sade bir şekilde gösterilir."
        containerClassName="ga-page-header"
        titleClassName="ga-page-title"
        descClassName="ga-page-desc"
      />

      <div className="ga-stats">
        <div className="ga-stat-card">
          <div className="ga-stat-icon">
            <i className="fa-solid fa-gamepad"></i>
          </div>
          <div className="ga-stat-info">
            <span className="ga-stat-num">{playedTasks}<span className="ga-stat-total">/{totalTasks}</span></span>
            <span className="ga-stat-label">Oynanan Görev</span>
          </div>
        </div>
        <div className="ga-stat-card">
          <div className="ga-stat-icon cert">
            <i className="fa-solid fa-certificate"></i>
          </div>
          <div className="ga-stat-info">
            <span className="ga-stat-num">{certCount}<span className="ga-stat-total">/6</span></span>
            <span className="ga-stat-label">Sertifika</span>
          </div>
        </div>
        <div className="ga-stat-card">
          <div className="ga-stat-icon strong">
            <i className={strongest.icon}></i>
          </div>
          <div className="ga-stat-info">
            <span className="ga-stat-num">{strongest.name}</span>
            <span className="ga-stat-label">En Güçlü Alan</span>
          </div>
        </div>
      </div>

      <div className="matrix-container">
        <div className="matrix-header">
          <h3><i className="fa-solid fa-table-cells"></i> Görev İlerlemesi</h3>
          <div className="legend">
            <div className="legend-item"><div className="dot played"></div> Oynandı</div>
            <div className="legend-item"><div className="dot empty"></div> Oynanmadı</div>
          </div>
        </div>

        <div className="progress-grid">
          {categories.map((cat, ri) => {
            const hasCert = cat.tasks.every(t => t.progress > 0)
            return (
              <div className="grid-row" key={cat.id}>
                <div className="row-label">
                  <div className="row-icon" style={{ background: `${cat.color}14`, color: cat.color }}>
                    <i className={cat.icon}></i>
                  </div>
                  <span className="row-name">{cat.name}</span>
                </div>

                {cat.tasks.map((task, ci) => {
                  const played = task.progress > 0
                  return (
                    <div
                      className="step-cell"
                      key={ci}
                      style={{ '--cell-delay': `${ri * 0.1 + ci * 0.08}s`, '--cell-color': cat.color }}
                    >
                      <span className="step-task-name">{task.name}</span>
                      <div className="step-box">
                        <div
                          className="step-fill"
                          style={{
                            width: animated ? `${task.progress}%` : '0%',
                            background: played ? cat.color : undefined,
                            transitionDelay: `${ri * 0.08 + ci * 0.06}s`
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })}

                <div className={`cert-capsule ${hasCert ? 'earned' : ''}`}>
                  {hasCert && <i className="fa-solid fa-certificate"></i>}
                  {hasCert ? 'ALINDI' : 'BEKLİYOR'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PanelGelisimAgaci

