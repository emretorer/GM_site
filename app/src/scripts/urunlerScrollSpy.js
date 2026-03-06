export function initUrunlerScrollSpy() {
  const sections = Array.from(document.querySelectorAll('section'))
  const navDots = Array.from(document.querySelectorAll('.scroll-dot'))

  if (sections.length === 0 || navDots.length === 0) return () => {}

  const handler = () => {
    let current = ''
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id') || ''
      }
    })

    navDots.forEach((dot) => {
      dot.classList.remove('active')
      const href = dot.getAttribute('href') || ''
      if (current && href.includes(current)) {
        dot.classList.add('active')
      }
    })
  }

  window.addEventListener('scroll', handler)
  handler()

  return () => window.removeEventListener('scroll', handler)
}
