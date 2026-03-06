import { NavLink } from 'react-router-dom'

export const navItems = [
  { to: '/panel/haberler', label: 'Haber Akışı', icon: 'fa-regular fa-newspaper' },
  { to: '/panel/ana-navigasyon', label: 'Ana Panel', icon: 'fa-solid fa-border-all' },
  { to: '/panel/oyun-suresi', label: 'Oyun Süresi', icon: 'fa-solid fa-chart-simple' },
  { to: '/panel/yetenek', label: 'Yetenek Gelişimi', icon: 'fa-solid fa-arrow-trend-up' },
  { to: '/panel/kariyer-yolu', label: 'Kariyer Yolu', icon: 'fa-solid fa-road' },
  { to: '/panel/meslek-rehberi', label: 'Meslek Rehberi', icon: 'fa-solid fa-book-open-reader' },
  { to: '/panel/basarilar', label: 'Başarılar', icon: 'fa-solid fa-medal' },
  { to: '/panel/ilgi-alanlari', label: 'İlgi Alanları', icon: 'fa-regular fa-lightbulb' },
  { to: '/panel/gelisim-agaci', label: 'Gelişim Ağacı', icon: 'fa-solid fa-tree' },
  { to: '/panel/finans', label: 'Finans', icon: 'fa-solid fa-gem' },
  { to: '/panel/oyun-bilgileri', label: 'Oyunumuz Hakkında', icon: 'fa-solid fa-circle-info' },
  { to: '/panel/yardim', label: 'Yardım Paneli', icon: 'fa-regular fa-circle-question' }
]

function PanelSidebar({ isExpanded, onToggle }) {
  return (
    <aside className="sidebar">
      <div className="logo-area">
        <div className="logo-part">
          <span className="logo-icon">
            <img src="/assets/logo-2.webp" alt="GeniusMethods" />
          </span>
          <span className="logo-text">Veli Paneli</span>
        </div>
      </div>

      <nav className="nav-menu">
        <ul>
          {navItems.map(item => (
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

export default PanelSidebar
