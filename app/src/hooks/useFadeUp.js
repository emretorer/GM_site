import { useEffect, useRef } from 'react'

/**
 * Custom hook for fade-up scroll animation using IntersectionObserver
 * @param {Object} options - IntersectionObserver options
 * @returns {React.RefObject} - Ref to attach to container element
 */
function useFadeUp(options = { threshold: 0.1 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, options)

    const fadeElements = container.querySelectorAll('.fade-up')
    fadeElements.forEach(el => observer.observe(el))

    return () => {
      fadeElements.forEach(el => observer.unobserve(el))
    }
  }, [options])

  return containerRef
}

export default useFadeUp
