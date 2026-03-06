import MarketingNavbar from '../../components/marketing/MarketingNavbar'
import MarketingFooter from '../../components/marketing/MarketingFooter'
import AboutIntroSection from '../../components/marketing/about/AboutIntroSection'
import PurposeSection from '../../components/marketing/about/PurposeSection'
import StatsSection from '../../components/marketing/about/StatsSection'
import TeamSection from '../../components/marketing/about/TeamSection'
import useFadeUp from '../../hooks/useFadeUp'
import '../../styles/marketing/common.css'
import '../../styles/marketing/hakkimizda.css'

function MarketingHakkimizda() {
  const containerRef = useFadeUp()

  return (
    <div className="marketing-page marketing-hakkimizda" ref={containerRef}>
      <MarketingNavbar />
      <AboutIntroSection />
      <hr className="section-divider" />
      <PurposeSection />
      <StatsSection />
      <TeamSection />
      <MarketingFooter />
    </div>
  )
}

export default MarketingHakkimizda
