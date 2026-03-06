import SectionHeader from '../../components/panel/SectionHeader.jsx'
import '../../styles/panel-pages/finans.css'

const toggles = [
  { id: 'g1', label: 'Veri Paylaşım', value: 'Kapalı' },
  { id: 'g2', label: 'Aktivite Takibi', value: 'Açık' },
  { id: 'g3', label: 'E-posta Bildirimleri', value: 'Açık' }
]

function PanelGizlilik() {
  return (
    <div>
      <SectionHeader
        title="Gizlilik"
        description="Veri kullanımı ve bildirim tercihleri."
      />
      <div className="content-card">
        <div className="history-list">
          {toggles.map((item) => (
            <div className="h-item" key={item.id}>
              <div className="h-left">
                <div className="h-details">
                  <h5>{item.label}</h5>
                  <span>{item.value}</span>
                </div>
              </div>
              <div className="h-amount">Düzenle</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PanelGizlilik
