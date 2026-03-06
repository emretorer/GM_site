import { NavLink } from 'react-router-dom'

const cards = [
  {
    to: '/panel/haberler',
    icon: 'fa-regular fa-newspaper',
    title: 'Haber Akışı',
    desc: 'Sistem duyuruları ve güncellemeler.',
    footer: 'Son: 2 Saat Önce',
    footerColor: '#2bb23f'
  },
  {
    to: '/panel/gelisim-agaci',
    icon: 'fa-solid fa-tree',
    title: 'Gelişim Ağacı',
    desc: 'Pedagojik büyüme haritası.',
    footer: '%85 Gelişim',
    footerColor: '#2bb23f',
    iconStyle: { background: '#F0FDF4', color: '#22C55E' }
  }
]

function PanelHome() {
  return (
    <>
      <div className="welcome-header">
        <h1>Merhaba, Elif</h1>
        <p>Bugünkü gelişim özetiniz.</p>
      </div>

      <div className="nav-grid">
        {cards.map(card => (
          <NavLink key={card.to} to={card.to} className="nav-card">
            <div className="card-icon-box" style={card.iconStyle}>
              <i className={card.icon}></i>
            </div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-desc">{card.desc}</p>
            <div className="card-footer">
              <span style={{ fontSize: 12, color: card.footerColor }}>{card.footer}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </NavLink>
        ))}
      </div>
    </>
  )
}

export default PanelHome
