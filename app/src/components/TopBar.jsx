import { useEffect, useRef, useState } from 'react'

function TopBar() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (!dropdownRef.current || !buttonRef.current) return
      if (
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <header className="top-bar">
      <div className="search-box"></div>

      <div className="profile-wrapper">
        <div
          className="user-profile"
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(prev => !prev)
          }}
        >
          <img
            src="https://ui-avatars.com/api/?name=Elif&background=4F46E5&color=fff"
            alt="Profil"
          />
        </div>

        <div
          className={isOpen ? 'profile-dropdown show' : 'profile-dropdown'}
          id="profileDropdown"
          ref={dropdownRef}
        >
          <div className="pd-header">
            <div className="pd-user-info">
              <strong>Elif Yılmaz</strong>
              <span>Bireysel Hesap</span>
            </div>
          </div>
          <ul className="pd-menu">
            <li>
              <a href="/panel/hesap-ayarlari">
                <i className="fa-solid fa-gear"></i> Hesap Ayarları
              </a>
            </li>
            <li>
              <a href="/panel/odemeler">
                <i className="fa-solid fa-credit-card"></i> Ödemeler
              </a>
            </li>
          </ul>
          <div className="pd-divider"></div>
          <ul className="pd-menu">
            <li>
              <a href="/panel/login" className="text-danger">
                <i className="fa-solid fa-right-from-bracket"></i> Çıkış Yap
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default TopBar
