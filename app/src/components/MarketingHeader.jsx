import { NavLink } from 'react-router-dom'

function MarketingHeader() {
  return (
    <header className="marketing-header">
      <div className="marketing-brand">Genius Methods</div>
      <nav className="marketing-nav">
        <NavLink to="/" className="nav-link">Ana Sayfa</NavLink>
        <NavLink to="/vizyon-misyon" className="nav-link">Vizyon & Misyon</NavLink>
        <NavLink to="/urunler" className="nav-link">Urunler</NavLink>
        <NavLink to="/panel" className="nav-link">Panele Git</NavLink>
      </nav>
    </header>
  )
}

export default MarketingHeader
