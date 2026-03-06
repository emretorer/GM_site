import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { MarketingLanguageProvider } from '../context/MarketingLanguageContext.jsx'

function MarketingLayout() {
  useEffect(() => {
    document.body.classList.remove('panel-body', 'expanded', 'collapsed')
    document.body.classList.add('marketing-body')
    return () => {
      document.body.classList.remove('marketing-body')
    }
  }, [])

  return (
    <MarketingLanguageProvider>
      <div className="app-shell">
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </MarketingLanguageProvider>
  )
}

export default MarketingLayout
