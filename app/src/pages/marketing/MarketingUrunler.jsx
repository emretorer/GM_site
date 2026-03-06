import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MarketingNavbar from '../../components/marketing/MarketingNavbar'
import { useMarketingLanguage } from '../../context/MarketingLanguageContext.jsx'
import '../../styles/marketing/common.css'
import '../../styles/marketing/urunler.css'

const PRODUCT_COPY = {
  tr: {
    sections: [
      {
        id: 'ucretsiz',
        navTitle: 'Ücretsiz',
        tag: 'BAŞLANGIÇ',
        titleLines: ['Deneyimleyin,', 'Karar Verin.'],
        description: 'Sistemi tanımak için hiçbir ücret ödemeden ilk adımı atın. Davranışsal analizin gücünü tek bir simülasyonla test edin.',
        features: [
          '10+ Farklı Oyun',
          'Arkadaşlarınızla online oyunlar oynayın',
          'Genius Metropol Dünyasına Erişim',
        ],
        featureIcon: 'fas fa-check-circle',
        plan: 'Genius Deneme',
        amount: 'Ücretsiz',
        period: 'Play Store / App Store',
        cta: 'Hemen Yükle',
      },
      {
        id: 'bireysel',
        navTitle: 'Bireysel',
        tag: 'EN POPÜLER',
        titleLines: ['Çocuğunuzun Potansiyelini', 'Açığa Çıkarın.'],
        description: 'Öğrenciler ve veliler için kapsamlı analiz paketi. Sadece bir test değil, yapay zeka destekli bir kariyer koçu.',
        features: [
          'Tüm Simülasyonlara Sınırsız Erişim',
          'Detaylı RIASEC & Yetkinlik Raporu',
          'Gelecek Kariyer Eşleştirmesi',
          'Veli Bilgilendirme Paneli',
        ],
        featureIcon: 'fas fa-star',
        plan: 'Genius Pro',
        amount: '499',
        period: 'Aylık / İptal Edilebilir',
        cta: 'Aboneliği Başlat',
      },
      {
        id: 'okul',
        navTitle: 'Okul',
        tag: 'KURUMSAL',
        titleLines: ['Okulunuzu Veriyle', 'Yönetin.'],
        description: 'Rehberlik servisleri için devrim niteliğinde bir araç. Öğrencilerinizi tek tek değil, veri kümeleriyle analiz edin.',
        features: [
          'Toplu Öğrenci Yönetimi',
          'Sınıf ve Okul Bazlı Raporlama',
          'Rehber Öğretmen Paneli',
          'Müfredat Entegrasyon Desteği',
        ],
        featureIcon: 'fas fa-school',
        plan: 'Genius Kampüs',
        amount: 'Özel',
        period: 'Öğrenci Sayısına Göre Teklif',
        cta: 'Teklif İste',
      },
      {
        id: 'psikolog',
        navTitle: 'Psikolog',
        tag: 'PROFESYONEL',
        titleLines: ['Danışanlarınız İçin', 'Derinlemesine Analiz.'],
        description: 'Klinik psikologlar ve kariyer danışmanları için nöro-metrik verilerle desteklenen uzman paneli.',
        features: [
          'Klinik Düzeyde Veri Çıktıları',
          'Danışan Gelişim Takibi',
          'Kendi Logonuzla Raporlama (White Label)',
          'Uzman Destek Hattı',
        ],
        featureIcon: 'fas fa-brain',
        plan: 'Genius Uzman',
        amount: 'Lisans',
        period: 'Yıllık Profesyonel Lisanslama',
        cta: 'Başvuru Yap',
      },
    ],
  },
  en: {
    sections: [
      {
        id: 'ucretsiz',
        navTitle: 'Free',
        tag: 'STARTER',
        titleLines: ['Try It,', 'Then Decide.'],
        description: 'Take the first step without paying anything. Test the power of behavioral analytics with a single simulation.',
        features: [
          '10+ different games',
          'Play online with your friends',
          'Access to the Genius Metropol world',
        ],
        featureIcon: 'fas fa-check-circle',
        plan: 'Genius Trial',
        amount: 'Free',
        period: 'Play Store / App Store',
        cta: 'Install Now',
      },
      {
        id: 'bireysel',
        navTitle: 'Individual',
        tag: 'MOST POPULAR',
        titleLines: ['Unlock Your Child\'s', 'Potential.'],
        description: 'A complete analytics package for students and parents. Not just a test, but an AI-supported career coach.',
        features: [
          'Unlimited access to all simulations',
          'Detailed RIASEC & competency report',
          'Future career matching',
          'Parent information dashboard',
        ],
        featureIcon: 'fas fa-star',
        plan: 'Genius Pro',
        amount: '499',
        period: 'Monthly / Cancel Anytime',
        cta: 'Start Subscription',
      },
      {
        id: 'okul',
        navTitle: 'School',
        tag: 'ENTERPRISE',
        titleLines: ['Manage Your School', 'With Data.'],
        description: 'A game-changing tool for guidance services. Analyze students as meaningful data sets, not one by one.',
        features: [
          'Bulk student management',
          'Class and school level reporting',
          'Guidance counselor panel',
          'Curriculum integration support',
        ],
        featureIcon: 'fas fa-school',
        plan: 'Genius Campus',
        amount: 'Custom',
        period: 'Quoted by student count',
        cta: 'Request a Quote',
      },
      {
        id: 'psikolog',
        navTitle: 'Psychologist',
        tag: 'PROFESSIONAL',
        titleLines: ['Deep Analysis', 'For Your Clients.'],
        description: 'An expert panel for clinical psychologists and career counselors, powered by neuro-metric insights.',
        features: [
          'Clinical-grade data outputs',
          'Client development tracking',
          'White-label reporting with your own logo',
          'Dedicated expert support',
        ],
        featureIcon: 'fas fa-brain',
        plan: 'Genius Expert',
        amount: 'License',
        period: 'Annual professional licensing',
        cta: 'Apply Now',
      },
    ],
  },
}

function MarketingUrunler() {
  const [activeSection, setActiveSection] = useState('ucretsiz')
  const location = useLocation()
  const { language } = useMarketingLanguage()
  const copy = PRODUCT_COPY[language]

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location])

  useEffect(() => {
    const container = document.querySelector('.marketing-urunler')
    if (!container) return undefined

    const handleScroll = () => {
      const sections = container.querySelectorAll('section')
      let current = ''
      const scrollTop = container.scrollTop

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        if (scrollTop >= (sectionTop - sectionHeight / 3)) {
          current = section.getAttribute('id')
        }
      })

      if (current) {
        setActiveSection(current)
      }
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="marketing-page marketing-urunler">
      <MarketingNavbar />

      <div className="scroll-nav">
        {copy.sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`scroll-dot ${activeSection === section.id ? 'active' : ''}`}
            title={section.navTitle}
          ></a>
        ))}
      </div>

      {copy.sections.map((section) => (
        <section id={section.id} key={section.id}>
          <div className="split-container">
            <div className="text-content">
              <span className="tag">{section.tag}</span>
              <h2>
                {section.titleLines[0]}
                <br />
                {section.titleLines[1]}
              </h2>
              <p>{section.description}</p>
              <ul className="check-list">
                {section.features.map((feature) => (
                  <li key={feature}>
                    <i className={section.featureIcon}></i> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-content">
              <div className="price-card">
                <h3>{section.plan}</h3>
                <span className="price-amount">{section.amount}</span>
                <span className="price-period">{section.period}</span>
                <Link to="#" className="btn-action">{section.cta}</Link>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default MarketingUrunler
