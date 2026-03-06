function PanelDashboard() {
  return (
    <section className="page">
      <h1>Panel Dashboard</h1>
      <p>Bu alan panel sayfalarinin React'a aktarilan ilk sayfasidir.</p>
      <div className="card-grid">
        <div className="card">
          <h3>Oyun Suresi</h3>
          <p>Oyun sure raporu ve grafikler.</p>
        </div>
        <div className="card">
          <h3>Yetenek Gelisimi</h3>
          <p>Yetenek profili ve gelisim takibi.</p>
        </div>
        <div className="card">
          <h3>Kariyer Yolu</h3>
          <p>Meslek ve yol haritasi.</p>
        </div>
      </div>
    </section>
  )
}

export default PanelDashboard
