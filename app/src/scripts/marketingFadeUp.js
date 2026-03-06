export function initFadeUpEffects() {
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

  const elements = Array.from(document.querySelectorAll('.fade-up'))
  elements.forEach((el) => observer.observe(el))

  return () => observer.disconnect()
}
