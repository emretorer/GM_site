import { createContext, useContext, useEffect, useState } from 'react'

const MARKETING_LANGUAGE_STORAGE_KEY = 'marketing-language'

const MarketingLanguageContext = createContext(null)

function normalizeLanguage(value) {
  return value === 'en' ? 'en' : 'tr'
}

function getInitialLanguage() {
  if (typeof window === 'undefined') {
    return 'tr'
  }

  try {
    return normalizeLanguage(window.localStorage.getItem(MARKETING_LANGUAGE_STORAGE_KEY))
  } catch {
    return 'tr'
  }
}

function MarketingLanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)

  useEffect(() => {
    try {
      window.localStorage.setItem(MARKETING_LANGUAGE_STORAGE_KEY, language)
    } catch {
      // Ignore localStorage failures and keep the in-memory preference.
    }

    document.documentElement.lang = language
  }, [language])

  const setLanguage = (nextLanguage) => {
    setLanguageState(normalizeLanguage(nextLanguage))
  }

  return (
    <MarketingLanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </MarketingLanguageContext.Provider>
  )
}

function useMarketingLanguage() {
  const context = useContext(MarketingLanguageContext)

  if (!context) {
    throw new Error('useMarketingLanguage must be used inside MarketingLanguageProvider')
  }

  return context
}

export { MARKETING_LANGUAGE_STORAGE_KEY, MarketingLanguageProvider, useMarketingLanguage }
