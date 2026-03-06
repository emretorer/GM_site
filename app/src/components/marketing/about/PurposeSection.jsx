import { useMarketingLanguage } from '../../../context/MarketingLanguageContext.jsx'

const PURPOSE_COPY = {
  tr: {
    label: 'AMACIMIZ',
    titleTop: 'İnsanın Gerçek Potansiyelini',
    titleBottom: 'Ortaya Çıkarmak.',
    description: 'Bireylerin kendilerini tanıması, güçlü yönlerini keşfetmesi ve geleceğe dair bilinçli kararlar alabilmesi için bilimsel temelli, önyargısız ve eğlenceli bir keşif deneyimi sunuyoruz.',
    pillars: [
      ['Bilimsel Temelli Analiz', 'RIASEC Holland modeli ve psikometrik ölçümlerle desteklenen güvenilir değerlendirme altyapısı.'],
      ['Önyargıdan Arındırılmış Veri', 'Beyana değil, doğal davranışa dayalı saf veri toplama ile gerçek yetenek profili çıkarma.'],
      ['Eğlenceli Keşif Deneyimi', 'Oyun mekaniği ile zenginleştirilmiş simülasyonlar sayesinde doğal ve keyifli bir süreç.'],
    ],
  },
  en: {
    label: 'OUR PURPOSE',
    titleTop: 'Reveal the Real',
    titleBottom: 'Human Potential.',
    description: 'We offer a scientific, bias-free, and engaging discovery experience so individuals can know themselves, uncover their strengths, and make informed decisions about the future.',
    pillars: [
      ['Science-Based Analysis', 'A reliable assessment foundation supported by the RIASEC Holland model and psychometric measurement.'],
      ['Bias-Free Data', 'A true talent profile built on clean data gathered from natural behavior, not self-reporting.'],
      ['An Enjoyable Discovery Experience', 'A natural and engaging process powered by simulations enriched with game mechanics.'],
    ],
  },
}

function PurposeSection() {
  const { language } = useMarketingLanguage()
  const copy = PURPOSE_COPY[language]

  return (
    <section className="purpose-section">
      <div className="container">
        <div className="purpose-grid">
          <div className="purpose-content">
            <span className="section-label fade-up">{copy.label}</span>
            <h2 className="fade-up" style={{ transitionDelay: '0.1s' }}>
              {copy.titleTop} <br />
              <span className="text-gradient">{copy.titleBottom}</span>
            </h2>
            <p className="purpose-text fade-up" style={{ transitionDelay: '0.2s' }}>
              {copy.description}
            </p>

            <div className="purpose-pillars fade-up" style={{ transitionDelay: '0.3s' }}>
              <div className="purpose-pillar">
                <div className="pillar-icon icon-indigo">
                  <i className="fas fa-microscope"></i>
                </div>
                <div className="pillar-text">
                  <h4>{copy.pillars[0][0]}</h4>
                  <p>{copy.pillars[0][1]}</p>
                </div>
              </div>

              <div className="purpose-pillar">
                <div className="pillar-icon icon-purple">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="pillar-text">
                  <h4>{copy.pillars[1][0]}</h4>
                  <p>{copy.pillars[1][1]}</p>
                </div>
              </div>

              <div className="purpose-pillar">
                <div className="pillar-icon icon-green">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <div className="pillar-text">
                  <h4>{copy.pillars[2][0]}</h4>
                  <p>{copy.pillars[2][1]}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="purpose-visual fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="purpose-illustration">
              <div className="purpose-orbit-ring"></div>
              <div className="purpose-glow"></div>
              <div className="purpose-center-icon">
                <i className="fas fa-compass"></i>
              </div>

              <div className="purpose-orbit-item orbit-1">
                <i className="fas fa-star"></i>
              </div>
              <div className="purpose-orbit-item orbit-2">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="purpose-orbit-item orbit-3">
                <i className="fas fa-users"></i>
              </div>
              <div className="purpose-orbit-item orbit-4">
                <i className="fas fa-heart"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PurposeSection
