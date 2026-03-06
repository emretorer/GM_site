const DEFAULT_EFFECT_COPY = {
  dynamicSlogan: 'Gorunmeyen Sen',
  readMoreLabel: 'Daha Fazla Oku',
  readLessLabel: 'Daha Az Goster',
  initialLogs: [
    { text: '> System_Init...', status: 'OK', type: 'success' },
    { text: '> Data_Packet_A12', status: 'Analiz...', type: 'process' },
  ],
  logMessages: [
    { text: 'Noral ag katmanlari taraniyor...', status: 'OK', type: 'success' },
    { text: 'Kullanici verisi sifrelendi', status: 'SECURE', type: 'success' },
    { text: 'Karar agaci olusturuluyor...', status: '%45', type: 'process' },
    { text: 'RIASEC skoru hesaplaniyor...', status: 'WAIT', type: 'process' },
    { text: 'Anomali tespiti', status: 'CLEAN', type: 'success' },
    { text: 'Bilissel harita guncellendi', status: 'DONE', type: 'success' },
  ],
}

function createLogLine({ text, status, type }) {
  const line = document.createElement('div')
  line.className = 'log-item'

  const statusColor = type === 'success' ? '#10B981' : '#F59E0B'

  line.innerHTML = `
    <span>${text}</span>
    <span style="color:${statusColor}">${status}</span>
  `

  return line
}

export function initMarketingIndexEffects(effectCopy = {}) {
  const copy = {
    ...DEFAULT_EFFECT_COPY,
    ...effectCopy,
    initialLogs: effectCopy.initialLogs ?? DEFAULT_EFFECT_COPY.initialLogs,
    logMessages: effectCopy.logMessages ?? DEFAULT_EFFECT_COPY.logMessages,
  }

  const cleanups = []

  // 1) Typewriter effect
  const textElement = document.getElementById('dynamic-slogan')
  if (textElement) {
    const text = copy.dynamicSlogan
    let charIndex = 0
    let isDeleting = false
    let timeoutId = null

    const typeEffect = () => {
      const currentText = text.substring(0, charIndex)
      textElement.textContent = currentText

      let typeSpeed = isDeleting ? 100 : 150
      if (!isDeleting && charIndex < text.length) {
        charIndex += 1
      } else if (isDeleting && charIndex > 0) {
        charIndex -= 1
      } else {
        isDeleting = !isDeleting
        typeSpeed = isDeleting ? 2000 : 500
      }
      timeoutId = window.setTimeout(typeEffect, typeSpeed)
    }

    typeEffect()
    cleanups.push(() => {
      if (timeoutId) window.clearTimeout(timeoutId)
    })
  }

  // 2) Hero slideshow
  const slides = Array.from(document.querySelectorAll('.slide'))
  if (slides.length > 0) {
    let currentSlide = 0
    slides[0].classList.add('active')
    const intervalId = window.setInterval(() => {
      slides[currentSlide].classList.remove('active')
      currentSlide = (currentSlide + 1) % slides.length
      slides[currentSlide].classList.add('active')
    }, 3500)
    cleanups.push(() => window.clearInterval(intervalId))
  }

  // 3) Fade-up observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1 }
  )

  const fadeUps = Array.from(document.querySelectorAll('.fade-up'))
  fadeUps.forEach((el) => observer.observe(el))
  cleanups.push(() => observer.disconnect())

  // 3.1) Mobile comparison slider
  const splitContainer = document.querySelector('.split-container')
  const splitPrevBtn = document.querySelector('.split-mobile-prev')
  const splitNextBtn = document.querySelector('.split-mobile-next')
  if (splitContainer && splitPrevBtn && splitNextBtn) {
    const modes = ['mobile-traditional', 'mobile-genius']
    let activeIndex = splitContainer.classList.contains('mobile-genius') ? 1 : 0

    const renderMode = () => {
      modes.forEach((mode) => splitContainer.classList.remove(mode))
      splitContainer.classList.add(modes[activeIndex])
    }

    const onPrev = () => {
      activeIndex = activeIndex === 0 ? modes.length - 1 : activeIndex - 1
      renderMode()
    }

    const onNext = () => {
      activeIndex = (activeIndex + 1) % modes.length
      renderMode()
    }

    renderMode()

    splitPrevBtn.addEventListener('click', onPrev)
    splitNextBtn.addEventListener('click', onNext)
    cleanups.push(() => splitPrevBtn.removeEventListener('click', onPrev))
    cleanups.push(() => splitNextBtn.removeEventListener('click', onNext))
  }

  // 4) Simulations marquee
  const track = document.getElementById('track')
  const prevBtn = document.getElementById('prevBtn')
  const nextBtn = document.getElementById('nextBtn')

  if (track && prevBtn && nextBtn) {
    const cardWidth = 320
    const totalCards = 8
    const singleSetWidth = cardWidth * totalCards

    track.scrollLeft = singleSetWidth

    let isHovered = false
    const autoScrollSpeed = 1
    let rafId = null

    const onScroll = () => {
      if (track.scrollLeft >= singleSetWidth * 2) {
        track.scrollLeft -= singleSetWidth
      } else if (track.scrollLeft <= 0) {
        track.scrollLeft += singleSetWidth
      }
    }

    const onNext = () => {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' })
    }

    const onPrev = () => {
      track.scrollBy({ left: -cardWidth, behavior: 'smooth' })
    }

    const autoScroll = () => {
      if (!isHovered) {
        track.scrollLeft += autoScrollSpeed
      }
      rafId = window.requestAnimationFrame(autoScroll)
    }

    const enter = () => {
      isHovered = true
    }

    const leave = () => {
      isHovered = false
    }

    track.addEventListener('scroll', onScroll)
    track.addEventListener('mouseenter', enter)
    track.addEventListener('mouseleave', leave)
    prevBtn.addEventListener('mouseenter', enter)
    nextBtn.addEventListener('mouseenter', enter)
    prevBtn.addEventListener('mouseleave', leave)
    nextBtn.addEventListener('mouseleave', leave)
    prevBtn.addEventListener('click', onPrev)
    nextBtn.addEventListener('click', onNext)

    autoScroll()

    cleanups.push(() => {
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('mouseenter', enter)
      track.removeEventListener('mouseleave', leave)
      prevBtn.removeEventListener('mouseenter', enter)
      nextBtn.removeEventListener('mouseenter', enter)
      prevBtn.removeEventListener('mouseleave', leave)
      nextBtn.removeEventListener('mouseleave', leave)
      prevBtn.removeEventListener('click', onPrev)
      nextBtn.removeEventListener('click', onNext)
      if (rafId) window.cancelAnimationFrame(rafId)
    })
  }

  // 5) Read more
  const toggleBtn = document.getElementById('toggleBtn')
  const hiddenContent = document.getElementById('hiddenContent')
  if (toggleBtn && hiddenContent) {
    const renderToggleLabel = () => {
      const isExpanded = hiddenContent.classList.contains('show')
      const label = isExpanded ? copy.readLessLabel : copy.readMoreLabel
      const icon = isExpanded ? 'up' : 'down'
      toggleBtn.innerHTML = `${label} <i class="fas fa-chevron-${icon}"></i>`
    }

    renderToggleLabel()

    const handler = () => {
      hiddenContent.classList.toggle('show')
      renderToggleLabel()
    }

    toggleBtn.addEventListener('click', handler)
    cleanups.push(() => toggleBtn.removeEventListener('click', handler))
  }

  // 6) Chart animations
  const charts = Array.from(document.querySelectorAll('.chart-slide'))
  if (charts.length > 0) {
    let chartIndex = 0
    const intervalId = window.setInterval(() => {
      charts[chartIndex].classList.remove('active')
      chartIndex = (chartIndex + 1) % charts.length
      charts[chartIndex].classList.add('active')

      if (chartIndex === 2) {
        const donut = document.getElementById('dynamicDonut')
        if (donut) {
          donut.style.background = 'conic-gradient(#A855F7 0% 0%, #3B82F6 0% 0%, rgba(255,255,255,0.1) 0% 100%)'
          window.setTimeout(() => {
            donut.style.background = 'conic-gradient(#A855F7 0% 65%, #3B82F6 65% 94%, rgba(255,255,255,0.1) 94% 100%)'
          }, 100)
        }
      }
    }, 2000)

    cleanups.push(() => window.clearInterval(intervalId))
  }

  // 7) Live log system
  const logContainer = document.getElementById('logContainer')
  if (logContainer) {
    logContainer.innerHTML = ''
    copy.initialLogs.forEach((log) => {
      logContainer.append(createLogLine(log))
    })

    const intervalId = window.setInterval(() => {
      const randomMsg = copy.logMessages[Math.floor(Math.random() * copy.logMessages.length)]
      const logLine = createLogLine({ ...randomMsg, text: `> ${randomMsg.text}` })

      logContainer.prepend(logLine)

      if (logContainer.children.length > 5) {
        logContainer.lastElementChild.remove()
      }
    }, 1500)

    cleanups.push(() => window.clearInterval(intervalId))
  }

  return () => {
    cleanups.forEach((fn) => fn())
  }
}
