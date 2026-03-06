import { useMemo } from 'react'
import SectionHeader from '../../components/panel/SectionHeader.jsx'
import { useParentChildData } from '../../context/ParentChildContext.jsx'
import '../../styles/panel-pages/yetenek.css'

const METRIC_TO_SKILL_ID = {
  'El Becerisi ve Hassas Motor Kontrolü Yeteneği': 'motor',
  'Araç ve Ekipman Kullanımı': 'equip',
  'İş Akışını ve Sıralamayı Yönetme': 'workflow',
  'Duyusal Algı Yeteneği': 'sensory',
  'Dayanıklılık ve Refleks': 'reflex',
  'Karmaşık Sistemleri Analiz Etme': 'analysis',
  'Sebep-Sonuç İlişkisi Kurma': 'cause',
  'Veri Temelli Karar Alma': 'data',
  'Hata ve Tutarsızlıkları Tespit Etme': 'error',
  'Modelleme ve Simülasyon Yapabilme': 'simulation',
  'Harmoni ve Kompozisyon Yeteneği': 'harmony',
  'Yaratıcı Düşünme ve Soyutlama': 'abstract',
  'Duyusal Estetik Algısı (Ses)': 'aesthetic',
  'Bütüne ve Detaylara Hakim Olma': 'detail',
  'Malzeme ve Dokularla Çalışma': 'material',
  'Empati ve Toplumsal Duyarlılık': 'empathy',
  'İnsanlarla Hızlı ve Etkili İletişim Kurma': 'communication',
  'İnsan İlişkileri ve Duygusal Süreçleri Analiz': 'individual',
  'Esneklik ve Bireysel İhtiyaçlara Çözüm': 'flexibility',
  'Toplumu Bilgilendirme ve Farkındalık Yaratma': 'awareness',
  'Yerel ve Küresel Pazarı Okuyabilme': 'market',
  'Fırsat Algısı ve Avantaj Yakalama': 'opportunity',
  'İnsan Psikolojisini Kâr Stratejisine Dönüştürme': 'psychology',
  'Kendi Ekosistemini Yönetebilme': 'ecosystem',
  'Rekabet ve Pazar Stratejisi': 'competition',
  'Arşivleme ve Bilgi Saklama Yeteneği': 'archive',
  'Dökümantasyon ve Raporlama Yeteneği': 'report',
  'Kural ve Prosedürlere Üst Düzey Uyumluluk': 'compliance',
  'Rutin ve Tekrarlayan İşlerde Yüksek Performans': 'routine',
  'İnce Ayrıntıları Farketme': 'precision',
}

const TURKISH_CHAR_MAP = {
  ç: 'c',
  Ç: 'c',
  ğ: 'g',
  Ğ: 'g',
  ı: 'i',
  İ: 'i',
  ö: 'o',
  Ö: 'o',
  ş: 's',
  Ş: 's',
  ü: 'u',
  Ü: 'u',
}

function normalizeMetricName(metricName = '') {
  return String(metricName || '')
    .trim()
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (char) => TURKISH_CHAR_MAP[char] || char)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const NORMALIZED_METRIC_TO_SKILL_ID = Object.entries(METRIC_TO_SKILL_ID).reduce(
  (acc, [metricName, skillId]) => {
    const normalizedName = normalizeMetricName(metricName)
    if (normalizedName) acc[normalizedName] = skillId
    return acc
  },
  {}
)

function resolveSkillId(metricName = '') {
  const normalizedName = normalizeMetricName(metricName)
  if (!normalizedName) return ''

  const directMatch = NORMALIZED_METRIC_TO_SKILL_ID[normalizedName]
  if (directMatch) return directMatch

  if (
    normalizedName.includes('kural') &&
    normalizedName.includes('uyumluluk') &&
    (normalizedName.includes('prosedur') || normalizedName.includes('yukumluluk'))
  ) {
    return 'compliance'
  }

  return ''
}

const skillDefinitions = [
  { id: 'motor', icon: 'fa-solid fa-hand', label: 'El Becerisi ve Hassas Motor Kontrolü Yeteneği', color: '#EF4444' },
  { id: 'equip', icon: 'fa-solid fa-wrench', label: 'Araç ve Ekipman Kullanımı', color: '#DC2626' },
  { id: 'workflow', icon: 'fa-solid fa-arrows-spin', label: 'İş Akışını ve Sıralamayı Yönetme', color: '#B91C1C' },
  { id: 'sensory', icon: 'fa-solid fa-eye', label: 'Duyusal Algı Yeteneği', color: '#F87171' },
  { id: 'reflex', icon: 'fa-solid fa-bolt', label: 'Dayanıklılık ve Refleks', color: '#991B1B' },
  { id: 'analysis', icon: 'fa-solid fa-microscope', label: 'Karmaşık Sistemleri Analiz Etme', color: '#3B82F6' },
  { id: 'cause', icon: 'fa-solid fa-link', label: 'Sebep-Sonuç İlişkisi Kurma', color: '#2563EB' },
  { id: 'data', icon: 'fa-solid fa-chart-column', label: 'Veri Temelli Karar Alma', color: '#1D4ED8' },
  { id: 'error', icon: 'fa-solid fa-magnifying-glass', label: 'Hata ve Tutarsızlıkları Tespit Etme', color: '#60A5FA' },
  { id: 'simulation', icon: 'fa-solid fa-cube', label: 'Modelleme ve Simülasyon Yapabilme', color: '#1E40AF' },
  { id: 'harmony', icon: 'fa-solid fa-music', label: 'Harmoni ve Kompozisyon Yeteneği', color: '#8B5CF6' },
  { id: 'abstract', icon: 'fa-solid fa-lightbulb', label: 'Yaratıcı Düşünme ve Soyutlama', color: '#7C3AED' },
  { id: 'aesthetic', icon: 'fa-solid fa-headphones', label: 'Duyusal Estetik Algısı (Ses)', color: '#6D28D9' },
  { id: 'detail', icon: 'fa-solid fa-puzzle-piece', label: 'Bütüne ve Detaylara Hakim Olma', color: '#A78BFA' },
  { id: 'material', icon: 'fa-solid fa-swatchbook', label: 'Malzeme ve Dokularla Çalışma', color: '#5B21B6' },
  { id: 'empathy', icon: 'fa-solid fa-heart', label: 'Empati ve Toplumsal Duyarlılık', color: '#10B981' },
  { id: 'communication', icon: 'fa-solid fa-comments', label: 'İnsanlarla Hızlı ve Etkili İletişim Kurma', color: '#059669' },
  { id: 'flexibility', icon: 'fa-solid fa-hand-holding-heart', label: 'Esneklik ve Bireysel İhtiyaçlara Çözüm', color: '#047857' },
  { id: 'awareness', icon: 'fa-solid fa-bullhorn', label: 'Toplumu Bilgilendirme ve Farkındalık', color: '#34D399' },
  { id: 'individual', icon: 'fa-solid fa-people-arrows', label: 'İnsan İlişkileri ve Duygusal Süreçleri Analiz', color: '#065F46' },
  { id: 'market', icon: 'fa-solid fa-globe', label: 'Yerel ve Küresel Pazarı Okuyabilme', color: '#F59E0B' },
  { id: 'opportunity', icon: 'fa-solid fa-gem', label: 'Fırsat Algısı ve Avantaj Yakalama', color: '#D97706' },
  { id: 'psychology', icon: 'fa-solid fa-brain', label: 'İnsan Psikolojisini Kâr Stratejisine Dönüştürme', color: '#B45309' },
  { id: 'ecosystem', icon: 'fa-solid fa-seedling', label: 'Kendi Ekosistemini Yönetebilme', color: '#FBBF24' },
  { id: 'competition', icon: 'fa-solid fa-chess', label: 'Rekabet ve Pazar Stratejisi', color: '#92400E' },
  { id: 'archive', icon: 'fa-solid fa-box-archive', label: 'Arşivleme ve Bilgi Saklama Yeteneği', color: '#06B6D4' },
  { id: 'report', icon: 'fa-solid fa-file-lines', label: 'Dökümantasyon ve Raporlama Yeteneği', color: '#0891B2' },
  { id: 'compliance', icon: 'fa-solid fa-scale-balanced', label: 'Kural ve Prosedürlere Üst Düzey Uyumluluk', color: '#0E7490' },
  { id: 'routine', icon: 'fa-solid fa-rotate', label: 'Rutin İşlerde Yüksek Performans', color: '#22D3EE' },
  { id: 'precision', icon: 'fa-solid fa-crosshairs', label: 'İnce Ayrıntıları Farketme', color: '#155E75' },
]
function asPercent(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return 0
  return Math.max(0, Math.min(100, Math.round(number)))
}

function mapMetricsToSkills(metrics = {}) {
  return Object.entries(metrics || {}).reduce((acc, [metricName, metricValue]) => {
    const skillId = resolveSkillId(metricName)
    if (!skillId) return acc
    acc[skillId] = asPercent(metricValue)
    return acc
  }, {})
}

function PanelYetenek({
  activeChildOverride = null,
  headerTitle = 'Yetenek Gelişimi',
  headerDescription = 'Seçili öğrencinin oyun içi performansına dayalı canlı yetenek skorları.',
  isLoading: isLoadingProp,
}) {
  const { activeChild: contextActiveChild, loading: contextLoading } = useParentChildData()
  const loading = isLoadingProp !== undefined ? isLoadingProp : contextLoading
  const activeChild = activeChildOverride || contextActiveChild

  const scoreMap = useMemo(() => {
    const metrics =
      activeChild?.gameData?.playerStats?.metrics ||
      activeChild?.gameData?.rawPlayerStats?.metrics ||
      {}

    return mapMetricsToSkills(metrics)
  }, [activeChild])

  const allSkills = useMemo(
    () =>
      skillDefinitions.map((skill) => ({
        ...skill,
        percent: asPercent(scoreMap?.[skill.id]),
        isUnplayed: asPercent(scoreMap?.[skill.id]) === 0,
      })),
    [scoreMap]
  )

  const skills = useMemo(() => allSkills, [allSkills])
  const hasAnyPlayedMetric = useMemo(
    () => allSkills.some((skill) => skill.percent > 0),
    [allSkills]
  )

  const playedMetricsCount = useMemo(
    () => allSkills.filter((skill) => skill.percent > 0).length,
    [allSkills]
  )

  return (
    <div>
      <SectionHeader
        title={headerTitle}
        description={headerDescription}
      />

      <div className="yt-panel">
        <div className="yt-panel-header">
          <h3 className="yt-panel-title">
            <i className="fa-solid fa-chart-bar"></i> Yetenek Puanları
          </h3>
          <span className="yt-panel-badge">
            {loading ? '...' : `${playedMetricsCount}/${skills.length}`} Yetenek
          </span>
        </div>

        {loading ? (
          <div className="yt-bars-list">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="yt-bar-row yt-skeleton-row" key={i}>
                <div className="yt-bar-label">
                  <div className="yt-bar-icon yt-skeleton-icon"></div>
                  <div className="yt-skeleton-text"></div>
                </div>
                <div className="yt-bar-track">
                  <div className="yt-skeleton-fill" style={{ width: `${30 + (i * 17) % 50}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {!hasAnyPlayedMetric ? (
              <p style={{ margin: '0 0 14px 0', color: '#64748B', fontWeight: 600 }}>
                Henüz oynanmış metrik yok. Gri görünen yetenekler için veri bekleniyor.
              </p>
            ) : null}

            <div className="yt-bars-list">
              {skills.map((skill) => (
                <div className="yt-bar-row" key={skill.id}>
                  <div className="yt-bar-label">
                    <div
                      className={`yt-bar-icon ${skill.isUnplayed ? 'yt-bar-icon-unplayed' : ''}`}
                      style={skill.isUnplayed ? undefined : { background: `${skill.color}18`, color: skill.color }}
                    >
                      <i className={skill.icon}></i>
                    </div>
                    <span className="yt-bar-name">{skill.label}</span>
                  </div>
                  <div className="yt-bar-track">
                    <div
                      className={`yt-bar-fill ${skill.isUnplayed ? 'yt-bar-fill-unplayed' : ''}`}
                      style={
                        skill.isUnplayed
                          ? { width: '100%' }
                          : { width: `${skill.percent}%`, background: skill.color }
                      }
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PanelYetenek


