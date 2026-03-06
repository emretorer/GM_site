import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMarketingLanguage } from '../../context/MarketingLanguageContext.jsx'

const NAVBAR_COPY = {
  tr: {
    why: 'Neden GM?',
    visionMission: 'Vizyon & Misyon',
    whoWeAre: 'Biz Kimiz?',
    techScience: 'Teknoloji & Bilim',
    tubitakApproved: 'TÜBİTAK Onaylı',
    products: 'Ürünlerimiz',
    freeTrial: 'Ücretsiz Deneme',
    individual: 'Bireysel Abonelik',
    schools: 'Okullar için',
    psychologists: 'Psikologlar için',
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    switchToTurkish: 'Türkçe',
    switchToEnglish: 'İngilizce',
  },
  en: {
    why: 'Why GM?',
    visionMission: 'Vision & Mission',
    whoWeAre: 'Who We Are',
    techScience: 'Technology & Science',
    tubitakApproved: 'TUBITAK Approved',
    products: 'Products',
    freeTrial: 'Free Trial',
    individual: 'Individual Plan',
    schools: 'For Schools',
    psychologists: 'For Psychologists',
    login: 'Log In',
    register: 'Sign Up',
    switchToTurkish: 'Turkish',
    switchToEnglish: 'English',
  },
}

function MarketingNavbar() {
  const location = useLocation()
  const { language, setLanguage } = useMarketingLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMobileSection, setActiveMobileSection] = useState(null)
  const copy = NAVBAR_COPY[language]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const isWhyActive =
    isActive('/vizyon-misyon') || isActive('/hakkimizda') || isActive('/biz-kimiz')
  const isProductsActive = isActive('/urunler')

  const mobileNavSections = [
    {
      id: 'why',
      title: copy.why,
      links: [
        { to: '/vizyon-misyon', label: copy.visionMission, active: isActive('/vizyon-misyon') },
        { to: '/biz-kimiz', label: copy.whoWeAre, active: isActive('/biz-kimiz') },
      ],
    },
    {
      id: 'tech',
      title: copy.techScience,
      links: [
        { to: '/tubitak-onayli', label: copy.tubitakApproved, active: isActive('/tubitak-onayli') },
      ],
    },
    {
      id: 'products',
      title: copy.products,
      links: [
        { to: '/urunler', label: copy.products, active: isProductsActive },
        { to: '/urunler#ucretsiz', label: copy.freeTrial, active: isProductsActive },
        { to: '/urunler#bireysel', label: copy.individual, active: isProductsActive },
        { to: '/urunler#okul', label: copy.schools, active: isProductsActive },
        { to: '/urunler#psikolog', label: copy.psychologists, active: isProductsActive },
      ],
    },
  ]

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveMobileSection(null)
  }, [location.pathname])

  function handleMobileMenuToggle() {
    setIsMobileMenuOpen((prev) => {
      if (prev) {
        setActiveMobileSection(null)
      }

      return !prev
    })
  }

  function handleMobileMenuClose() {
    setIsMobileMenuOpen(false)
    setActiveMobileSection(null)
  }

  function handleMobileSectionToggle(sectionId) {
    setActiveMobileSection((prev) => (prev === sectionId ? null : sectionId))
  }

  return (
    <nav className="navbar">
      <button
        type="button"
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={handleMobileMenuClose}
        aria-hidden={!isMobileMenuOpen}
        tabIndex={isMobileMenuOpen ? 0 : -1}
      />

      <div className="nav-inner">
        <Link to="/" className="logo-area">
          <img src="/assets/logo-2.webp" alt="Genius Methods" className="logo-img only-logo" />
          <span className="logo-text">GeniusMethods</span>
        </Link>

        <div className="nav-links">
          <div className="dropdown-container">
            <span
              className={`nav-item ${isWhyActive ? 'active' : ''}`}
            >
              {copy.why} <i className="fas fa-chevron-down"></i>
            </span>
            <ul className="dropdown-menu">
              <li><Link to="/vizyon-misyon">{copy.visionMission}</Link></li>
              <li><Link to="/biz-kimiz">{copy.whoWeAre}</Link></li>
            </ul>
          </div>

          <div className="dropdown-container">
            <span className="nav-item">
              {copy.techScience} <i className="fas fa-chevron-down"></i>
            </span>
            <ul className="dropdown-menu">
              <li><Link to="/tubitak-onayli">{copy.tubitakApproved}</Link></li>
            </ul>
          </div>

          <div className="dropdown-container">
            <Link
              to="/urunler"
              className={`nav-item ${isProductsActive ? 'active' : ''}`}
            >
              {copy.products} <i className="fas fa-chevron-down"></i>
            </Link>
            <ul className="dropdown-menu">
              <li><Link to="/urunler#ucretsiz">{copy.freeTrial}</Link></li>
              <li><Link to="/urunler#bireysel">{copy.individual}</Link></li>
              <li><Link to="/urunler#okul">{copy.schools}</Link></li>
              <li><Link to="/urunler#psikolog">{copy.psychologists}</Link></li>
            </ul>
          </div>
        </div>

        <div className="nav-utility-group">
          <div className="language-switcher" role="group" aria-label="Language switcher">
            <button
              type="button"
              className={`language-option ${language === 'tr' ? 'active' : ''}`}
              onClick={() => setLanguage('tr')}
              aria-pressed={language === 'tr'}
              title={copy.switchToTurkish}
            >
              TR
            </button>
            <button
              type="button"
              className={`language-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              title={copy.switchToEnglish}
            >
              EN
            </button>
          </div>

          <div className="nav-actions">
            <Link to="/panel/login" className="btn-login">{copy.login}</Link>
            <Link to="/panel/kayit" className="btn-register">{copy.register}</Link>
          </div>

          <button
            type="button"
            className={`nav-mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={handleMobileMenuToggle}
            aria-expanded={isMobileMenuOpen}
            aria-controls="marketing-mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      <div
        id="marketing-mobile-menu"
        className={`mobile-nav-panel ${isMobileMenuOpen ? 'open' : ''}`}
      >
        <div className="mobile-nav-content">
          {mobileNavSections.map((section) => (
            <div className="mobile-nav-section" key={section.id}>
              <button
                type="button"
                className={`mobile-nav-trigger ${activeMobileSection === section.id ? 'active' : ''}`}
                onClick={() => handleMobileSectionToggle(section.id)}
                aria-expanded={activeMobileSection === section.id}
              >
                <span className="mobile-nav-title">{section.title}</span>
                <i className="fa-solid fa-chevron-down"></i>
              </button>

              {activeMobileSection === section.id ? (
                <div className="mobile-nav-links">
                  {section.links.map((link) => (
                    <Link
                      key={`${section.id}-${link.to}`}
                      to={link.to}
                      className={`mobile-nav-link ${link.active ? 'active' : ''}`}
                      onClick={handleMobileMenuClose}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          <div className="mobile-auth-actions">
            <Link
              to="/panel/login"
              className="mobile-auth-link mobile-auth-link-secondary"
              onClick={handleMobileMenuClose}
            >
              {copy.login}
            </Link>
            <Link
              to="/panel/kayit"
              className="mobile-auth-link mobile-auth-link-primary"
              onClick={handleMobileMenuClose}
            >
              {copy.register}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MarketingNavbar
