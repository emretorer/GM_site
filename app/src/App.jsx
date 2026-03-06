import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import './styles/app.css'

const PanelLayout = lazy(() => import('./layouts/PanelLayout.jsx'))
const MarketingLayout = lazy(() => import('./layouts/MarketingLayout.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const MarketingIndex = lazy(() => import('./pages/marketing/MarketingIndex.jsx'))
const MarketingVizyonMisyon = lazy(() => import('./pages/marketing/MarketingVizyonMisyon.jsx'))
const MarketingUrunler = lazy(() => import('./pages/marketing/MarketingUrunler.jsx'))
const TubitakPage = lazy(() => import('./pages/marketing/TubitakPage.jsx'))
const MarketingBizKimiz = lazy(() => import('./pages/marketing/MarketingBizKimiz.jsx'))
const MarketingHakkimizda = lazy(() => import('./pages/marketing/MarketingHakkimizda.jsx'))

const PanelAnaNavigasyon = lazy(() => import('./pages/panel/PanelAnaNavigasyon.jsx'))
const PanelHaberler = lazy(() => import('./pages/panel/PanelHaberler.jsx'))
const PanelOyunSuresi = lazy(() => import('./pages/panel/PanelOyunSuresi.jsx'))
const PanelYetenek = lazy(() => import('./pages/panel/PanelYetenek.jsx'))
const PanelKariyerYolu = lazy(() => import('./pages/panel/PanelKariyerYolu.jsx'))
const PanelMeslekRehberi = lazy(() => import('./pages/panel/PanelMeslekRehberi.jsx'))
const PanelBasarilar = lazy(() => import('./pages/panel/PanelBasarilar.jsx'))
const PanelIlgiAlanlari = lazy(() => import('./pages/panel/PanelIlgiAlanlari.jsx'))
const PanelGelisimAgaci = lazy(() => import('./pages/panel/PanelGelisimAgaci.jsx'))
const PanelFinans = lazy(() => import('./pages/panel/PanelFinans.jsx'))
const PanelOyunBilgileri = lazy(() => import('./pages/panel/PanelOyunBilgileri.jsx'))
const PanelYardim = lazy(() => import('./pages/panel/PanelYardim.jsx'))
const PanelHesapAyarlari = lazy(() => import('./pages/panel/PanelHesapAyarlari.jsx'))
const PanelOdemeler = lazy(() => import('./pages/panel/PanelOdemeler.jsx'))
const PanelGizlilik = lazy(() => import('./pages/panel/PanelGizlilik.jsx'))
const PanelHesapSil = lazy(() => import('./pages/panel/PanelHesapSil.jsx'))
const PanelLogin = lazy(() => import('./pages/panel/PanelLogin.jsx'))
const PanelRegister = lazy(() => import('./pages/panel/PanelRegister.jsx'))
const PanelSimulasyonlar = lazy(() => import('./pages/panel/PanelSimulasyonlar.jsx'))

const OgrenciPanelLayout = lazy(() => import('./layouts/OgrenciPanelLayout.jsx'))
const OgrenciAnaSayfa = lazy(() => import('./pages/ogrenci-panel/OgrenciAnaSayfa.jsx'))
const OgrenciFinans = lazy(() => import('./pages/ogrenci-panel/OgrenciFinans.jsx'))
const OgrenciBasarilar = lazy(() => import('./pages/ogrenci-panel/OgrenciBasarilar.jsx'))
const OgrenciYetenek = lazy(() => import('./pages/ogrenci-panel/OgrenciYetenek.jsx'))
const OgrenciMeslekRehberi = lazy(() => import('./pages/ogrenci-panel/OgrenciMeslekRehberi.jsx'))

const OkulPanelLayout = lazy(() => import('./layouts/OkulPanelLayout.jsx'))
const OkulDashboard = lazy(() => import('./pages/okul-panel/OkulDashboard.jsx'))
const OkulOgrenciler = lazy(() => import('./pages/okul-panel/OkulOgrenciler.jsx'))
const OkulOgrenciDetay = lazy(() => import('./pages/okul-panel/OkulOgrenciDetay.jsx'))
const OkulSiniflar = lazy(() => import('./pages/okul-panel/OkulSiniflar.jsx'))
const OkulAyarlar = lazy(() => import('./pages/okul-panel/OkulAyarlar.jsx'))

function scrollDocumentToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) {
      return undefined
    }

    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useLayoutEffect(() => {
    scrollDocumentToTop()
    const frameId = window.requestAnimationFrame(scrollDocumentToTop)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<MarketingLayout />}>
            <Route index element={<MarketingIndex />} />
            <Route path="vizyon-misyon" element={<MarketingVizyonMisyon />} />
            <Route path="urunler" element={<MarketingUrunler />} />
            <Route path="tubitak-onayli" element={<TubitakPage />} />
            <Route path="davranis-analitik" element={<TubitakPage />} />
            <Route path="biz-kimiz" element={<MarketingBizKimiz />} />
            <Route path="hakkimizda" element={<MarketingHakkimizda />} />
          </Route>

          <Route path="/panel" element={<PanelLayout />}>
            <Route index element={<Navigate to="ana-navigasyon" replace />} />
            <Route path="ana-navigasyon" element={<PanelAnaNavigasyon />} />
            <Route path="haberler" element={<PanelHaberler />} />
            <Route path="oyun-suresi" element={<PanelOyunSuresi />} />
            <Route path="yetenek" element={<PanelYetenek />} />
            <Route path="kariyer-yolu" element={<PanelKariyerYolu />} />
            <Route path="meslek-rehberi" element={<PanelMeslekRehberi />} />
            <Route path="basarilar" element={<PanelBasarilar />} />
            <Route path="ilgi-alanlari" element={<PanelIlgiAlanlari />} />
            <Route path="gelisim-agaci" element={<PanelGelisimAgaci />} />
            <Route path="finans" element={<PanelFinans />} />
            <Route path="oyun-bilgileri" element={<PanelOyunBilgileri />} />
            <Route path="yardim" element={<PanelYardim />} />
            <Route path="hesap-ayarlari" element={<PanelHesapAyarlari />} />
            <Route path="odemeler" element={<PanelOdemeler />} />
            <Route path="gizlilik" element={<PanelGizlilik />} />
            <Route path="hesap-sil" element={<PanelHesapSil />} />
            <Route path="login" element={<PanelLogin />} />
            <Route path="kayit" element={<PanelRegister />} />
            <Route path="simulasyonlar" element={<PanelSimulasyonlar />} />
          </Route>

          <Route path="/ogrenci-panel" element={<OgrenciPanelLayout />}>
            <Route index element={<Navigate to="ana-sayfa" replace />} />
            <Route path="ana-sayfa" element={<OgrenciAnaSayfa />} />
            <Route path="yetenek" element={<OgrenciYetenek />} />
            <Route path="meslek-rehberi" element={<OgrenciMeslekRehberi />} />
            <Route path="finans" element={<OgrenciFinans />} />
            <Route path="basarilar" element={<OgrenciBasarilar />} />
          </Route>

          <Route path="/okul-panel" element={<OkulPanelLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OkulDashboard />} />
            <Route path="ogrenciler" element={<OkulOgrenciler />} />
            <Route path="ogrenci-detay" element={<OkulOgrenciDetay />} />
            <Route path="siniflar" element={<OkulSiniflar />} />
            <Route path="ayarlar" element={<OkulAyarlar />} />
          </Route>

          <Route path="/okul-panel/*" element={<Navigate to="/okul-panel" replace />} />
          <Route path="/ogrenci-panel/*" element={<Navigate to="/ogrenci-panel" replace />} />
          <Route path="/panel/*" element={<Navigate to="/panel" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
