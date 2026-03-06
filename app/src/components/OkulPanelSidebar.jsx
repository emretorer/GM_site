import { NavLink } from 'react-router-dom'

export const okulNavItems = [
  { to: '/okul-panel/dashboard', label: 'Genel Bakış', icon: 'fa-solid fa-border-all' },
  { to: '/okul-panel/ogrenciler', label: 'Öğrenciler', icon: 'fa-solid fa-users' },
  { to: '/okul-panel/siniflar', label: 'Sınıf Yönetimi', icon: 'fa-solid fa-chalkboard-user' },
  { to: '/okul-panel/ayarlar', label: 'Kurum Ayarları', icon: 'fa-solid fa-gear' },
]

function OkulPanelSidebar({ isExpanded, onToggle }) {
  return (
    <aside className="sidebar okul-sidebar">
      <div className="logo-area">
        <div className="logo-part">
          <span className="logo-icon">
            <img src="/assets/logo-2.webp" alt="GeniusMethods" />
          </span>
          <span className="logo-text">Okul Paneli</span>
        </div>
      </div>

      <nav className="nav-menu">
        <ul>
          {okulNavItems.map(item => (
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

export default OkulPanelSidebar
