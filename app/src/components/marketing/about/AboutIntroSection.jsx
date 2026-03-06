import { useMarketingLanguage } from '../../../context/MarketingLanguageContext.jsx'

const INTRO_COPY = {
  tr: {
    badge: 'HAKKIMIZDA',
    titleTop: 'Yeteneği Keşfeden,',
    titleBottom: 'Geleceği Şekillendiren Ekip.',
    subtitle: 'Antalya Teknokent\'te kurulan GeniusMethods, davranışsal analitik ve oyunlaştırılmış simülasyonlarla bireylerin gerçek potansiyelini ortaya çıkaran bir AR-GE teknoloji şirketidir.',
    body: [
      'Geleneksel yetenek değerlendirme yöntemlerinin yetersiz kaldığı noktada doğduk. Bireylerin beyana dayalı testlerle değil, doğal davranışlarıyla değerlendirilmesi gerektiğine inandık.',
      'Oyun mekaniği, yapay zeka ve psikometrik modelleri bir araya getirerek dünyada benzersiz bir davranışsal yetenek analiz platformu geliştirdik.',
    ],
    quote: '"Doğru yeteneği, doğru zamanda, doğru veriyle keşfetmek."',
    tag2: 'Yapay Zeka',
    tag3: 'Simülasyon',
  },
  en: {
    badge: 'ABOUT US',
    titleTop: 'The Team That Discovers Talent',
    titleBottom: 'and Shapes the Future.',
    subtitle: 'Founded in Antalya Teknokent, GeniusMethods is an R&D technology company that reveals real human potential through behavioral analytics and gamified simulations.',
    body: [
      'We were born where traditional talent assessment methods fell short. We believed people should be evaluated not by self-reported tests, but by their natural behavior.',
      'By combining game mechanics, artificial intelligence, and psychometric models, we built a unique behavioral talent analytics platform.',
    ],
    quote: '"Discover the right talent at the right time with the right data."',
    tag2: 'Artificial Intelligence',
    tag3: 'Simulation',
  },
}

function AboutIntroSection() {
  const { language } = useMarketingLanguage()
  const copy = INTRO_COPY[language]

  return (
    <header className="about-intro">
      <div className="container">
        <div className="intro-grid">
          <div className="intro-content">
            <span className="intro-badge fade-up">{copy.badge}</span>
            <h1 className="fade-up" style={{ transitionDelay: '0.1s' }}>
              {copy.titleTop}
              <br />
              <span className="text-gradient">{copy.titleBottom}</span>
            </h1>
            <p className="subtitle fade-up" style={{ transitionDelay: '0.2s' }}>
              {copy.subtitle}
            </p>

            <div className="intro-body fade-up" style={{ transitionDelay: '0.3s' }}>
              <p>{copy.body[0]}</p>
              <p>{copy.body[1]}</p>
              <div className="intro-accent-quote">
                {copy.quote}
              </div>
            </div>
          </div>

          <div className="intro-visual fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="intro-ring intro-ring-1"></div>
            <div className="intro-ring intro-ring-2"></div>

            <div className="intro-visual-card">
              <div className="intro-visual-icon">
                <i className="fas fa-rocket"></i>
              </div>
            </div>

            <div className="intro-float-tag float-tag-1">
              <i className="fas fa-flask"></i>
              <span>AR-GE</span>
            </div>
            <div className="intro-float-tag float-tag-2">
              <i className="fas fa-brain"></i>
              <span>{copy.tag2}</span>
            </div>
            <div className="intro-float-tag float-tag-3">
              <i className="fas fa-gamepad"></i>
              <span>{copy.tag3}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AboutIntroSection
