import MarketingNavbar from '../../components/marketing/MarketingNavbar'
import MarketingFooter from '../../components/marketing/MarketingFooter'
import { useMarketingLanguage } from '../../context/MarketingLanguageContext.jsx'
import useFadeUp from '../../hooks/useFadeUp'
import '../../styles/marketing/common.css'
import '../../styles/marketing/davranis-analitik.css'

const TUBITAK_COPY = {
  tr: {
    heroBadge: 'DERİN TEKNOLOJİ ÇÖZÜMÜ',
    heroTitleLines: ['Kariyer Rehberliğindeki Boşlukları', 'Veriyle Dolduruyoruz.'],
    heroDescription:
      'Statik testlerin ve subjektif yorumların ötesine geçin. Davranışsal veri analitiği ile geleceğin potansiyelini bugünden keşfedin.',
    cycle: {
      leftTitle: 'Doğal Veri Akışı',
      leftDescription:
        'Oyun içi kararlar ve refleksler, yapay zeka motorumuz tarafından anlık veri noktalarına dönüştürülür.',
      rightTitle: 'Yüksek Çözünürlük',
      rightDescription:
        'Psikometrik modellerle işlenen veriler, kişiye özel ve %99.8 doğrulukta yetkinlik haritaları oluşturur.',
    },
    solutionsTitle: 'Bütüncül Analitik Çözüm',
    solutionsDescription: 'Sistemik sorunlara, derin teknoloji cevapları.',
    solutions: [
      {
        icon: 'fas fa-gamepad',
        cardClass: 'card-1',
        title: 'Oyun Tabanlı Değerlendirme',
        description:
          'Geleneksel anketler yerine, oyun içi kararlardan elde edilen gerçek zamanlı ve görev bazlı metrikler kullanılır.',
      },
      {
        icon: 'fas fa-shield-alt',
        cardClass: 'card-2',
        delay: '0.1s',
        title: 'Yanlılık Direnci',
        description:
          'Doğal tepkileri değerlendirerek, sosyal istenirlik yanlılığını ve manipülasyon riskini ortadan kaldırır.',
      },
      {
        icon: 'fas fa-dna',
        cardClass: 'card-3',
        delay: '0.2s',
        title: 'Dinamik Profilleme',
        description:
          'Tek seferlik değil; uzunlamasına verilerle öğrenen ve gelişimi zaman içinde takip eden canlı motor.',
      },
      {
        icon: 'fas fa-chart-bar',
        cardClass: 'card-4',
        delay: '0.1s',
        title: 'Yüksek Çözünürlüklü Analiz',
        description:
          'Faktör analizi, z-puan normalizasyonu ve OVERALS ile doğrulanmış, hassas beceri profilleri.',
      },
      {
        icon: 'fas fa-mobile-alt',
        cardClass: 'card-5',
        delay: '0.2s',
        title: 'Mobil ve Eşitlikçi Erişim',
        description:
          'Kurumsal altyapıya bağımlı olmayan, düşük bariyerli ve her yerden erişilebilir mobil tasarım.',
      },
      {
        icon: 'fas fa-users',
        cardClass: 'card-6',
        delay: '0.3s',
        title: 'Çok Paydaşlı Paneller',
        description:
          'Öğrenci, veli, eğitimci ve kurumlar için ayrı analitik katmanlar ve özelleştirilmiş içgörü ekranları.',
      },
    ],
    techTitle: 'Teknoloji Altyapısı',
    techItems: [
      { icon: 'fas fa-brain', title: 'Nöro-Analitik', description: 'Bilişsel Haritalama' },
      { icon: 'fas fa-robot', title: 'Yapay Zeka', description: 'Örüntü Tanıma', delay: '0.1s' },
      { icon: 'fas fa-database', title: 'Big Data', description: 'Uzunlamasına Veri', delay: '0.2s' },
      { icon: 'fas fa-lock', title: 'Güvenlik', description: 'KVKK Uyumlu', delay: '0.3s' },
    ],
  },
  en: {
    heroBadge: 'DEEP TECH SOLUTION',
    heroTitleLines: ['Closing the Gaps in Career Guidance', 'With Data.'],
    heroDescription:
      'Move beyond static tests and subjective interpretation. Discover future potential today through behavioral data analytics.',
    cycle: {
      leftTitle: 'Natural Data Flow',
      leftDescription:
        'In-game decisions and reflexes are transformed into live data points by our AI engine.',
      rightTitle: 'High Resolution',
      rightDescription:
        'Data processed with psychometric models produces personalized competency maps with 99.8% accuracy.',
    },
    solutionsTitle: 'A Holistic Analytics Solution',
    solutionsDescription: 'Deep technology answers for systemic problems.',
    solutions: [
      {
        icon: 'fas fa-gamepad',
        cardClass: 'card-1',
        title: 'Game-Based Assessment',
        description:
          'Instead of traditional surveys, the system uses real-time, task-based metrics captured from in-game decisions.',
      },
      {
        icon: 'fas fa-shield-alt',
        cardClass: 'card-2',
        delay: '0.1s',
        title: 'Bias Resistance',
        description:
          'By evaluating natural reactions, it reduces social desirability bias and minimizes manipulation risk.',
      },
      {
        icon: 'fas fa-dna',
        cardClass: 'card-3',
        delay: '0.2s',
        title: 'Dynamic Profiling',
        description:
          'Not a one-time snapshot, but a living engine that learns from longitudinal data and tracks development over time.',
      },
      {
        icon: 'fas fa-chart-bar',
        cardClass: 'card-4',
        delay: '0.1s',
        title: 'High-Resolution Analysis',
        description:
          'Validated competency profiles built on factor analysis, z-score normalization, and OVERALS.',
      },
      {
        icon: 'fas fa-mobile-alt',
        cardClass: 'card-5',
        delay: '0.2s',
        title: 'Mobile and Equitable Access',
        description:
          'A mobile-first design that is low-barrier, independent from institutional infrastructure, and accessible anywhere.',
      },
      {
        icon: 'fas fa-users',
        cardClass: 'card-6',
        delay: '0.3s',
        title: 'Multi-Stakeholder Panels',
        description:
          'Separate analytics layers and tailored insight screens for students, parents, educators, and institutions.',
      },
    ],
    techTitle: 'Technology Stack',
    techItems: [
      { icon: 'fas fa-brain', title: 'Neuro Analytics', description: 'Cognitive Mapping' },
      { icon: 'fas fa-robot', title: 'Artificial Intelligence', description: 'Pattern Recognition', delay: '0.1s' },
      { icon: 'fas fa-database', title: 'Big Data', description: 'Longitudinal Data', delay: '0.2s' },
      { icon: 'fas fa-lock', title: 'Security', description: 'KVKK Compliant', delay: '0.3s' },
    ],
  },
}

function TubitakPage() {
  const containerRef = useFadeUp()
  const { language } = useMarketingLanguage()
  const copy = TUBITAK_COPY[language]

  return (
    <div className="marketing-page marketing-davranis" ref={containerRef}>
      <MarketingNavbar />

      <header className="hero" id="tubitak">
        <div className="floating-icon icon-1"><i className="fas fa-brain"></i></div>
        <div className="floating-icon icon-2"><i className="fas fa-chart-pie"></i></div>
        <div className="floating-icon icon-3"><i className="fas fa-mobile-alt"></i></div>

        <div className="container">
          <span className="hero-badge fade-up">{copy.heroBadge}</span>
          <h1 className="fade-up">
            {copy.heroTitleLines[0]} <br />
            <span style={{ color: 'var(--primary)' }}>{copy.heroTitleLines[1]}</span>
          </h1>
          <p className="fade-up">{copy.heroDescription}</p>
        </div>
      </header>

      <section className="cycle-section">
        <div className="container">
          <div className="cycle-container">
            <div className="cycle-info info-left fade-up">
              <h3 style={{ color: 'var(--accent)', marginBottom: '10px' }}>{copy.cycle.leftTitle}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {copy.cycle.leftDescription}
              </p>
            </div>

            <div className="core-analytics fade-up">
              <i className="fas fa-network-wired core-icon"></i>
              <span className="core-label">AI ENGINE</span>

              <div className="data-ring">
                <div className="cycle-step step-1"><i className="fas fa-gamepad"></i></div>
                <div className="cycle-step step-2"><i className="fas fa-fingerprint"></i></div>
                <div className="cycle-step step-3"><i className="fas fa-microchip"></i></div>
                <div className="cycle-step step-4"><i className="fas fa-lightbulb"></i></div>
              </div>
            </div>

            <div className="cycle-info info-right fade-up" style={{ transitionDelay: '0.2s' }}>
              <h3 style={{ color: 'var(--success)', marginBottom: '10px' }}>{copy.cycle.rightTitle}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {copy.cycle.rightDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="solutions-section">
        <div className="container">
          <div className="text-center fade-up">
            <h2>{copy.solutionsTitle}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{copy.solutionsDescription}</p>
          </div>

          <div className="solutions-grid">
            {copy.solutions.map((item) => (
              <div
                key={item.title}
                className={`solution-card ${item.cardClass} fade-up`}
                style={item.delay ? { transitionDelay: item.delay } : undefined}
              >
                <div className="s-icon"><i className={item.icon}></i></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tech-summary">
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '40px' }}>{copy.techTitle}</h2>
          <div className="tech-grid">
            {copy.techItems.map((item) => (
              <div
                key={item.title}
                className="tech-item fade-up"
                style={item.delay ? { transitionDelay: item.delay } : undefined}
              >
                <i className={item.icon}></i>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

export default TubitakPage
