import SectionHeader from '../../components/panel/SectionHeader.jsx'
import '../../styles/panel-pages/finans.css'

const methods = [
  { id: 'm1', label: 'Visa **** 1142', status: 'Varsayılan' },
  { id: 'm2', label: 'Mastercard **** 7791', status: 'Aktif' }
]

const invoices = [
  { id: 'i1', date: '24/10/2025', amount: '₺499', status: 'Başarılı' },
  { id: 'i2', date: '24/09/2025', amount: '₺499', status: 'Başarılı' }
]

function PanelOdemeler() {
  return (
    <div>
      <SectionHeader
        title="Ödemeler"
        description="Kartlar, faturalar ve ?deme ge?miçi."
      />
      <div className="analysis-row">
        <div className="content-card">
          <div className="card-head">
            <span className="card-h-title"><i className="fa-solid fa-credit-card"></i> Kartlar</span>
          </div>
          <div className="history-list">
            {methods.map((item) => (
              <div className="h-item" key={item.id}>
                <div className="h-left">
                  <div className="h-details">
                    <h5>{item.label}</h5>
                    <span>{item.status}</span>
                  </div>
                </div>
                <div className="h-amount">Yönet</div>
              </div>
            ))}
          </div>
        </div>
        <div className="content-card">
          <div className="card-head">
            <span className="card-h-title"><i className="fa-solid fa-file-invoice"></i> Faturalar</span>
          </div>
          <div className="history-list">
            {invoices.map((item) => (
              <div className="h-item" key={item.id}>
                <div className="h-left">
                  <div className="h-details">
                    <h5>{item.date}</h5>
                    <span>{item.status}</span>
                  </div>
                </div>
                <div className="h-amount">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelOdemeler
