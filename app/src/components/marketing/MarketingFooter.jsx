import { Link } from 'react-router-dom'
import { useMarketingLanguage } from '../../context/MarketingLanguageContext.jsx'

const FOOTER_COPY = {
  tr: {
    description: 'Veri tabanlı davranışsal analiz ve yetenek keşif platformu. Geleceğin profesyonellerini bugünden keşfediyoruz.',
    corporate: 'Kurumsal',
    whoWeAre: 'Biz Kimiz',
    visionMission: 'Vizyon & Misyon',
    contact: 'İletişim',
    products: 'Ürünler',
    free: 'Ücretsiz',
    individual: 'Bireysel',
    schools: 'Okullar',
    psychologists: 'Psikologlar',
    rights: 'Tüm hakları saklıdır.',
  },
  en: {
    description: 'A data-driven behavioral analysis and talent discovery platform. We uncover tomorrow\'s professionals today.',
    corporate: 'Corporate',
    whoWeAre: 'Who We Are',
    visionMission: 'Vision & Mission',
    contact: 'Contact',
    products: 'Products',
    free: 'Free',
    individual: 'Individual',
    schools: 'Schools',
    psychologists: 'Psychologists',
    rights: 'All rights reserved.',
  },
}

function MarketingFooter() {
  const { language } = useMarketingLanguage()
  const copy = FOOTER_COPY[language]

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-area">
              <img src="/assets/logo-2.webp" alt="GM Technology" className="footer-logo-img" />
              <span className="logo-text">GeniusMethods</span>
            </Link>
            <p>{copy.description}</p>
          </div>

          <div className="footer-links">
            <div>
              <h4>{copy.corporate}</h4>
              <ul>
                <li><Link to="/biz-kimiz">{copy.whoWeAre}</Link></li>
                <li><Link to="/vizyon-misyon">{copy.visionMission}</Link></li>
                <li><Link to="/">{copy.contact}</Link></li>
              </ul>
            </div>

            <div>
              <h4>{copy.products}</h4>
              <ul>
                <li><Link to="/urunler#ucretsiz">{copy.free}</Link></li>
                <li><Link to="/urunler#bireysel">{copy.individual}</Link></li>
                <li><Link to="/urunler#okul">{copy.schools}</Link></li>
                <li><Link to="/urunler#psikolog">{copy.psychologists}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; 2026 GM TECHNOLOGY. {copy.rights} Antalya Teknokent / AR-GE
        </div>
      </div>
    </footer>
  )
}

export default MarketingFooter
