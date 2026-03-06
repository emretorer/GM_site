import SectionHeader from '../../components/panel/SectionHeader.jsx'
import '../../styles/panel-pages/finans.css'

function PanelHesapSil() {
  return (
    <div>
      <SectionHeader
        title="Hesap Sil"
        description="Bu işlem geri alınamaz. Lütfen dikkatli olun."
      />
      <div className="content-card" style={{ borderColor: '#FCA5A5', background: '#FEF2F2' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ color: '#DC2626', marginTop: 2 }}></i>
          <div>
            <h5 style={{ fontSize: 13, fontWeight: 700, color: '#B91C1C', marginBottom: 5 }}>Dikkat</h5>
            <p style={{ fontSize: 12, color: '#B91C1C', lineHeight: 1.4 }}>
              Hesabınız silindiçinde tüm raporlar ve geçmiş veriler kalıcı olarak kaldırılır.
            </p>
          </div>
        </div>
      </div>
      <div className="content-card">
        <button className="p-btn" style={{ background: '#DC2626' }}>
          Hesabı Sil (Devre Dışı)
        </button>
      </div>
    </div>
  )
}

export default PanelHesapSil
