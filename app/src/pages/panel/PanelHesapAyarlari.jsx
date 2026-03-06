import SectionHeader from '../../components/panel/SectionHeader.jsx'
import '../../styles/panel-pages/finans.css'

const settings = [
  { id: 's1', label: 'E-posta', value: 'elif@example.com' },
  { id: 's2', label: 'Telefon', value: '+90 5xx xxx xx xx' },
  { id: 's3', label: 'Dil', value: 'Türkçe' }
]

function PanelHesapAyarlari() {
  return (
    <div>
      <SectionHeader
        title="Hesap Ayarları"
        description="Profil bilgileri ve tercih ayarları."
      />
      <div className="content-card">
        <div className="history-list">
          {settings.map((item) => (
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

export default PanelHesapAyarlari
