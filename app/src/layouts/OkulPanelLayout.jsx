import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import OkulPanelSidebar, { okulNavItems } from '../components/OkulPanelSidebar.jsx'
import { OkulProvider } from '../context/OkulContext.jsx'
import { signOutAndClearToken } from '../api/index.js'
import '../styles/panel.css'
import '../styles/panel-pages/okul-panel.css'
import { initPanelInteractions } from '../scripts/panelInteractions.js'

function OkulPanelLayout() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileRouterOpen, setIsMobileRouterOpen] = useState(false)
  const [isDrawerClosing, setIsDrawerClosing] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const showSidebar = !location.pathname.startsWith('/panel/login')

  useEffect(() => {
    document.body.classList.add('panel-body')
    return () => {
      document.body.classList.remove('panel-body', 'expanded', 'collapsed')
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('expanded', isExpanded && showSidebar)
    document.body.classList.toggle('collapsed', isExpanded && showSidebar)
  }, [isExpanded, showSidebar])

  useEffect(() => {
    document.body.classList.toggle('panel-no-sidebar', !showSidebar)
    if (!showSidebar) {
      document.body.classList.remove('expanded', 'collapsed')
    }
    return () => {
      document.body.classList.remove('panel-no-sidebar')
    }
  }, [showSidebar])

  useEffect(() => {
    let cleanup = () => {}
    const timer = window.setTimeout(() => {
      cleanup = initPanelInteractions()
    }, 0)
    return () => {
      window.clearTimeout(timer)
      cleanup()
    }
  }, [location.pathname])

  useEffect(() => {
    setIsMobileRouterOpen(false)
    setIsDrawerClosing(false)
    window.scrollTo(0, 0)
    const mainEl = document.querySelector('.main-content')
    if (mainEl) mainEl.scrollTop = 0
  }, [location.pathname])

  const closeDrawer = () => {
    setIsDrawerClosing(true)
    setTimeout(() => {
      setIsMobileRouterOpen(false)
      setIsDrawerClosing(false)
    }, 400)
  }

  const handleDrawerToggle = () => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      if (isMobileRouterOpen) {
        closeDrawer()
      } else {
        setIsMobileRouterOpen(true)
      }
      return
    }
    setIsExpanded(prev => !prev)
  }

  const handleLogout = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)
    try {
      await signOutAndClearToken()
    } finally {
      setIsMobileRouterOpen(false)
      setIsDrawerClosing(false)
      navigate('/panel/login', { replace: true })
      setIsSigningOut(false)
    }
  }

  return (
    <div className="panel-root okul-panel-root">
      {showSidebar ? (
        <OkulPanelSidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(prev => !prev)} />
      ) : null}
      {showSidebar ? (
        <button
          type="button"
          className="drawer-toggle"
          onClick={handleDrawerToggle}
          aria-label="Sidebar Drawer Toggle"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      ) : null}
      {isMobileRouterOpen ? (
        <div className={`mobile-router-overlay${isDrawerClosing ? ' closing' : ''}`} onClick={closeDrawer}>
          <div className="mobile-router-sheet" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="mobile-router-close"
              onClick={closeDrawer}
              aria-label="Kapat"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="mobile-router-logo">
              <img src="/assets/logo-2.webp" alt="GeniusMethods" />
            </div>
            <h3>Sayfaya Git</h3>
            <nav className="mobile-router-nav">
              {okulNavItems.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={closeDrawer}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
      <main className="main-content">
        {showSidebar ? (
          <header className="top-bar panel-topbar">
            <div className="topbar-spacer" aria-hidden="true"></div>
            <div className="topbar-actions">
              <button
                type="button"
                className="topbar-logout-btn"
                onClick={handleLogout}
                disabled={isSigningOut}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>{isSigningOut ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}</span>
              </button>
            </div>
          </header>
        ) : null}
        <div className="content-body">
          <OkulProvider>
            <Outlet />
          </OkulProvider>
        </div>
      </main>
    </div>
  )
}

export default OkulPanelLayout
