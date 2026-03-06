export function initPanelInteractions() {
  const cleanups = []

  const initTabs = () => {
    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'))
    const tabContents = Array.from(document.querySelectorAll('.tab-content'))
    if (tabButtons.length === 0 || tabContents.length === 0) return

    const getTabId = (btn) => {
      const data = btn.getAttribute('data-tab')
      if (data) return data
      const onclick = btn.getAttribute('onclick') || ''
      const match = onclick.match(/'([^']+)'/) || onclick.match(/\"([^\"]+)\"/)
      return match ? match[1] : null
    }

    const activateTab = (btn, tabId) => {
      tabContents.forEach((tab) => {
        tab.style.display = 'none'
        tab.classList.remove('active')
      })
      tabButtons.forEach((b) => b.classList.remove('active'))

      const target = tabId ? document.getElementById(tabId) : null
      if (target) {
        target.style.display = 'block'
        target.classList.add('active')
      }
      btn.classList.add('active')
    }

    const activeBtn = tabButtons.find((b) => b.classList.contains('active')) || tabButtons[0]
    if (activeBtn) {
      const tabId = getTabId(activeBtn)
      activateTab(activeBtn, tabId)
    }

    tabButtons.forEach((btn) => {
      const handler = (e) => {
        e.preventDefault()
        const tabId = getTabId(btn)
        if (tabId) {
          activateTab(btn, tabId)
        }
      }
      btn.addEventListener('click', handler)
      cleanups.push(() => btn.removeEventListener('click', handler))
    })
  }

  const initShowMoreBadges = () => {
    const container = document.getElementById('badgeContainer')
    const btn = document.getElementById('showMoreBtn')
    if (!container || !btn) return

    const cards = Array.from(container.getElementsByClassName('badge-card'))
    const limit = 5
    let expanded = false

    const updateView = () => {
      cards.forEach((card, index) => {
        if (!expanded && index >= limit) {
          card.classList.add('hidden')
        } else {
          card.classList.remove('hidden')
        }
      })

      const remaining = cards.length - limit
      if (remaining > 0) {
        if (expanded) {
          btn.innerHTML = `Daha Az Göster <i class="fa-solid fa-chevron-up"></i>`
        } else {
          btn.innerHTML = `Daha Fazla Göster (${remaining}) <i class="fa-solid fa-chevron-down"></i>`
        }
        btn.style.display = 'inline-flex'
      } else {
        btn.style.display = 'none'
      }
    }

    updateView()

    const handler = (e) => {
      e.preventDefault()
      expanded = !expanded
      updateView()
    }

    btn.addEventListener('click', handler)
    cleanups.push(() => btn.removeEventListener('click', handler))
  }

  const initAccordions = () => {
    const headers = Array.from(document.querySelectorAll('.accordion-header'))
    if (headers.length === 0) return

    headers.forEach((btn) => {
      const handler = () => {
        btn.classList.toggle('active')
        const content = btn.nextElementSibling
        if (!content) return
        if (content.style.maxHeight) {
          content.style.maxHeight = null
          content.classList.remove('open')
        } else {
          content.classList.add('open')
          content.style.maxHeight = `${content.scrollHeight}px`
        }
      }
      btn.addEventListener('click', handler)
      cleanups.push(() => btn.removeEventListener('click', handler))
    })
  }

  initTabs()
  initShowMoreBadges()
  initAccordions()

  return () => {
    cleanups.forEach((fn) => fn())
  }
}
