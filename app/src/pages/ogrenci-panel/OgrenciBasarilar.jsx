import { useState, useMemo } from 'react'
import SectionHeader from '../../components/panel/SectionHeader.jsx'
import { allAchievements, userUnlockedIDs } from '../panel/PanelBasarilar.jsx'
import '../../styles/panel-pages/ogrenci-basarilar.css'

const ITEMS_PER_PAGE = 6

function OgrenciBasarilar() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCat, setSelectedCat] = useState('Tümü')

  const earnedList = useMemo(
    () => allAchievements.filter((a) => userUnlockedIDs.includes(a.id)).reverse(),
    []
  )

  const categories = useMemo(() => {
    const cats = ['Tümü', ...new Set(earnedList.map((a) => a.cat))]
    return cats
  }, [earnedList])

  const filteredList = useMemo(() => {
    if (selectedCat === 'Tümü') return earnedList
    return earnedList.filter((a) => a.cat === selectedCat)
  }, [earnedList, selectedCat])

  const earnedCount = userUnlockedIDs.length
  const totalCount = allAchievements.length
  const progressPct = Math.round((earnedCount / totalCount) * 100)

  const lastAch = allAchievements.find((a) => a.id === userUnlockedIDs[userUnlockedIDs.length - 1])

  const visibleItems = filteredList.slice(0, currentPage * ITEMS_PER_PAGE)
  const hasMore = currentPage * ITEMS_PER_PAGE < filteredList.length

  return (
    <div>
      <SectionHeader
        title="Başarılarım"
        description="Oyunlarda kazandığın tüm rozetler ve madalyalar burada!"
        containerClassName="obs-page-header"
        titleClassName="obs-page-title"
        descClassName="obs-page-desc"
      />

      {/* İlerleme Özeti */}
      <div className="obs-progress-summary">
        <div className="obs-ps-left">
          <div className="obs-ps-circle">
            <svg viewBox="0 0 36 36" className="obs-circular-chart">
              <path
                className="obs-circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="obs-circle-fill"
                strokeDasharray={`${progressPct}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="obs-ps-percent">%{progressPct}</span>
          </div>
          <div className="obs-ps-info">
            <h3>{earnedCount} / {totalCount} Başarı</h3>
            <p>Tüm başarıları toplamak için oyunları oynamaya devam et!</p>
          </div>
        </div>
      </div>

      {/* Son Kazanılan */}
      {lastAch && (
        <div className={`obs-hero-card ${lastAch.theme}`}>
          <div className="obs-hero-glow"></div>
          <div className="obs-hero-icon">
            <i className={`fa-solid ${lastAch.icon}`}></i>
          </div>
          <div className="obs-hero-content">
            <span className="obs-hero-tag">
              <i className="fa-solid fa-sparkles"></i> SON KAZANILAN
            </span>
            <h2>{lastAch.title}</h2>
            <p>{lastAch.desc}</p>
          </div>
        </div>
      )}

      {/* Kategori Filtreleme */}
      {earnedCount > 0 && (
        <div className="obs-cat-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`obs-cat-btn ${selectedCat === cat ? 'active' : ''}`}
              onClick={() => { setSelectedCat(cat); setCurrentPage(1) }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Boş Durum */}
      {earnedCount === 0 && (
        <div className="obs-empty-state">
          <i className="fa-solid fa-trophy"></i>
          <h3>Henüz Rozet Kazanmadın</h3>
          <p>Oyunları oynayarak başarıları toplamaya başla!</p>
        </div>
      )}

      {/* Rozet Grid */}
      {filteredList.length > 0 && (
        <>
          <div className="obs-badges-grid">
            {visibleItems.map((ach) => (
              <div className={`obs-badge-card ${ach.theme}`} key={ach.id}>
                <div className="obs-badge-shine"></div>
                <div className="obs-badge-medal">
                  <i className={`fa-solid ${ach.icon}`}></i>
                </div>
                <h4 className="obs-bc-title">{ach.title}</h4>
                <p className="obs-bc-desc">{ach.desc}</p>
                <div className="obs-bc-footer">
                  <span className="obs-bc-cat">
                    <i className="fa-solid fa-gamepad"></i> {ach.cat}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              className="obs-load-more"
              type="button"
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Daha Fazla Göster <i className="fa-solid fa-chevron-down"></i>
            </button>
          )}
        </>
      )}

      {filteredList.length === 0 && earnedCount > 0 && (
        <div className="obs-empty-state">
          <i className="fa-solid fa-filter"></i>
          <h3>Bu kategoride rozet yok</h3>
          <p>Başka bir kategori seçmeyi dene.</p>
        </div>
      )}
    </div>
  )
}

export default OgrenciBasarilar
