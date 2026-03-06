import { useState, useMemo } from 'react'
import SectionHeader from '../../components/panel/SectionHeader.jsx'
import '../../styles/panel-pages/basarilar.css'

export const allAchievements = [
  // Portakal
  { id: 1, cat: 'Portakal', title: 'Denge Üstadı', desc: 'Portakal suyu servisi sırasında bardakları hiç düşürmeden taşıdı.', icon: 'fa-glass-water', theme: 'gold' },
  { id: 2, cat: 'Portakal', title: 'Ziyan Etmez', desc: 'Portakalları hiç ziyan etmeden hepsini başarıyla sıktı.', icon: 'fa-recycle', theme: 'green' },
  // Bozuk Traktör
  { id: 3, cat: 'Traktör', title: 'Usta Çırak', desc: 'Tamir sırasında sıfır hatayla doğru aletleri seçti.', icon: 'fa-wrench', theme: 'blue' },
  { id: 4, cat: 'Traktör', title: 'Sür Çapayı', desc: 'Tarlayı hiç dışarı taşırmadan kusursuz bir şekilde sürdü.', icon: 'fa-tractor', theme: 'blue' },
  // Liman Lojistik
  { id: 5, cat: 'Liman', title: 'Ekibimi Tanıyorum', desc: 'Ekip üyelerine yeteneklerine en uygun görevleri verdi.', icon: 'fa-users-gear', theme: 'purple' },
  { id: 6, cat: 'Liman', title: 'İmzamı Atarım', desc: 'Görevleri tek seferde, kontrole gerek kalmadan tamamladı.', icon: 'fa-file-signature', theme: 'purple' },
  // Nükleer Santral
  { id: 7, cat: 'Nükleer', title: 'Tik-Tak-Bom', desc: 'Süreç boyunca çekirdeği patlatmadan santrali güvenle yönetti.', icon: 'fa-radiation', theme: 'red' },
  { id: 8, cat: 'Nükleer', title: 'Hızlı ve Sakin', desc: '50 saniye boyunca tüm ayarları optimum seviyede tuttu.', icon: 'fa-stopwatch', theme: 'red' },
  // Arcade Oyun
  { id: 9, cat: 'Arcade', title: 'Taş Kıran', desc: 'Oyunda 50 adet taşı başarıyla kırdı.', icon: 'fa-hammer', theme: 'purple' },
  { id: 10, cat: 'Arcade', title: 'Dirençevik', desc: '5 farklı taşa kafa atarak kırma cesaretini gösterdi.', icon: 'fa-helmet-safety', theme: 'purple' },
  { id: 11, cat: 'Arcade', title: 'G-BOOST', desc: 'Oyundaki tüm güçlendirme (boost) türlerini topladı.', icon: 'fa-bolt', theme: 'gold' },
  // Brainclub
  { id: 12, cat: 'Brain', title: 'Sonunu Görmeden', desc: '"Devam et" seçeneğiyle pes etmeden soruları yanıtladı.', icon: 'fa-forward', theme: 'blue' },
  { id: 13, cat: 'Brain', title: 'Genius Gamer', desc: 'Tüm sorulara tek seferde doğru cevap verdi.', icon: 'fa-brain', theme: 'gold' },
  // Müze
  { id: 14, cat: 'Müze', title: 'Benden Kaçmaz', desc: 'Gizli olan 3 ipucunu da eksiksiz tamamladı.', icon: 'fa-magnifying-glass', theme: 'green' },
  { id: 15, cat: 'Müze', title: 'Sherlock', desc: 'Olay örgüsünde ilk seferde doğru kararı verdi.', icon: 'fa-user-secret', theme: 'green' },
  // Biyolab
  { id: 16, cat: 'Biyolab', title: 'Ruhum Doktor', desc: 'Sadece doğru kan değerlerini kullanarak hastalığı teşhis etti.', icon: 'fa-user-doctor', theme: 'green' },
  { id: 17, cat: 'Biyolab', title: 'Gıda Uzmanı', desc: 'Hastaya uygun yemek listesini tek seferde doğru hazırladı.', icon: 'fa-utensils', theme: 'green' },
  // Motel
  { id: 18, cat: 'Motel', title: 'Vampir Enerji', desc: '10 farklı odada en az bir kez enerji ölçümü yaptı.', icon: 'fa-plug', theme: 'gold' },
  { id: 19, cat: 'Motel', title: 'Doğru İnat', desc: 'Tüm odaları standartlara uygun hale getirip bölümü bitirdi.', icon: 'fa-bed', theme: 'gold' },
  // Havacılık
  { id: 20, cat: 'Havacılık', title: 'Jet Cambazı', desc: 'Gökyüzündeki tüm halkaların içinden başarıyla geçti.', icon: 'fa-plane-up', theme: 'blue' },
  { id: 21, cat: 'Havacılık', title: 'Kusursuz İniş', desc: 'Görev boyunca uçağı hasarsız bir şekilde piste indirdi.', icon: 'fa-plane-arrival', theme: 'blue' },
  // Reklam
  { id: 22, cat: 'Reklam', title: 'Revize Almam', desc: "Tasarımı 30'dan az değişiklikle tamamlayarak net kararlar verdi.", icon: 'fa-check-double', theme: 'purple' },
  { id: 23, cat: 'Reklam', title: 'Araç Kutusu', desc: 'Tasarım panelindeki her aracı en az bir kez kullandı.', icon: 'fa-toolbox', theme: 'purple' },
  // Otomotiv
  { id: 24, cat: 'Otomotiv', title: 'Araba Sanatçısı', desc: "Detaylara önem vererek araç üzerinde 100'den fazla değişiklik yaptı.", icon: 'fa-palette', theme: 'blue' },
  { id: 25, cat: 'Otomotiv', title: 'Elden Gelen', desc: 'Mevcut tüm modifikasyon araçlarını en az bir kez denedi.', icon: 'fa-wrench', theme: 'blue' },
  // Sokak Sanatçısı
  { id: 26, cat: 'Sokak', title: 'İlham Alıyorum', desc: "Sokak sanatçısı ile birlikte 5'ten fazla resim çizdi.", icon: 'fa-spray-can', theme: 'green' },
  { id: 27, cat: 'Sokak', title: 'Ellerim Boya', desc: "Çizimlerde %80'in üzerinde doğruluk oranı yakaladı.", icon: 'fa-paint-roller', theme: 'green' },
  // Piyano
  { id: 28, cat: 'Piyano', title: 'Müzik Kulağı', desc: 'Tüm notalara hatasız basarak kusursuz bir performans sergiledi.', icon: 'fa-music', theme: 'purple' },
  { id: 29, cat: 'Piyano', title: 'Maestro', desc: 'Oyundan çıkmayıp tüm bölümleri bitirerek azmini gösterdi.', icon: 'fa-microphone', theme: 'gold' },
  // İnşaat
  { id: 30, cat: 'İnşaat', title: 'Sade Seviyorum', desc: '5000 coinden az harcayarak bütçe dostu bir tasarım yaptı.', icon: 'fa-piggy-bank', theme: 'gold' },
  { id: 31, cat: 'İnşaat', title: 'Dünya Gözüyle', desc: 'Karakteriyle tasarım alanına inip sahayı yerinde inceledi.', icon: 'fa-person-digging', theme: 'gold' },
  // Orman
  { id: 32, cat: 'Orman', title: 'Ormanlar Hepimizin', desc: 'Verdiği kararlarda yüksek empati puanı topladı.', icon: 'fa-tree', theme: 'green' },
  { id: 33, cat: 'Orman', title: 'Gözümden Kaçmaz', desc: 'Ormandaki tüm yanlış durumları tespit edip fotoğrafladı.', icon: 'fa-camera', theme: 'green' },
  // Organizasyon
  { id: 34, cat: 'Org.', title: 'İletişim Adım', desc: 'En kısa iletişim yolunu kullanarak Başkana ulaştı.', icon: 'fa-comments', theme: 'blue' },
  { id: 35, cat: 'Org.', title: 'Kulak Kabartan', desc: 'Ortamdaki tüm gözlem fırsatlarını değerlendirdi.', icon: 'fa-ear-listen', theme: 'blue' },
  // Yaşlılara Yardım
  { id: 36, cat: 'Gönüllü', title: 'İyi Huylu', desc: 'Yaşlılarla iletişimde en az bir kez en doğru üslubu kullandı.', icon: 'fa-hand-holding-heart', theme: 'purple' },
  { id: 37, cat: 'Gönüllü', title: 'Dokunaklı', desc: 'Mektup görevinde duygularını en doğru şekilde ifade etti.', icon: 'fa-envelope-open-text', theme: 'purple' },
  // Su İsrafı
  { id: 38, cat: 'Su', title: 'Bir Kişi Bir Kişidir', desc: "10'dan fazla insanla görüşerek farkındalık yarattı.", icon: 'fa-users', theme: 'blue' },
  { id: 39, cat: 'Su', title: 'Rengarenk Sorular', desc: 'Görüştüğü 10 kişiyi de fire vermeden ikna etti.', icon: 'fa-clipboard-check', theme: 'gold' },
  // Okul
  { id: 40, cat: 'Okul', title: 'Uzlaştırıcı', desc: 'Arkadaşların arasını düzelterek hikayeyi mutlu sonla bitirdi.', icon: 'fa-handshake', theme: 'green' },
  { id: 41, cat: 'Okul', title: 'Ben Hallederim', desc: 'Etrafla konuşmak yerine olaya doğrudan müdahale etti.', icon: 'fa-gavel', theme: 'green' },
  // Balıkçılık
  { id: 42, cat: 'Balık', title: 'Blup Blup Blup!', desc: 'Her bölgede en az bir balık tutmayı başardı.', icon: 'fa-fish', theme: 'blue' },
  { id: 43, cat: 'Balık', title: 'Az Yakar', desc: 'Yakıtı bitirmeden verimli bir rotayla limana vardı.', icon: 'fa-gas-pump', theme: 'blue' },
  // Ticaret
  { id: 44, cat: 'Ticaret', title: 'Piyasa Kokusu', desc: 'Satılabilecek doğru ürünü tek seferde buldu.', icon: 'fa-magnifying-glass-chart', theme: 'green' },
  { id: 45, cat: 'Ticaret', title: "Haber Trader'ı", desc: 'Pazar araştırması için tüm gazete sayfalarını inceledi.', icon: 'fa-newspaper', theme: 'green' },
  // Lunapark
  { id: 46, cat: 'Lunapark', title: 'Kurnaz Tilki', desc: '5 farklı ürünü kârlı fiyattan satmayı başardı.', icon: 'fa-money-bill-trend-up', theme: 'purple' },
  { id: 47, cat: 'Lunapark', title: 'Manipülatör', desc: 'Açgözlülüğü yüksek bir müşteriyi pazarlıkla ikna etti.', icon: 'fa-user-tie', theme: 'purple' },
  // Lojistik
  { id: 48, cat: 'Lojistik', title: 'Yolların Hakimi', desc: 'Tır ile şehir, kasaba ve köy bölgelerinin hepsini gezdi.', icon: 'fa-road', theme: 'gold' },
  { id: 49, cat: 'Lojistik', title: 'Al-Sür-Sat', desc: 'Bölümü tam puanla bitirerek ticaret yeteneğini kanıtladı.', icon: 'fa-truck-fast', theme: 'gold' },
  // Dondurma
  { id: 50, cat: 'Dondurma', title: 'Hızlı Servis', desc: 'Hiçbir müşteriyi kaçırmadan herkese dondurma yetiştirdi.', icon: 'fa-ice-cream', theme: 'purple' },
  { id: 51, cat: 'Dondurma', title: 'Soğuk Savaş', desc: 'Her gün için en doğru satış stratejisini belirledi.', icon: 'fa-snowflake', theme: 'purple' },
  // Kütüphane
  { id: 52, cat: 'Kütüphane', title: 'Bildiğinden �?aşmaz', desc: 'Kitapları dizerken her seferinde sabit bir sıralama mantığı kullandı.', icon: 'fa-arrow-down-a-z', theme: 'blue' },
  { id: 53, cat: 'Kütüphane', title: 'Elimle Koymuş Gibi', desc: 'Kütüphanedeki herkese aradığı kitabı teslim etti.', icon: 'fa-book-open', theme: 'blue' },
  // Forklift
  { id: 54, cat: 'Forklift', title: 'Gelişiyorum', desc: 'Bir önceki bölüme göre performansını artırarak ilerledi.', icon: 'fa-chart-line', theme: 'gold' },
  { id: 55, cat: 'Forklift', title: 'Her �?eyin Yeri', desc: 'Hiç can kaybetmeden tüm yükleri yerleştirdi.', icon: 'fa-pallet', theme: 'gold' },
  // Manav
  { id: 56, cat: 'Manav', title: 'İyi ki Bakmışım', desc: 'Bir kutuyu hiç yanlış ayıklama yapmadan tamamladı.', icon: 'fa-magnifying-glass', theme: 'green' },
  { id: 57, cat: 'Manav', title: 'İçim Rahat', desc: 'Tüm oyunu hatasız bir kalite kontrolle bitirdi.', icon: 'fa-basket-shopping', theme: 'red' },
  // Giyim
  { id: 58, cat: 'Giyim', title: 'Yerli Yerinde', desc: 'Reyon düzenlerken hiç hata yapmadı.', icon: 'fa-shirt', theme: 'purple' },
  { id: 59, cat: 'Giyim', title: 'Özveri', desc: 'İstenenden daha fazla kontrol yaparak titiz davrandı.', icon: 'fa-clipboard-check', theme: 'purple' },
  // Hastane
  { id: 60, cat: 'Hastane', title: 'GEÇEMEZSİN!', desc: 'Girmemesi gereken kişileri tespit edip dışarı yönlendirdi.', icon: 'fa-ban', theme: 'red' },
  { id: 61, cat: 'Hastane', title: 'Kayıp Belgeler', desc: 'Belgesi eksik veya hatalı olan herkesi uyardı.', icon: 'fa-id-card', theme: 'red' }
]

export const userUnlockedIDs = [1, 2, 4, 9, 13, 22, 28, 32, 40, 50, 57]
const ITEMS_PER_PAGE = 6

function PanelBasarilar() {
  const [currentPage, setCurrentPage] = useState(1)

  const earnedList = useMemo(
    () => allAchievements.filter((a) => userUnlockedIDs.includes(a.id)).reverse(),
    []
  )

  const earnedCount = userUnlockedIDs.length
  const totalCount = allAchievements.length
  const progressPct = Math.round((earnedCount / totalCount) * 100)

  const lastAch = allAchievements.find((a) => a.id === userUnlockedIDs[userUnlockedIDs.length - 1])
  const getAchievementSource = (achievement) => achievement.cat

  const visibleItems = earnedList.slice(0, currentPage * ITEMS_PER_PAGE)
  const hasMore = currentPage * ITEMS_PER_PAGE < earnedList.length

  return (
    <div>
      <SectionHeader
        title="Başarı Vitrini"
        description="Kazanılan madalyalar, rozetler ve koleksiyon parçaları."
        containerClassName="bs-page-header"
        titleClassName="bs-page-title"
        descClassName="bs-page-desc"
      />

      <div className="inventory-stat">
        <div className="inv-top">
          <span>Envanter Doluluk Oranı</span>
          <span className="inv-count">{earnedCount} / {totalCount}</span>
        </div>
        <div className="inv-track">
          <div className="inv-fill" style={{ width: `${progressPct}%` }}></div>
        </div>
      </div>

      {earnedCount === 0 && (
        <div className="empty-state">
          <i className="fa-solid fa-trophy"></i>
          <h3>Henüz Kazanılmış Rozet Yok</h3>
          <p>Oyunları oynamaya başla, başarımları topla!</p>
        </div>
      )}

      {lastAch && (
        <div className={`hero-card ${lastAch.theme}`}>
          <div className="hero-icon-box">
            <i className={`fa-solid ${lastAch.icon}`}></i>
          </div>
          <div className="hc-content">
            <span className="hc-tag">SON KAZANILAN</span>
            <h2>{lastAch.title}</h2>
            <p>{lastAch.desc}</p>
          </div>
        </div>
      )}

      {earnedCount > 0 && (
        <>
          <h3 className="section-title">
            <i className="fa-solid fa-layer-group"></i> Yetenek Rozetleri
          </h3>
          <div className="badges-grid">
            {visibleItems.map((ach) => {
              const source = getAchievementSource(ach)
              return (
                <div className={`badge-card ${ach.theme}`} key={ach.id}>
                  <div className="badge-ribbon"></div>
                  <div className="badge-medal">
                    <i className={`fa-solid ${ach.icon}`}></i>
                  </div>
                  <h4 className="bc-title">{ach.title}</h4>
                  <p className="bc-desc">{ach.desc}</p>
                  <div className="bc-meta">
                    <p className="bc-source">
                      <strong>Kaynak:</strong> {source}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          {hasMore && (
            <button
              className="load-more-btn"
              type="button"
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Daha Fazla Göster <i className="fa-solid fa-chevron-down"></i>
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default PanelBasarilar



