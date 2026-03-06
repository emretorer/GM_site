import { Link } from 'react-router-dom'
import MarketingNavbar from '../../components/marketing/MarketingNavbar'
import MarketingFooter from '../../components/marketing/MarketingFooter'
import useFadeUp from '../../hooks/useFadeUp'
import { useMarketingLanguage } from '../../context/MarketingLanguageContext.jsx'
import '../../styles/marketing/common.css'
import '../../styles/marketing/biz-kimiz.css'

const ABOUT_US_COPY = {
  tr: {
    heroBadge: 'BİZ KİMİZ',
    heroTitleTop: 'Yeteneği Keşfeden,',
    heroTitleBottom: 'Geleceği Şekillendiren Ekip.',
    heroDescription: 'Antalya Teknokent\'te kurulan GeniusMethods, davranışsal analitik ve oyunlaştırılmış simülasyonlarla bireylerin gerçek potansiyelini ortaya çıkaran bir AR-GE teknoloji şirketidir.',
    storyLabel: 'HİKAYEMİZ',
    storyTitleTop: 'Geleneksel Testlerin',
    storyTitleBottom: 'Ötesine Geçtik.',
    storyParagraphs: [
      'GeniusMethods, geleneksel yetenek değerlendirme yöntemlerinin yetersiz kaldığı noktada doğdu. Bireylerin beyana dayalı testlerle değil, doğal davranışlarıyla değerlendirilmesi gerektiğine inandık.',
      'Oyun mekaniği, yapay zeka ve psikometrik modelleri bir araya getirerek dünyada benzersiz bir davranışsal yetenek analiz platformu geliştirdik. RIASEC Holland modeli ile entegre simülasyonlarımız, önyargılardan arındırılmış saf veri temelli bir keşif deneyimi sunar.',
    ],
    storyQuote: '"Doğru yeteneği, doğru zamanda, doğru veriyle keşfetmek."',
    valuesLabel: 'DEĞERLERİMİZ',
    valuesTitle: 'Bizi Biz Yapan İlkeler',
    valuesDescription: 'Her kararımızda ve her satır kodumuzda bu ilkeleri yaşatıyoruz.',
    values: [
      ['Yenilikçilik', 'Statik yöntemlerin ötesinde, sürekli gelişen dinamik çözümler üretiyoruz. Teknolojiyi insan potansiyelinin hizmetine sunuyoruz.'],
      ['Bilimsellik', 'Tüm analizlerimiz psikometrik modeller ve bilimsel araştırmalara dayanır. Veri odaklı, kanıta dayalı yaklaşımımızdan ödün vermeyiz.'],
      ['Etik Veri', 'Kullanıcı verilerini en yüksek güvenlik standartlarıyla korur, şeffaf veri politikalarıyla güven inşa ederiz.'],
      ['Kullanıcı Odaklılık', 'Öğrenciden ebeveyne, eğitimciden psikoloğa; her paydaşımızın ihtiyacını merkeze alarak tasarlıyoruz.'],
    ],
    statsTitle: 'Rakamlarla',
    statsDescription: 'Büyüyen ekibimiz ve genişleyen etkimizle geleceğe emin adımlarla ilerliyoruz.',
    statCards: [
      ['15', '+', 'Uzman Ekip Üyesi', 'Mühendis, psikolog ve veri bilimcileri'],
      ['8', '+', 'AR-GE Projesi', 'Aktif geliştirme ve araştırma süreçleri'],
      ['10K', '+', 'Ulaşılan Kullanıcı', 'Öğrenci, ebeveyn ve eğitimciler'],
      ['50K', '+', 'Simülasyon Saati', 'Analiz edilen davranışsal veri'],
    ],
    cultureLabel: 'KÜLTÜRÜMÜZ',
    cultureTitle: 'Birlikte Büyüyoruz',
    cultureDescription: 'Antalya Teknokent\'teki AR-GE merkezimizde, merak ve tutkunun birleştiği bir çalışma ortamı inşa ediyoruz. Her ekip üyesi, hem teknik hem insani değerleriyle katkıda bulunur.',
    principles: [
      ['Açık İletişim', 'Şeffaf ve dürüst iletişim kültürümüzün temelidir.'],
      ['Sürekli Gelişim', 'Öğrenmeyi ve kendini geliştirmeyi teşvik ediyoruz.'],
      ['Takım Ruhu', 'Ortak hedefler doğrultusunda birlikte çalışıyoruz.'],
    ],
    ctaTitle: 'Geleceği Birlikte Şekillendirelim',
    ctaDescription: 'Yetenek keşfinde yeni bir dönem başlıyor. Siz de bu yolculuğun parçası olun.',
    ctaPrimary: 'Ürünlerimizi İnceleyin',
    ctaSecondary: 'Hemen Başlayın',
  },
  en: {
    heroBadge: 'WHO WE ARE',
    heroTitleTop: 'The Team That Discovers Talent',
    heroTitleBottom: 'and Shapes the Future.',
    heroDescription: 'Founded in Antalya Teknokent, GeniusMethods is an R&D technology company that reveals real human potential through behavioral analytics and gamified simulations.',
    storyLabel: 'OUR STORY',
    storyTitleTop: 'We Moved Beyond',
    storyTitleBottom: 'Traditional Tests.',
    storyParagraphs: [
      'GeniusMethods was born where traditional talent assessment methods fell short. We believed people should be evaluated not by self-reported tests, but by their natural behavior.',
      'By combining game mechanics, artificial intelligence, and psychometric models, we built a unique behavioral talent analytics platform. Our simulations integrated with the RIASEC Holland model deliver a bias-free discovery experience built on clean data.',
    ],
    storyQuote: '"Discover the right talent at the right time with the right data."',
    valuesLabel: 'OUR VALUES',
    valuesTitle: 'The Principles That Define Us',
    valuesDescription: 'We bring these principles to life in every decision and every line of code.',
    values: [
      ['Innovation', 'We build dynamic solutions that keep evolving beyond static methods. We put technology in service of human potential.'],
      ['Scientific Rigor', 'Every analysis is grounded in psychometric models and scientific research. We never compromise our evidence-based approach.'],
      ['Ethical Data', 'We protect user data with the highest security standards and build trust through transparent data policies.'],
      ['User Focus', 'From students to parents, educators to psychologists, we design around the needs of every stakeholder we serve.'],
    ],
    statsTitle: 'GeniusMethods',
    statsDescription: 'With a growing team and expanding reach, we are moving toward the future with confidence.',
    statCards: [
      ['15', '+', 'Expert Team Members', 'Engineers, psychologists, and data scientists'],
      ['8', '+', 'R&D Projects', 'Active development and research streams'],
      ['10K', '+', 'Users Reached', 'Students, parents, and educators'],
      ['50K', '+', 'Simulation Hours', 'Behavioral data analyzed'],
    ],
    cultureLabel: 'OUR CULTURE',
    cultureTitle: 'We Grow Together',
    cultureDescription: 'At our Antalya Teknokent R&D center, we build a workplace where curiosity and passion meet. Every team member contributes with both technical and human strengths.',
    principles: [
      ['Open Communication', 'Transparent and honest communication is the foundation of our culture.'],
      ['Continuous Growth', 'We encourage learning and personal development.'],
      ['Team Spirit', 'We work together around shared goals.'],
    ],
    ctaTitle: 'Let\'s Shape the Future Together',
    ctaDescription: 'A new era in talent discovery has begun. Join the journey.',
    ctaPrimary: 'Explore Our Products',
    ctaSecondary: 'Get Started',
  },
}

function MarketingBizKimiz() {
  const containerRef = useFadeUp()
  const { language } = useMarketingLanguage()
  const copy = ABOUT_US_COPY[language]

  return (
    <div className="marketing-page marketing-bizkimiz" ref={containerRef}>
      <MarketingNavbar />

      <header className="hero">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-icon-1">
          <i className="fas fa-users"></i>
        </div>
        <div className="floating-shape shape-icon-2">
          <i className="fas fa-lightbulb"></i>
        </div>

        <div className="container">
          <span className="hero-badge fade-up">{copy.heroBadge}</span>
          <h1 className="fade-up" style={{ transitionDelay: '0.1s' }}>
            {copy.heroTitleTop}
            <br />
            <span className="text-gradient">{copy.heroTitleBottom}</span>
          </h1>
          <p className="fade-up" style={{ transitionDelay: '0.2s' }}>
            {copy.heroDescription}
          </p>
        </div>
      </header>

      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content fade-up">
              <span className="section-label">{copy.storyLabel}</span>
              <h2 className="story-title">
                {copy.storyTitleTop} <br />
                <span className="text-gradient">{copy.storyTitleBottom}</span>
              </h2>

              <div className="story-text">
                <p>{copy.storyParagraphs[0]}</p>
                <p style={{ marginTop: '20px' }}>{copy.storyParagraphs[1]}</p>
              </div>

              <div className="story-quote">
                {copy.storyQuote}
              </div>
            </div>

            <div className="story-visual fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="visual-card">
                <div className="visual-inner">
                  <div className="visual-ring ring-1"></div>
                  <div className="visual-ring ring-2"></div>
                  <div className="visual-core">
                    <i className="fas fa-rocket"></i>
                    <span>2024</span>
                  </div>

                  <div className="milestone milestone-1">
                    <i className="fas fa-flask"></i>
                    <span>AR-GE</span>
                  </div>
                  <div className="milestone milestone-2">
                    <i className="fas fa-gamepad"></i>
                    <span>Simulation</span>
                  </div>
                  <div className="milestone milestone-3">
                    <i className="fas fa-brain"></i>
                    <span>AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <div className="text-center fade-up">
            <span className="section-label">{copy.valuesLabel}</span>
            <h2>{copy.valuesTitle}</h2>
            <p style={{ maxWidth: '700px', margin: '10px auto 0', color: 'var(--text-muted)' }}>
              {copy.valuesDescription}
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card card-innovation fade-up">
              <div className="v-icon"><i className="fas fa-bolt"></i></div>
              <h3>{copy.values[0][0]}</h3>
              <p>{copy.values[0][1]}</p>
            </div>

            <div className="value-card card-science fade-up" style={{ transitionDelay: '0.1s' }}>
              <div className="v-icon"><i className="fas fa-microscope"></i></div>
              <h3>{copy.values[1][0]}</h3>
              <p>{copy.values[1][1]}</p>
            </div>

            <div className="value-card card-ethics fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="v-icon"><i className="fas fa-shield-alt"></i></div>
              <h3>{copy.values[2][0]}</h3>
              <p>{copy.values[2][1]}</p>
            </div>

            <div className="value-card card-user fade-up" style={{ transitionDelay: '0.3s' }}>
              <div className="v-icon"><i className="fas fa-heart"></i></div>
              <h3>{copy.values[3][0]}</h3>
              <p>{copy.values[3][1]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="text-center fade-up">
            <h2>
              Rakamlarla <span className="text-gradient">{copy.statsTitle}</span>
            </h2>
            <p style={{ maxWidth: '600px', margin: '10px auto 0', color: 'var(--text-muted)' }}>
              {copy.statsDescription}
            </p>
          </div>

          <div className="stats-grid">
            {copy.statCards.map(([value, suffix, label, description], index) => (
              <div
                key={label}
                className="stat-card fade-up"
                style={index > 0 ? { transitionDelay: `${index * 0.1}s` } : undefined}
              >
                <div className="stat-number">{value}<span className="stat-plus">{suffix}</span></div>
                <div className="stat-label">{label}</div>
                <div className="stat-desc">{description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="culture-section">
        <div className="container">
          <div className="culture-grid">
            <div className="culture-content fade-up">
              <span className="section-label">{copy.cultureLabel}</span>
              <h2>{copy.cultureTitle}</h2>
              <p>{copy.cultureDescription}</p>
            </div>

            <div className="culture-principles fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="principle">
                <div className="principle-icon"><i className="fas fa-comments"></i></div>
                <div>
                  <h4>{copy.principles[0][0]}</h4>
                  <p>{copy.principles[0][1]}</p>
                </div>
              </div>

              <div className="principle">
                <div className="principle-icon"><i className="fas fa-chart-line"></i></div>
                <div>
                  <h4>{copy.principles[1][0]}</h4>
                  <p>{copy.principles[1][1]}</p>
                </div>
              </div>

              <div className="principle">
                <div className="principle-icon"><i className="fas fa-hands-helping"></i></div>
                <div>
                  <h4>{copy.principles[2][0]}</h4>
                  <p>{copy.principles[2][1]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box fade-up">
            <h2>{copy.ctaTitle}</h2>
            <p>{copy.ctaDescription}</p>
            <div className="cta-actions">
              <Link to="/urunler" className="btn btn-primary">
                {copy.ctaPrimary} <i className="fas fa-arrow-right"></i>
              </Link>
              <Link to="/panel/login" className="btn btn-outline">
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

export default MarketingBizKimiz
