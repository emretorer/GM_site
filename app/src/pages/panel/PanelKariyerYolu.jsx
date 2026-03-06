import SectionHeader from '../../components/panel/SectionHeader.jsx'

import '../../styles/panel-pages/kariyer-yolu.css'



const careerCards = [

  {

    id: 'space',

    theme: 'theme-space',

    match: 98,

    icon: 'fa-solid fa-shuttle-space',

    title: 'Uzay Mhendisi',

    desc: 'Gelecein roketlerini tasarlayan, yldzlara ulamay hedefleyen ve bilinmeyeni kefeden bir vizyoner.',

    whyColor: 'blue',

    whyText: 'Mekanik zekas ve uzamsal alg ok yksek.'

  },

  {

    id: 'game',

    theme: 'theme-game',

    match: 94,

    icon: 'fa-solid fa-gamepad',

    title: 'Oyun Tasarmcs',

    desc: 'Hayal gcn kodlarla birletirerek milyonlarca insann iinde kaybolaca dijital dnyalar yaratan bir hikaye anlatcs.',

    whyColor: '#EA580C',

    whyText: 'Yaratclk ve problem zme dengesi mkemmel.'

  },

  {

    id: 'bio',

    theme: 'theme-bio',

    match: 89,

    icon: 'fa-solid fa-dna',

    title: 'Biyomedikal Uzman',

    desc: 'Teknolojiyi kullanarak insan saln iyiletiren, yapay organlar ve akll protezler gelitiren bir mucitlik.',

    whyColor: '#7C3AED',

    whyText: 'Empati yetenei ile bilimsel merak bir arada.'

  }

]



function PanelKariyerYolu() {

  return (

    <div className="main-content">

      <SectionHeader

        title={<>Gelecek <span className="highlight-text">Yolculuunuz</span></>}

        description="Mevcut yetenek skorlar, oyun ii tercihleri ve ilgi alanlar analiz edildi. te potansiyelinizi en iyi yanstan 3 gelecek vizyonu."

        titleClassName=""

        descClassName=""

      />

      <div className="recommendation-grid">

        {careerCards.map((card) => (

          <div className={`career-card ${card.theme}`} key={card.id}>

            <div className="match-badge">

              <i className="fa-solid fa-fingerprint"></i> %{card.match} Eleme

            </div>

            <div className="icon-container">

              <i className={card.icon}></i>

            </div>

            <h2 className="card-title">{card.title}</h2>

            <p className="card-desc">{card.desc}</p>

            <div className="why-box">

              <div className="why-title">Neden Bu Meslek</div>

              <div className="why-text">

                <i className="fa-solid fa-check-circle" style={{ color: card.whyColor }}></i>

                {card.whyText}

              </div>

            </div>

            <a className="btn-detail" href="#">

              ncelemeye Bala <i className="fa-solid fa-arrow-right"></i>

            </a>

          </div>

        ))}

      </div>

      <div style={{ marginTop: 40, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>

         2025 ocuk Geliim Platformu - Bu neriler yapay zeka destekli analizlere dayanmaktadr.

      </div>

    </div>

  )

}



export default PanelKariyerYolu

