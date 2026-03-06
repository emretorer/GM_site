import { useEffect, useRef } from 'react'
import MarketingNavbar from '../../components/marketing/MarketingNavbar'
import MarketingFooter from '../../components/marketing/MarketingFooter'
import useFadeUp from '../../hooks/useFadeUp'
import { useMarketingLanguage } from '../../context/MarketingLanguageContext.jsx'
import '../../styles/marketing/common.css'
import '../../styles/marketing/vizyon-misyon.css'

const VISION_COPY = {
  tr: {
    heroBadge: 'VİZYONUMUZ',
    heroTitleTop: 'Davranışsal Yetenek Analitiğinde',
    heroTitleBottom: 'Uluslararası Standart Olmak.',
    heroDescription: 'Dijital dünyada yapay zeka karar altyapısı oldu. İnsan dünyasında bu altyapıyı, davranışsal veriye dayalı simülasyon teknolojimizle GeniusMethods kuruyor.',
    missionTitleTop: 'Görünmeyeni',
    missionTitleBottom: 'Ölçülebilir Kılmak.',
    missionParagraphs: [
      'İnsan zihnindeki "Niyet" ile eyleme dökülen "Davranış" arasındaki boşluğu (The Gap) bilimsel simülasyonlarla ölçmek.',
      'Bireylere, kurumlara ve ülkelere; önyargılardan arındırılmış, saf veri temelli bir yetenek keşif ve yönlendirme teknolojisi sunmak.',
    ],
    missionQuote: '"Yanlış yetenek yatırımını ortadan kaldıran, global bir analiz standardı."',
    intent: 'NİYET',
    behavior: 'DAVRANIŞ',
    transformTitle: 'Neyi Değiştiriyoruz?',
    transformDescription: 'Statik veriden, canlı simülasyon analizine geçiş.',
    staticData: 'Statik Veri',
    liveAnalysis: 'Canlı Analiz',
    traditionalMethod: 'Geleneksel Yöntem',
    traditionalDescription: 'Yönlendirmeye açık ve statik süreçler.',
    traditionalList: [
      ['Beyana Dayalı:', 'Manipülasyon riski taşır.'],
      ['Tek Seferlik:', 'Anlık ve yüzeysel ölçüm.'],
      ['Kopuk Veriler:', 'Bağlantısız veri noktaları.'],
    ],
    geniusMethod: 'Genius Metodu',
    geniusDescription: 'Simülasyon tabanlı, sürekli gelişen dinamik süreç.',
    geniusList: [
      ['Refleksif Veri:', 'Doğal davranış analizi.'],
      ['Dinamik Simülasyon:', 'Canlı veri akışı.'],
      ['Bütüncül Analiz:', 'Anlamlı içgörü.'],
    ],
    valueTitle: 'Değer Yaratan Ekosistem',
    valueDescription: 'Veri odaklı yaklaşımımızla eğitimin tüm paydaşlarına dokunuyoruz.',
    valueCards: [
      ['Öğrenciler', 'Kendini tanıma, doğru meslekle buluşma ve potansiyelini keşfetme.'],
      ['Eğitimciler', 'Veriye dayalı rehberlik, kişisel müfredat ve öğrenci takibi.'],
      ['Ebeveynler', 'Çocuğunun gerçek yeteneğini anlama ve doğru yatırım yapma.'],
      ['Psikologlar', 'Gözlem ötesi derinlemesine davranış analizi ve somut destek verisi.'],
    ],
  },
  en: {
    heroBadge: 'OUR VISION',
    heroTitleTop: 'To Become the',
    heroTitleBottom: 'Global Standard in Behavioral Talent Analytics.',
    heroDescription: 'AI has become the decision infrastructure of the digital world. In the human world, GeniusMethods builds that infrastructure with our simulation technology powered by behavioral data.',
    missionTitleTop: 'Make the Invisible',
    missionTitleBottom: 'Measurable.',
    missionParagraphs: [
      'Measure the gap between "intention" in the human mind and the "behavior" that turns into action through scientific simulations.',
      'Deliver a talent discovery and guidance technology to individuals, institutions, and countries based on clean, bias-free data.',
    ],
    missionQuote: '"A global analysis standard that eliminates investment in the wrong talent."',
    intent: 'INTENT',
    behavior: 'BEHAVIOR',
    transformTitle: 'What Are We Changing?',
    transformDescription: 'The shift from static data to live simulation analysis.',
    staticData: 'Static Data',
    liveAnalysis: 'Live Analysis',
    traditionalMethod: 'Traditional Method',
    traditionalDescription: 'Static workflows that are open to bias and steering.',
    traditionalList: [
      ['Self-Reported:', 'Carries manipulation risk.'],
      ['One-Off:', 'A momentary and shallow measurement.'],
      ['Fragmented Data:', 'Disconnected data points.'],
    ],
    geniusMethod: 'The Genius Method',
    geniusDescription: 'A simulation-based dynamic process that keeps evolving.',
    geniusList: [
      ['Reflexive Data:', 'Natural behavior analysis.'],
      ['Dynamic Simulation:', 'A live stream of data.'],
      ['Holistic Analysis:', 'Meaningful insight.'],
    ],
    valueTitle: 'An Ecosystem That Creates Value',
    valueDescription: 'Our data-first approach serves every stakeholder in education.',
    valueCards: [
      ['Students', 'Self-awareness, matching with the right profession, and discovering potential.'],
      ['Educators', 'Data-driven guidance, personal curricula, and student progress tracking.'],
      ['Parents', 'Understanding a child\'s real talent and investing in the right direction.'],
      ['Psychologists', 'Behavioral insight beyond observation, supported by concrete evidence.'],
    ],
  },
}

function MarketingVizyonMisyon() {
  const containerRef = useFadeUp()
  const flipContainerRef = useRef(null)
  const { language } = useMarketingLanguage()
  const copy = VISION_COPY[language]

  useEffect(() => {
    const el = flipContainerRef.current
    if (!el) return

    const cards = el.querySelectorAll('.flip-card')

    const onScroll = () => {
      const midScreen = window.innerHeight / 2
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const cardCenter = rect.top + rect.height / 2
        if (cardCenter <= midScreen) {
          card.classList.add('flipped')
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="marketing-page marketing-vizyon" ref={containerRef}>
      <MarketingNavbar />

      <header className="hero">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-game-1">
          <i className="fas fa-gamepad"></i>
        </div>
        <div className="floating-shape shape-game-2">
          <i className="fas fa-puzzle-piece"></i>
        </div>

        <div className="container">
          <span className="hero-badge fade-up">{copy.heroBadge}</span>
          <h1 className="fade-up" style={{ transitionDelay: '0.1s' }}>
            {copy.heroTitleTop} <br />
            <span className="text-gradient">{copy.heroTitleBottom}</span>
          </h1>
          <p className="fade-up" style={{ transitionDelay: '0.2s' }}>
            {copy.heroDescription}
          </p>
        </div>
      </header>

      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content fade-up">
              <h2 className="mission-title">
                {copy.missionTitleTop} <br />
                <span className="text-gradient">{copy.missionTitleBottom}</span>
              </h2>

              <div className="mission-text">
                <p>{copy.missionParagraphs[0]}</p>
                <p style={{ marginTop: '20px' }}>{copy.missionParagraphs[1]}</p>
              </div>

              <div className="mission-quote">
                {copy.missionQuote}
              </div>
            </div>

            <div className="mission-visual-wrapper fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="orbit-system">
                <div className="ring-outer"></div>
                <div className="ring-middle"></div>

                <div className="core-gap">
                  <i className="fas fa-fingerprint core-icon"></i>
                  <span className="core-text">GENIUS ID</span>
                </div>

                <div className="floating-card card-intent">
                  <div className="dot dot-blue"></div> {copy.intent}
                </div>
                <div className="floating-card card-behavior">
                  <div className="dot dot-orange"></div> {copy.behavior}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="transformation-section">
        <div className="container">
          <div className="text-center fade-up" style={{ marginBottom: '50px', position: 'relative', zIndex: 2 }}>
            <h2>{copy.transformTitle}</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{copy.transformDescription}</p>
          </div>

          <div className="transformation-container" ref={flipContainerRef}>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-back">
                  <img src="/assets/logo-1.webp" alt="GM Technology" className="flip-logo" />
                  <span className="flip-label">{copy.staticData}</span>
                </div>
                <div className="flip-card-front">
                  <div className="flow-label flow-label-in">{copy.staticData}</div>
                  <div className="trans-text-block block-old">
                    <h3><i className="fas fa-file-alt" style={{ color: '#64748b', marginRight: '10px' }}></i> {copy.traditionalMethod}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '10px' }}>{copy.traditionalDescription}</p>
                    <ul className="trans-list old-list">
                      {copy.traditionalList.map(([label, description]) => (
                        <li key={label}><strong>{label}</strong> {description}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="game-orbit-container fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="central-core">
                <i className="fas fa-microchip"></i>
              </div>

              <div className="orbit-ring ring-orbit-inner">
                <div className="orbit-item item-1"><i className="fas fa-gamepad"></i></div>
                <div className="orbit-item item-2"><i className="fas fa-brain"></i></div>
                <div className="orbit-item item-3"><i className="fas fa-puzzle-piece"></i></div>
              </div>

              <div className="orbit-ring ring-orbit-outer">
                <div className="orbit-item item-4"><i className="fas fa-vr-cardboard"></i></div>
                <div className="orbit-item item-5"><i className="fas fa-chart-line"></i></div>
                <div className="orbit-item item-6"><i className="fas fa-rocket"></i></div>
              </div>
            </div>

            <div className="flip-card flip-card-delay">
              <div className="flip-card-inner">
                <div className="flip-card-back">
                  <img src="/assets/logo-1.webp" alt="GM Technology" className="flip-logo" />
                  <span className="flip-label">{copy.liveAnalysis}</span>
                </div>
                <div className="flip-card-front">
                  <div className="flow-label flow-label-out">{copy.liveAnalysis}</div>
                  <div className="trans-text-block block-new">
                    <h3><i className="fas fa-brain" style={{ color: 'var(--primary)', marginRight: '10px' }}></i> {copy.geniusMethod}</h3>
                    <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>{copy.geniusDescription}</p>
                    <ul className="trans-list new-list">
                      {copy.geniusList.map(([label, description]) => (
                        <li key={label}><strong>{label}</strong> {description}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="value-section">
        <div className="container">
          <div style={{ textAlign: 'center' }} className="fade-up">
            <h2>{copy.valueTitle}</h2>
            <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-muted)' }}>
              {copy.valueDescription}
            </p>
          </div>

          <div className="value-grid">
            <div className="value-card card-student fade-up">
              <div className="v-icon"><i className="fas fa-user-graduate"></i></div>
              <h3>{copy.valueCards[0][0]}</h3>
              <p>{copy.valueCards[0][1]}</p>
            </div>

            <div className="value-card card-school fade-up" style={{ transitionDelay: '0.1s' }}>
              <div className="v-icon"><i className="fas fa-chalkboard-teacher"></i></div>
              <h3>{copy.valueCards[1][0]}</h3>
              <p>{copy.valueCards[1][1]}</p>
            </div>

            <div className="value-card card-parent fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="v-icon"><i className="fas fa-house-user"></i></div>
              <h3>{copy.valueCards[2][0]}</h3>
              <p>{copy.valueCards[2][1]}</p>
            </div>

            <div className="value-card card-psych fade-up" style={{ transitionDelay: '0.3s' }}>
              <div className="v-icon"><i className="fas fa-brain"></i></div>
              <h3>{copy.valueCards[3][0]}</h3>
              <p>{copy.valueCards[3][1]}</p>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

export default MarketingVizyonMisyon
