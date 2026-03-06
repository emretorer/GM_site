import { NavLink } from 'react-router-dom'

export const ogrenciNavItems = [
  { to: '/ogrenci-panel/ana-sayfa', label: 'Ana Sayfa', icon: 'fa-solid fa-house' },
  { to: '/ogrenci-panel/yetenek', label: 'Yetenek Gelişimi', icon: 'fa-solid fa-arrow-trend-up' },
  { to: '/ogrenci-panel/meslek-rehberi', label: 'Meslek Rehberi', icon: 'fa-solid fa-book-open-reader' },
  { to: '/ogrenci-panel/finans', label: 'Finans', icon: 'fa-solid fa-wallet' },
  { to: '/ogrenci-panel/basarilar', label: 'Başarılar', icon: 'fa-solid fa-medal' },
]

function OgrenciPanelSidebar({ isExpanded, onToggle }) {
  return (
    <aside className="sidebar ogrenci-sidebar">
      <div className="logo-area">
        <div className="logo-part">
          <span className="logo-icon">
            <img src="/assets/logo-2.webp" alt="GeniusMethods" />
          </span>
          <span className="logo-text">Öğrenci Paneli</span>
        </div>
      </div>

      <nav className="nav-menu">
        <ul>
          {ogrenciNavItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <i className={item.icon}></i> <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default OgrenciPanelSidebar
