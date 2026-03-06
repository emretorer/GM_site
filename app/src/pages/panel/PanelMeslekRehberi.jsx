import SectionHeader from '../../components/panel/SectionHeader.jsx'
import useFadeUp from '../../hooks/useFadeUp'
import '../../styles/panel-pages/meslek-rehberi.css'

const riasecCards = [
  {
    id: 'r',
    theme: 'theme-r',
    bgIcon: 'fa-solid fa-wrench',
    icon: 'fa-solid fa-hammer',
    title: 'Gerçekçi (Realistic)',
    subtitle: '"Yapanlar" - Nesnelerle, araçlarla ve makinelerle çalışmayı sevenler.',
    traits:
      'Pratik, fiziksel aktiviteyi seven, somut sonuçlar görmekten hoşlanan ve el becerisi yüksek bireyler.',
    classic: ['Mühendis', 'Pilot', 'Mimar', 'Veteriner', 'Şef', 'Teknisyen'],
    recommendationNote:
      'Teknolojiyle sahayı birleştiren, üretim ve uygulama odaklı roller bu profile güçlü şekilde uyar.',
    recommended: [
      'Robotik Sistem Teknisyeni',
      'Endüstriyel Otomasyon Uzmanı',
      'Drone Filo Operatörü',
      'Yenilenebilir Enerji Teknikeri',
      'Akıllı Tarım Sistemleri Uzmanı',
      '3D Üretim Operatörü',
    ],
  },
  {
    id: 'i',
    theme: 'theme-i',
    bgIcon: 'fa-solid fa-microscope',
    icon: 'fa-solid fa-dna',
    title: 'Araştırmacı (Investigative)',
    subtitle: '"Düşünenler" - Gözlem yapmayı, analiz etmeyi ve problem çözmeyi sevenler.',
    traits:
      'Analitik, meraklı, entelektüel, karmaşık problemleri çözmekten keyif alan ve metodik çalışan bireyler.',
    classic: ['Doktor', 'Yazılımcı', 'Bilim İnsanı', 'Matematikçi', 'Eczacı', 'Araştırmacı'],
    recommendationNote:
      'Veri, bilim ve teknoloji merkezli alanlarda derin düşünme ve model kurma becerileri öne çıkar.',
    recommended: [
      'Veri Bilimci',
      'Yapay Zeka Mühendisi',
      'Biyoinformatik Uzmanı',
      'Siber Tehdit Analisti',
      'Nöroteknoloji Araştırmacısı',
      'Makine Öğrenmesi Uzmanı',
    ],
  },
  {
    id: 'a',
    theme: 'theme-a',
    bgIcon: 'fa-solid fa-palette',
    icon: 'fa-solid fa-pen-nib',
    title: 'Yaratıcı (Artistic)',
    subtitle: '"Yaratanlar" - Özgün fikirler üretmeyi ve kendini ifade etmeyi sevenler.',
    traits:
      'Hayal gücü geniş, sezgisel, ifade gücü yüksek ve katı kurallara bağlı kalmadan üretmeyi seven bireyler.',
    classic: ['Grafik Tasarımcı', 'Yazar', 'Müzisyen', 'Yönetmen', 'Modacı', 'İllüstratör'],
    recommendationNote:
      'Dijital deneyim, görsel anlatım ve hikaye kurgusu gerektiren roller bu profil için güçlü fırsatlar sunar.',
    recommended: [
      'UX/UI Tasarımcısı',
      'Oyun Tasarımcısı',
      'XR Deneyim Tasarımcısı',
      'Motion Graphics Sanatçısı',
      'Dijital İçerik Stratejisti',
      'Yaratıcı Teknolog',
    ],
  },
  {
    id: 's',
    theme: 'theme-s',
    bgIcon: 'fa-solid fa-users',
    icon: 'fa-solid fa-hand-holding-heart',
    title: 'Sosyal (Social)',
    subtitle: '"Yardım Edenler" - İnsanlarla iletişim kurmayı, destek olmayı ve öğretmeyi sevenler.',
    traits:
      'Empati yeteneği yüksek, iş birliğine açık, güçlü sözlü iletişim kurabilen ve insan odaklı düşünen bireyler.',
    classic: ['Öğretmen', 'Psikolog', 'Hemşire', 'İK Uzmanı', 'Rehber Öğretmen', 'Sosyal Hizmet Uzmanı'],
    recommendationNote:
      'İnsan gelişimi, danışmanlık ve topluluk etkileşimi isteyen roller bu profilde doğal şekilde öne çıkar.',
    recommended: [
      'Psikolojik Danışman',
      'Kariyer Koçu',
      'Öğrenme Deneyimi Tasarımcısı',
      'Topluluk Geliştirme Uzmanı',
      'Çocuk Gelişimi Uzmanı',
      'Kurumsal Eğitim Uzmanı',
    ],
  },
  {
    id: 'e',
    theme: 'theme-e',
    bgIcon: 'fa-solid fa-briefcase',
    icon: 'fa-solid fa-bullhorn',
    title: 'Girişimci (Enterprising)',
    subtitle: '"Etkileyenler" - İkna etmeyi, yönetmeyi, yön vermeyi ve liderlik etmeyi sevenler.',
    traits:
      'Dışa dönük, enerjik, risk alabilen, rekabetçi, ikna kabiliyeti güçlü ve liderlik eğilimi yüksek bireyler.',
    classic: ['Avukat', 'Satış Müdürü', 'CEO', 'Politikacı', 'İşletmeci', 'Pazarlama Uzmanı'],
    recommendationNote:
      'Büyüme, yönetim ve fırsat geliştirme odaklı roller bu profilin enerjisini en iyi kullanan alanlardadır.',
    recommended: [
      'Ürün Yöneticisi',
      'İş Geliştirme Direktörü',
      'Büyüme Pazarlama Lideri',
      'Girişim Geliştirme Uzmanı',
      'E-Ticaret Operasyon Yöneticisi',
      'Startup Kurucusu',
    ],
  },
  {
    id: 'c',
    theme: 'theme-c',
    bgIcon: 'fa-solid fa-file-invoice',
    icon: 'fa-solid fa-list-check',
    title: 'Sistematik (Conventional)',
    subtitle: '"Düzenleyenler" - Verilerle, sayılarla ve düzenli iş süreçleriyle çalışmayı sevenler.',
    traits:
      'Dikkatli, düzenli, kurallara uyumlu, detay odaklı ve sayısal verilerle çalışırken güçlü performans gösteren bireyler.',
    classic: ['Muhasebeci', 'Bankacı', 'Editör', 'Kütüphaneci', 'İstatistikçi', 'Operasyon Uzmanı'],
    recommendationNote:
      'Planlama, süreç takibi ve veri doğruluğu isteyen roller bu profil için yüksek uyum gösterir.',
    recommended: [
      'İş Zekası Analisti',
      'Süreç Otomasyon Uzmanı',
      'Fintech Operasyon Uzmanı',
      'Veri Kalitesi Uzmanı',
      'Uyum ve Risk Analisti',
      'ERP Sistem Uzmanı',
    ],
  },
]

function PanelMeslekRehberi() {
  const containerRef = useFadeUp()

  return (
    <div ref={containerRef} className="mr-page">
      <SectionHeader
        title="Meslek Rehberi ve Tanımları"
        description="Holland (RIASEC) tipolojisine göre sınıflandırılmış; bugünün mesleklerini, yükselen kariyer alanlarını ve size uygun olabilecek rolleri bir arada sunan kapsamlı rehber."
        containerClassName="mr-page-header fade-up"
        titleClassName="mr-page-title"
        descClassName="mr-page-desc"
      />
      <div className="catalog-grid">
        {riasecCards.map((card, index) => (
          <div
            className={`info-card ${card.theme} fade-up`}
            key={card.id}
            style={{ transitionDelay: `${Math.min(index * 0.08, 0.32)}s` }}
          >
            <div className="ic-header">
              <i className={`${card.bgIcon} ic-bg-icon`}></i>
              <div className="ic-icon-box">
                <i className={card.icon}></i>
              </div>
              <h3 className="ic-title">{card.title}</h3>
              <p className="ic-subtitle">{card.subtitle}</p>
            </div>
            <div className="ic-body">
              <div className="def-box">
                <h4>Temel Özellikler</h4>
                <p>{card.traits}</p>
              </div>
              <div className="def-box">
                <h4>Klasik Meslekler</h4>
                <div className="job-list">
                  {card.classic.map((job) => (
                    <span className="job-tag" key={job}>
                      {job}
                    </span>
                  ))}
                </div>
              </div>
              <div className="future-jobs">
                <div className="fj-title">
                  <i className="fa-solid fa-rocket"></i> Önerilen Meslekler
                </div>
                <p className="fj-copy">{card.recommendationNote}</p>
                <div className="fj-list">
                  {card.recommended.map((job) => (
                    <span className="fj-tag" key={job}>
                      {job}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PanelMeslekRehberi
