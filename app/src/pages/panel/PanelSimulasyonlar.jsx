import SectionHeader from '../../components/panel/SectionHeader.jsx'
import '../../styles/panel-pages/oyun-suresi.css'

const sims = [
  { id: 's1', title: 'Galaxy Explorer', meta: 'Uzay • Keşif' },
  { id: 's2', title: 'Robot Wars', meta: 'Mekanik ? Strateji' },
  { id: 's3', title: 'Pixel Art Maker', meta: 'Sanat • Tasarım' }
]

function PanelSimulasyonlar() {
  return (
    <div>
      <SectionHeader
        title="Simülasyonlar"
        description="Kullanılabilir görevler ve deneyim içerikleri."
      />
      <div className="analysis-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><i className="fa-solid fa-vr-cardboard"></i> Öne Çıkanlar</h3>
          </div>
          <div className="session-timeline">
            {sims.map((sim) => (
              <div className="session-item" key={sim.id}>
                <div className="st-time">{sim.meta}</div>
                <div className="st-game">{sim.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelSimulasyonlar
