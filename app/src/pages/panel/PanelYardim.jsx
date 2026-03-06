import SectionHeader from '../../components/panel/SectionHeader.jsx'
import '../../styles/panel-pages/meslek-rehberi.css'

const faqs = [
  { id: 'f1', q: 'Raporlar nasıl okunur?', a: 'Her kartta açıklama ve öneri bölüm yer alır. Detaylarda geliçim trendini görürsünüz.' },
  { id: 'f2', q: 'Veriler ne sıklıkla güncellenir?', a: 'Oyun içi her oturum sonrası otomatik güncellenir.' },
  { id: 'f3', q: 'Aile payla??m? var mı', a: 'Yakında aile profili ve çoklu kullanıcı desteği eklenecek.' }
]

function PanelYardim() {
  return (
    <div>
      <SectionHeader
        title="Yardım"
        description="Sık sorulan sorular ve hızlı destek başlıklar."
      />
      <div className="catalog-grid">
        {faqs.map((item) => (
          <div className="info-card" key={item.id}>
            <div className="ic-header">
              <div className="ic-icon-box"><i className="fa-solid fa-circle-question"></i></div>
              <h3 className="ic-title">{item.q}</h3>
              <p className="ic-subtitle">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PanelYardim
