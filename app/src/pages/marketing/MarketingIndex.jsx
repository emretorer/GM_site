import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MarketingNavbar from '../../components/marketing/MarketingNavbar'
import { useMarketingLanguage } from '../../context/MarketingLanguageContext.jsx'
import useFadeUp from '../../hooks/useFadeUp'
import '../../styles/marketing/common.css'
import '../../styles/marketing/index.css'
import Logomuz from '../../assets/Logomuz.webp'

const HOME_COPY = {
  tr: {
    typewriterText: 'Görünmeyen Sen',
    initialLogs: [
      { text: '> System_Init...', status: 'OK', type: 'success' },
      { text: '> Data_Packet_A12', status: 'Analiz...', type: 'process' },
    ],
    logOptions: [
      { text: 'Nöral ağ katmanları taranıyor...', status: 'OK', type: 'success' },
      { text: 'Kullanıcı verisi şifrelendi', status: 'SECURE', type: 'success' },
      { text: 'Karar ağacı oluşturuluyor...', status: '%45', type: 'process' },
      { text: 'RIASEC skoru hesaplanıyor...', status: 'WAIT', type: 'process' },
      { text: 'Anomali tespiti', status: 'CLEAN', type: 'success' },
      { text: 'Bilişsel harita güncellendi', status: 'DONE', type: 'success' },
    ],
    hero: {
      headlinePrefix: 'Görünen Oyun,',
      descriptionLines: [
        'Yargılanmadan, test edilmeden, sadece oynayarak...',
        'Kısa görevler, mini oyunlar ve hikâye odaklı senaryolarla',
        'ilerler, eğlenirken kendini daha iyi tanırsın.',
      ],
      safeData: 'Güvenli Veri',
      analysis: 'Nöro-Metrik Analiz',
      watchIntro: 'Tanıtımı İzle',
      simulationMeta: 'Simülasyon',
      install: 'YÜKLE & OYNA',
      insightTitle: 'Davranış',
      insightBefore: 'Kriz yönetimi becerilerinde ',
      insightStrong: 'yüksek potansiyel',
      insightAfter: '.',
      suggestionTitle: 'Kariyer',
      suggestionBefore: 'Veri setleri ',
      suggestionStrong: 'Stratejik Planlama',
      suggestionAfter: ' ile uyumlu.',
      imageAltPrefix: 'Görsel',
    },
    collab: {
      badge: 'Destekçilerimiz',
      titlePrefix: '',
      titleConnector: 've',
      titleSuffix: 'iş birliğiyle',
      titleLine2: 'geleceğin yetenek analiz platformunu inşa ediyoruz.',
      description: 'Türkiye\'nin en prestijli bilimsel araştırma kurumu TÜBİTAK\'ın proje desteği ve Antalya Teknokent\'in AR-GE altyapısıyla geliştirilen Genius Methods, bilimsel temelli oyunlaştırma teknolojisiyle dünyada bir ilke imza atıyor.',
    },
    comparison: {
      title: 'Standart Testlerin Ötesi.',
      descriptionBefore: 'İnsan ',
      descriptionHighlight: 'potansiyeli',
      descriptionAfter: ' çoktan seçmeli şıklara sığmaz.',
      descriptionLine2: 'Sıkıcı formlar yerine, yaşayan bir deneyim sunuyoruz.',
      traditionalBadge: 'Geleneksel Yöntem',
      traditionalTitle: 'Verimsiz Döngü',
      traditionalDescription: 'Kağıt yığınları, optik formlar ve ezbere dayalı sınavlar... Gerçek potansiyeliniz bu prosedürler arasında kaybolup gidiyor.',
      geniusBadge: 'Genius Yaklaşımı',
      geniusTitle: 'Oyunlaştırma & Simülasyon',
      geniusDescription: 'Doğal davranış akışı, 3D simülasyonlar ve nöro-metrik veri analizi. Potansiyel, baskı altında değil, oyunun akışında keşfedilir.',
    },
    process: {
      subTitle: 'Dijital İzler, Gerçek Eğilimler.',
      mainTitle: 'Nasıl Çalışır?',
      steps: [
        { title: '01. Oyuncu', description: 'Açık dünya görevlerinde kararlar alır.' },
        { title: '02. Keşif', description: 'Oyun içi tercihler yeteneklere dönüşür.' },
        { title: '03. Yapay Zeka', description: 'Psikometrik modellerle analiz edilir.' },
        { title: '04. Sonuç', description: 'Yetenek haritaları oluşturulur.' },
      ],
      intro: 'Oyun temelli görevlerle öğrencilerin güçlü yönlerini ve kariyer eğilimlerini keşfeden; yenilikçi bir keşif platformu.',
      hiddenStrong: 'yetenekleri keşfeden bir deneyim',
      hiddenAfter: ' olarak kurgulanır. Oyuncular, gerçek hayata benzer açık dünya görevleri içinde kararlar alırken; bu kararlar dinamik senaryolarla tekrar edilebilir ve ölçülebilir hale gelir. Yapay zekâ ve psikometrik modeller, oyun içi tercihleri bireyin yetkinlik profiline dönüştürür.',
      result: 'Bu sayede GeniusMethods, tek seferlik sonuçlar yerine; kariyer ve beceri haritalarını zaman içinde güncelleyebilen, gelişimi izleyen ve geleceğe dönük potansiyeli görünür kılan yaşayan bir ürün sunar.',
      readMore: 'Daha Fazla Oku',
      readLess: 'Daha Az Göster',
    },
    simulation: {
      label: 'Oyun İçi Görevler',
      titleTop: 'Oynarken',
      titleHighlight: 'Bilinçlenmek.',
      description: 'Her görevde farklı bir eğlence, farklı bir deneyim.',
      phoneAriaLabel: 'Simülasyon ekranı. Telefonun alt bölgesinden basılı tutup yukarı sürüklerseniz sonraki, aşağı sürüklerseniz önceki ekrana geçer.',
      imageAlt: 'Simülasyon',
    },
    guide: {
      label: 'SİSTEM MİMARİSİ',
      title: 'Gelecek Rehberiniz.',
      quote: '"TÜBİTAK proje desteği alan, dünyadaki ilk ve tek oyunlaştırma tabanlı yetenek analiz platformu."',
      description: 'TÜBİTAK proje desteğiyle geliştirilen bu oyunlaştırma tabanlı sistem, çocukların oyun içinde güçlü yönlerini keşfetmesine yardımcı olur. Veliler için de anlaşılır özetler ve gelişim ipuçları sunar.',
      steps: [
        { title: 'Oyun Akışı', description: 'Kısa görevler ve mini oyunlarla ilerler.' },
        { title: 'Kendini Keşfetme', description: 'Çocuklar oyun içinde doğal şekilde yönlerini dener.' },
        { title: 'Veli Özeti', description: 'Basit rapor ve önerilerle aileye rehberlik eder.' },
      ],
      processorTitle: 'Davranışsal İşlemci',
      dataFlow: 'Veri Akışı: 4.2MB/s',
      status: 'SİSTEM AKTİF',
      match: 'EŞLEŞME',
      radarLabels: ['Liderlik', 'Analitik', 'Sosyal'],
      reactionTime: 'TEPKİ SÜRESİ: 0.12ms',
    },
    science: {
      title: 'Arkasında Bilim Var. Şans Yok.',
      description: 'Global kabul görmüş psikometrik modellerin, modern teknoloji ve etik değerlerle birleşimi.',
      items: [
        { title: 'Holland Kodları (RIASEC)', description: 'Kariyer yöneliminde dünyada altın standart kabul edilen envanter.' },
        { title: 'Kanıt Temelli Tasarım', description: 'Oyun mekanikleri rastgele değil, spesifik becerileri ölçmek için kurgulandı.' },
        { title: 'Etik Yapay Zeka', description: 'Etiketleme veya önyargı yok. Sadece saf performans analizi var.' },
        { title: 'Veri Kontrolü Sizde', description: 'Verileriniz 3. taraflarla asla paylaşılmaz. Silme hakkı tamamen size aittir.' },
      ],
    },
    footer: {
      badge: 'DÜNYA\'DA BİR İLK',
      line1: 'Dünya\'nın ilk ve tek',
      highlight: 'oyunlaştırma tabanlı',
      line3: 'yetenek analiz platformunu deneyimleyin.',
      play: 'Ücretsiz Hemen Oyna',
      description: 'Oyunun gücünü bilimin ışığıyla birleştirerek, gerçek potansiyeli keşfediyoruz.',
      exploreTitle: 'Keşfet',
      exploreLinks: ['Genius Nedir?', 'Teknoloji', 'Ürünler', 'Raporlar'],
      corporateTitle: 'Kurumsal',
      corporateLinks: ['Hakkımızda', 'Gizlilik (KVKK)', 'Kullanım Şartları', 'İletişim'],
      socialTitle: 'Sosyal Medya',
      socialLinks: ['LinkedIn', 'Instagram', 'E-Posta'],
      rights: 'Tüm hakları saklıdır.',
    },
  },
  en: {
    typewriterText: 'The Hidden You',
    initialLogs: [
      { text: '> System_Init...', status: 'OK', type: 'success' },
      { text: '> Data_Packet_A12', status: 'Analyzing...', type: 'process' },
    ],
    logOptions: [
      { text: 'Neural network layers are scanning...', status: 'OK', type: 'success' },
      { text: 'User data encrypted', status: 'SECURE', type: 'success' },
      { text: 'Building decision tree...', status: '%45', type: 'process' },
      { text: 'Calculating RIASEC score...', status: 'WAIT', type: 'process' },
      { text: 'Anomaly check complete', status: 'CLEAN', type: 'success' },
      { text: 'Cognitive map updated', status: 'DONE', type: 'success' },
    ],
    hero: {
      headlinePrefix: 'The Visible Game,',
      descriptionLines: [
        'No judgment, no testing, just play...',
        'Move through short missions, mini games, and story-driven scenarios',
        'while getting to know yourself better.',
      ],
      safeData: 'Secure Data',
      analysis: 'Neuro-Metric Analysis',
      watchIntro: 'Watch Intro',
      simulationMeta: 'Simulation',
      install: 'INSTALL & PLAY',
      insightTitle: 'Behavior',
      insightBefore: 'High potential in ',
      insightStrong: 'crisis management',
      insightAfter: '.',
      suggestionTitle: 'Career',
      suggestionBefore: 'Data sets align with ',
      suggestionStrong: 'Strategic Planning',
      suggestionAfter: '.',
      imageAltPrefix: 'Visual',
    },
    collab: {
      badge: 'Backed By',
      titlePrefix: 'Built with support from',
      titleConnector: 'and',
      titleSuffix: '',
      titleLine2: 'we are building the talent analytics platform of the future.',
      description: 'Genius Methods is developed with TÜBİTAK project support and the R&D infrastructure of Antalya Teknokent, turning scientific gamification into a world-first talent analytics platform.',
    },
    comparison: {
      title: 'Beyond Standard Tests.',
      descriptionBefore: 'Human ',
      descriptionHighlight: 'potential',
      descriptionAfter: ' cannot fit into multiple-choice boxes.',
      descriptionLine2: 'Instead of tedious forms, we deliver a living experience.',
      traditionalBadge: 'Traditional Method',
      traditionalTitle: 'An Inefficient Cycle',
      traditionalDescription: 'Stacks of paper, optical forms, and memorization-based exams... Your real potential gets lost inside those procedures.',
      geniusBadge: 'The Genius Approach',
      geniusTitle: 'Gamification & Simulation',
      geniusDescription: 'A natural flow of behavior, 3D simulations, and neuro-metric analytics. Potential is discovered in play, not under pressure.',
    },
    process: {
      subTitle: 'Digital Traces, Real Tendencies.',
      mainTitle: 'How Does It Work?',
      steps: [
        { title: '01. Player', description: 'Makes decisions inside open-world missions.' },
        { title: '02. Discovery', description: 'In-game choices transform into talent signals.' },
        { title: '03. AI', description: 'They are analyzed with psychometric models.' },
        { title: '04. Result', description: 'Talent maps are generated.' },
      ],
      intro: 'An innovative discovery platform that uncovers students\' strengths and career tendencies through game-based tasks.',
      hiddenStrong: 'it becomes an experience that reveals talent',
      hiddenAfter: '. While players make decisions inside open-world tasks inspired by real life, those decisions become repeatable and measurable through dynamic scenarios. AI and psychometric models transform in-game choices into an evolving competency profile.',
      result: 'This allows GeniusMethods to deliver a living product that updates career and skill maps over time, tracks development, and makes long-term potential visible.',
      readMore: 'Read More',
      readLess: 'Show Less',
    },
    simulation: {
      label: 'In-Game Missions',
      titleTop: 'Play',
      titleHighlight: 'with Awareness.',
      description: 'Every mission brings a different kind of fun and a different kind of signal.',
      phoneAriaLabel: 'Simulation screen. Press and hold the lower area of the phone, then drag up for the next screen or drag down for the previous screen.',
      imageAlt: 'Simulation',
    },
    guide: {
      label: 'SYSTEM ARCHITECTURE',
      title: 'Your Future Guide.',
      quote: '"The world\'s first and only gamified talent analytics platform backed by a TÜBİTAK project grant."',
      description: 'This gamified system, built with TÜBİTAK support, helps children discover their strengths in play and gives parents clear summaries with practical development guidance.',
      steps: [
        { title: 'Gameplay', description: 'Progresses through short missions and mini games.' },
        { title: 'Self-Discovery', description: 'Children naturally try different directions while playing.' },
        { title: 'Parent Summary', description: 'Simple reports and suggestions guide the family.' },
      ],
      processorTitle: 'Behavioral Processor',
      dataFlow: 'Data Flow: 4.2MB/s',
      status: 'SYSTEM ACTIVE',
      match: 'MATCH',
      radarLabels: ['Leadership', 'Analytical', 'Social'],
      reactionTime: 'REACTION TIME: 0.12ms',
    },
    science: {
      title: 'Built on Science. Not Luck.',
      description: 'A blend of globally trusted psychometric models, modern technology, and ethical design.',
      items: [
        { title: 'Holland Codes (RIASEC)', description: 'A globally recognized gold-standard inventory for career orientation.' },
        { title: 'Evidence-Based Design', description: 'Game mechanics are designed to measure specific skills, never at random.' },
        { title: 'Ethical AI', description: 'No labeling and no bias. Only clean performance analysis.' },
        { title: 'You Control the Data', description: 'Your data is never shared with third parties. Deletion rights stay entirely with you.' },
      ],
    },
    footer: {
      badge: 'A WORLD FIRST',
      line1: 'Experience the world\'s first and only',
      highlight: 'gamification-based',
      line3: 'talent analytics platform.',
      play: 'Play Free Now',
      description: 'We combine the power of play with the clarity of science to reveal real potential.',
      exploreTitle: 'Explore',
      exploreLinks: ['What is Genius?', 'Technology', 'Products', 'Reports'],
      corporateTitle: 'Corporate',
      corporateLinks: ['About Us', 'Privacy (KVKK)', 'Terms of Use', 'Contact'],
      socialTitle: 'Social',
      socialLinks: ['LinkedIn', 'Instagram', 'E-Mail'],
      rights: 'All rights reserved.',
    },
  },
}

function createInitialLogs(copy) {
  return copy.initialLogs.map((log) => ({ ...log }))
}

const HOME_EFFECT_COPY_SAFE = {
  tr: {
    typewriterText: 'G\u00f6r\u00fcnmeyen Sen',
    initialLogs: [
      { text: '> System_Init...', status: 'OK', type: 'success' },
      { text: '> Data_Packet_A12', status: 'Analiz...', type: 'process' },
    ],
    logOptions: [
      { text: 'N\u00f6ral a\u011f katmanlar\u0131 taran\u0131yor...', status: 'OK', type: 'success' },
      { text: 'Kullan\u0131c\u0131 verisi \u015fifrelendi', status: 'SECURE', type: 'success' },
      { text: 'Karar a\u011fac\u0131 olu\u015fturuluyor...', status: '%45', type: 'process' },
      { text: 'RIASEC skoru hesaplan\u0131yor...', status: 'WAIT', type: 'process' },
      { text: 'Anomali tespiti', status: 'CLEAN', type: 'success' },
      { text: 'Bili\u015fsel harita g\u00fcncellendi', status: 'DONE', type: 'success' },
    ],
  },
  en: {
    typewriterText: 'The Hidden You',
    initialLogs: [
      { text: '> System_Init...', status: 'OK', type: 'success' },
      { text: '> Data_Packet_A12', status: 'Analyzing...', type: 'process' },
    ],
    logOptions: [
      { text: 'Neural network layers are scanning...', status: 'OK', type: 'success' },
      { text: 'User data encrypted', status: 'SECURE', type: 'success' },
      { text: 'Building decision tree...', status: '%45', type: 'process' },
      { text: 'Calculating RIASEC score...', status: 'WAIT', type: 'process' },
      { text: 'Anomaly check complete', status: 'CLEAN', type: 'success' },
      { text: 'Cognitive map updated', status: 'DONE', type: 'success' },
    ],
  },
}

function createSafeInitialLogs(language) {
  return HOME_EFFECT_COPY_SAFE[language].initialLogs.map((log) => ({ ...log }))
}

function MarketingIndex() {
  const containerRef = useFadeUp()
  const { language } = useMarketingLanguage()
  const isEnglish = language === 'en'
  const effectCopy = HOME_EFFECT_COPY_SAFE[language]
  const [dynamicSlogan, setDynamicSlogan] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentChart, setCurrentChart] = useState(0)
  const [showHiddenContent, setShowHiddenContent] = useState(false)
  const [simSlideIndex, setSimSlideIndex] = useState(0)
  const [isPhoneActive, setIsPhoneActive] = useState(false)
  const [hasPhoneInteracted, setHasPhoneInteracted] = useState(false)
  const [logMessages, setLogMessages] = useState(() => createSafeInitialLogs(language))
  const badgeRef = useRef(null)
  const tabletRef = useRef(null)
  const phoneDragStartRef = useRef(null)
  const phoneScreenRef = useRef(null)
  const phoneStateRef = useRef({ isPhoneActive: false, hasPhoneInteracted: false, simSlideIndex: 0 })

  const slides = [
    'assets/Image Sequence_002_0000.webp',
    'assets/Image Sequence_003_0000.webp',
    'assets/Image Sequence_004_0000.webp',
    'assets/Image Sequence_005_0000.webp',
    'assets/Image Sequence_006_0000.webp',
    'assets/Image Sequence_007_0000.webp'
  ]

  const simCards = [
    'assets/geniusmethodsdeck-2.webp',
    'assets/GeniusMethodsDeck-3.webp',
    'assets/GeniusMethodsDeck-4.jpg',
    'assets/GeniusMethodsDeck-5.webp',
    'assets/GeniusMethodsDeck-6.jpg',
    'assets/GeniusMethodsDeck-7.jpg',
    'assets/GeniusMethodsDeck.jpg',
    'assets/GeniusMethodsDeck-3.jpg'
  ]

  const logOptions = effectCopy.logOptions

  // Typewriter effect
  useEffect(() => {
    const badge = badgeRef.current
    if (!badge) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          badge.classList.add('blackhole-enter')
          observer.unobserve(badge)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(badge)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const text = effectCopy.typewriterText
    let charIndex = 0
    let isDeleting = false
    let timeoutId

    setDynamicSlogan('')

    const typeEffect = () => {
      const currentText = text.substring(0, charIndex)
      setDynamicSlogan(currentText)

      let typeSpeed = isDeleting ? 100 : 150

      if (!isDeleting && charIndex < text.length) {
        charIndex++
      } else if (isDeleting && charIndex > 0) {
        charIndex--
      } else {
        isDeleting = !isDeleting
        typeSpeed = isDeleting ? 2000 : 500
      }

      timeoutId = setTimeout(typeEffect, typeSpeed)
    }

    typeEffect()
    return () => clearTimeout(timeoutId)
  }, [effectCopy.typewriterText])

  // Hero slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [slides.length])

  // Chart slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChart(prev => (prev + 1) % 6)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Log messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = logOptions[Math.floor(Math.random() * logOptions.length)]
      setLogMessages(prev => {
        const newLogs = [{ text: `> ${randomMsg.text}`, status: randomMsg.status, type: randomMsg.type }, ...prev]
        return newLogs.slice(0, 5)
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [logOptions])

  useEffect(() => {
    setLogMessages(createSafeInitialLogs(language))
  }, [language])

  const moveSimSlide = (direction) => {
    const total = simCards.length
    setSimSlideIndex((prev) => (prev + direction + total) % total)
  }

  const handleWatchIntroClick = (event) => {
    event.preventDefault()
    const tabletEl = tabletRef.current
    if (!tabletEl) return

    const rect = tabletEl.getBoundingClientRect()
    const targetTop = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2 - 170

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth'
    })
  }

  // Keep refs in sync with state for use in native event listeners
  useEffect(() => {
    phoneStateRef.current.simSlideIndex = simSlideIndex
  }, [simSlideIndex])

  const activatePhone = () => {
    setIsPhoneActive(true)
    setHasPhoneInteracted(true)
    phoneStateRef.current.isPhoneActive = true
    phoneStateRef.current.hasPhoneInteracted = true
  }

  const deactivatePhone = () => {
    setIsPhoneActive(false)
    phoneStateRef.current.isPhoneActive = false
  }

  const beginPhoneDrag = (clientX, clientY, containerEl) => {
    if (!containerEl) return
    const rect = containerEl.getBoundingClientRect()
    const localY = clientY - rect.top
    phoneDragStartRef.current = {
      x: clientX,
      y: clientY,
      isBottomStart: localY > rect.height * 0.35
    }
  }

  const getSwipeDirection = (start, endX, endY) => {
    if (!start || !start.isBottomStart) return 0
    const deltaY = start.y - endY
    const deltaX = Math.abs(endX - start.x)
    if (deltaX > 56) return 0
    if (Math.abs(deltaY) < 40) return 0
    if (Math.abs(deltaY) < deltaX * 1.4) return 0

    if (deltaY > 0) return 1
    return -1
  }

  const handlePhoneMouseDown = (event) => {
    activatePhone()
    beginPhoneDrag(event.clientX, event.clientY, event.currentTarget)
  }

  const handlePhoneMouseMove = (event) => {
    if (!phoneDragStartRef.current) return
    if (event.buttons !== 1) return
    const direction = getSwipeDirection(phoneDragStartRef.current, event.clientX, event.clientY)
    if (direction !== 0) {
      moveSimSlide(direction)
      phoneDragStartRef.current = null
      deactivatePhone()
      return
    }
    event.preventDefault()
  }

  const handlePhoneMouseUp = (event) => {
    const direction = getSwipeDirection(phoneDragStartRef.current, event.clientX, event.clientY)
    if (direction !== 0) {
      moveSimSlide(direction)
    }
    phoneDragStartRef.current = null
    deactivatePhone()
  }

  const handlePhoneClick = () => {
    activatePhone()
  }

  const handlePhoneMouseLeave = (event) => {
    if (phoneDragStartRef.current) {
      const direction = getSwipeDirection(phoneDragStartRef.current, event.clientX, event.clientY)
      if (direction !== 0) {
        moveSimSlide(direction)
      }
      phoneDragStartRef.current = null
    }
    deactivatePhone()
  }

  const handlePhoneKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      activatePhone()
      moveSimSlide(1)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      activatePhone()
      moveSimSlide(-1)
    }
  }

  // Register touch events natively with { passive: false } to allow preventDefault
  useEffect(() => {
    const el = phoneScreenRef.current
    if (!el) return

    const onTouchStart = (event) => {
      activatePhone()
      const point = event.touches[0]
      if (!point) return
      beginPhoneDrag(point.clientX, point.clientY, el)
    }

    const onTouchMove = (event) => {
      if (!phoneDragStartRef.current) return
      const point = event.touches[0]
      if (!point) return
      const direction = getSwipeDirection(phoneDragStartRef.current, point.clientX, point.clientY)
      if (direction !== 0) {
        moveSimSlide(direction)
        phoneDragStartRef.current = null
        deactivatePhone()
      }
      event.preventDefault()
    }

    const onTouchEnd = (event) => {
      if (!phoneDragStartRef.current) {
        deactivatePhone()
        return
      }
      const start = phoneDragStartRef.current
      const endY = event.changedTouches[0]?.clientY
      const endX = event.changedTouches[0]?.clientX
      phoneDragStartRef.current = null
      if (typeof endY !== 'number') {
        deactivatePhone()
        return
      }
      const direction = getSwipeDirection(start, typeof endX === 'number' ? endX : start.x, endY)
      if (direction !== 0) {
        moveSimSlide(direction)
      }
      deactivatePhone()
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [])


  return (
    <div className="marketing-page marketing-index" ref={containerRef}>
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>

        <div className="container grid-2">
          <div className="fade-up">
            <h1 className="hero-headline">
              {isEnglish ? 'The Visible Game,' : 'G\u00f6r\u00fcnen Oyun,'}<br />
              <span className="neon-typewriter">{dynamicSlogan}</span>
              <span className="cursor">|</span>
            </h1>

            <p>
              {isEnglish ? 'No judgment, no testing, just play...' : 'Yarg\u0131lanmadan, test edilmeden, sadece oynayarak...'}
              <br />
              {isEnglish ? 'Move through short missions, mini games, and story-driven scenarios' : 'K\u0131sa g\u00f6revler, mini oyunlar ve hik\u00e2ye odakl\u0131 senaryolarla'}
              <br />
              {isEnglish ? 'while getting to know yourself better.' : 'ilerler, e\u011flenirken kendini daha iyi tan\u0131rs\u0131n.'}
            </p>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
              <span><i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i> {isEnglish ? 'Secure Data' : 'G\u00fcvenli Veri'}</span>
              <span><i className="fas fa-brain" style={{ color: 'var(--primary)' }}></i> {isEnglish ? 'Neuro-Metric Analysis' : 'N\u00f6ro-Metrik Analiz'}</span>
              <Link to="#" className="btn btn-outline" style={{ marginLeft: '0.5rem' }} onClick={handleWatchIntroClick}>
                <i className="fas fa-play-circle"></i> {isEnglish ? 'Watch Intro' : 'Tan\u0131t\u0131m\u0131 \u0130zle'}
              </Link>
            </div>
          </div>

          <div className="ai-visual-container fade-up">
            <div className="slideshow-wrapper">
              {slides.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  className={`slide ${idx === currentSlide ? 'active' : ''}`}
                  alt={isEnglish ? `Visual ${idx + 1}` : `G\u00f6rsel ${idx + 1}`}
                />
              ))}

              <div className="slide-overlay">
                <div className="game-action-box">
                  <div className="game-meta">
                    <h4>Genius Methods</h4>
                    <span><i className="fas fa-star" style={{ color: '#F59E0B' }}></i> 4.9  {isEnglish ? 'Simulation' : 'Sim\u00fclasyon'}</span>
                  </div>
                  <Link to="/urunler" className="hero-install-btn">
                    <i className="fas fa-download"></i> {isEnglish ? 'INSTALL & PLAY' : 'Y\u00dcKLE & OYNA'}
                  </Link>
                </div>
              </div>
            </div>

            <div className="ai-popup popup-insight">
              <div className="popup-header">
                <i className="fas fa-lightbulb" style={{ color: 'var(--neon-blue)' }}></i> {isEnglish ? 'Behavior' : 'Davran\u0131\u015f'}
              </div>
              <div className="popup-text">
                {isEnglish ? 'High potential in ' : 'Kriz y\u00f6netimi becerilerinde '}<strong>{isEnglish ? 'crisis management' : 'y\u00fcksek potansiyel'}</strong>.
              </div>
            </div>

            <div className="ai-popup popup-suggestion">
              <div className="popup-header">
                <i className="fas fa-robot" style={{ color: 'var(--neon-purple)' }}></i> {isEnglish ? 'Career' : 'Kariyer'}
              </div>
              <div className="popup-text">
                {isEnglish ? 'Data sets align with ' : 'Veri setleri '}<strong>Stratejik Planlama</strong>{isEnglish ? '.' : ' ile uyumlu.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="collab-section">
        <div className="container">
          <div className="collab-header fade-up">
            <div className="collab-badge">
              <i className="fas fa-award"></i> {isEnglish ? 'Backed By' : 'Destek\u00e7ilerimiz'}
            </div>
            <h2>
              {isEnglish ? 'Built with support from ' : ''}
              <span className="collab-highlight">TÜBİTAK</span> {isEnglish ? 'and' : 've'}{' '}
              <span className="collab-highlight">Antalya Teknokent</span>{isEnglish ? '' : ' iş birliğiyle'}
              <br />
              {isEnglish ? 'we are building the talent analytics platform of the future.' : 'gelece\u011fin yetenek analiz platformunu in\u015fa ediyoruz.'}
            </h2>
            <p>
              {isEnglish
                ? 'Genius Methods is developed with TÜBİTAK project support and the R&D infrastructure of Antalya Teknokent, turning scientific gamification into a world-first talent analytics platform.'
                : 'T\u00fcrkiye\'nin en prestijli bilimsel ara\u015ft\u0131rma kurumu TÜBİTAK\'\u0131n proje deste\u011fi ve Antalya Teknokent\'in AR-GE altyap\u0131s\u0131yla geli\u015ftirilen Genius Methods, bilimsel temelli oyunla\u015ft\u0131rma teknolojisiyle d\u00fcnyada bir ilke imza at\u0131yor.'}
            </p>
          </div>

          {/* iPad Video Mockup */}
          <div className="ipad-video-wrapper fade-up" ref={tabletRef}>
            <div className="ipad-frame">
              <div className="ipad-camera"></div>
              <div className="ipad-screen">
                <video
                  className="ipad-video"
                  src="/video/tanitim-video.mp4"
                  controls
                  preload="metadata"
                  playsInline
                  poster="assets/Image Sequence_005_0000.webp"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Infinite Logo Banner */}
        <div className="logo-banner-wrapper">
          <div className="logo-banner-track">
            <div className="logo-banner-slide">
              <img src="assets/logo-1.webp" alt="Genius Methods" className="banner-logo" />
              <img src="assets/tubitak-logo.webp" alt="TÜBİTAK" className="banner-logo banner-logo-tubitak" />
              <img src="assets/teknokent-logo.webp" alt="Antalya Teknokent" className="banner-logo banner-logo-teknokent" />
              <img src="assets/logo-1.webp" alt="Genius Methods" className="banner-logo" />
              <img src="assets/tubitak-logo.webp" alt="TÜBİTAK" className="banner-logo banner-logo-tubitak" />
              <img src="assets/teknokent-logo.webp" alt="Antalya Teknokent" className="banner-logo banner-logo-teknokent" />
              <img src="assets/logo-1.webp" alt="Genius Methods" className="banner-logo" />
              <img src="assets/tubitak-logo.webp" alt="TÜBİTAK" className="banner-logo banner-logo-tubitak" />
              <img src="assets/teknokent-logo.webp" alt="Antalya Teknokent" className="banner-logo banner-logo-teknokent" />
              <img src="assets/logo-1.webp" alt="Genius Methods" className="banner-logo" />
              <img src="assets/tubitak-logo.webp" alt="TÜBİTAK" className="banner-logo banner-logo-tubitak" />
              <img src="assets/teknokent-logo.webp" alt="Antalya Teknokent" className="banner-logo banner-logo-teknokent" />
            </div>
            <div className="logo-banner-slide" aria-hidden="true">
              <img src="assets/logo-1.webp" alt="Genius Methods" className="banner-logo" />
              <img src="assets/tubitak-logo.webp" alt="TÜBİTAK" className="banner-logo banner-logo-tubitak" />
              <img src="assets/teknokent-logo.webp" alt="Antalya Teknokent" className="banner-logo banner-logo-teknokent" />
              <img src="assets/logo-1.webp" alt="Genius Methods" className="banner-logo" />
              <img src="assets/tubitak-logo.webp" alt="TÜBİTAK" className="banner-logo banner-logo-tubitak" />
              <img src="assets/teknokent-logo.webp" alt="Antalya Teknokent" className="banner-logo banner-logo-teknokent" />
              <img src="assets/logo-1.webp" alt="Genius Methods" className="banner-logo" />
              <img src="assets/tubitak-logo.webp" alt="TÜBİTAK" className="banner-logo banner-logo-tubitak" />
              <img src="assets/teknokent-logo.webp" alt="Antalya Teknokent" className="banner-logo banner-logo-teknokent" />
              <img src="assets/logo-1.webp" alt="Genius Methods" className="banner-logo" />
              <img src="assets/tubitak-logo.webp" alt="TÜBİTAK" className="banner-logo banner-logo-tubitak" />
              <img src="assets/teknokent-logo.webp" alt="Antalya Teknokent" className="banner-logo banner-logo-teknokent" />
            </div>
          </div>
        </div>
      </section>

      {/* Separator: Hero to Comparison */}
      <div className="section-separator"></div>

      {/* Comparison Section */}
      <section className="comparison-section">
        <div className="container">
          <div className="comp-header fade-up">
            <h2>{isEnglish ? 'Beyond Standard Tests.' : 'Standart Testlerin \u00d6tesi.'}</h2>
            <p>
              {isEnglish ? 'Human ' : '\u0130nsan '}<span className="highlight-green-pen">{isEnglish ? 'potential' : 'potansiyeli'}</span>{isEnglish ? ' cannot fit into multiple-choice boxes.' : ' \u00e7oktan se\u00e7meli \u015f\u0131klara s\u0131\u011fmaz.'}<br />
              {isEnglish ? 'Instead of tedious forms, we deliver a living experience.' : 'S\u0131k\u0131c\u0131 formlar yerine, ya\u015fayan bir deneyim sunuyoruz.'}
            </p>
          </div>

          <div className="split-container fade-up">
            <div className="split-panel panel-traditional">
              <div className="survey-animation-wrapper">
                <div className="cycle-paper paper-survey cycle-1">
                  <div className="line-dec short"></div>
                  <div className="line-dec" style={{ marginBottom: '20px' }}></div>
                  <div className="cb-row"><div className="box"></div><div className="line-dec short" style={{ margin: 0 }}></div></div>
                  <div className="cb-row"><div className="box"></div><div className="line-dec short" style={{ margin: 0 }}></div></div>
                  <div className="cb-row"><div className="box"></div><div className="line-dec short" style={{ margin: 0 }}></div></div>
                  <div className="cb-row"><div className="box"></div><div className="line-dec short" style={{ margin: 0 }}></div></div>
                </div>

                <div className="cycle-paper paper-optic cycle-2">
                  <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                    <div className="line-dec short" style={{ display: 'inline-block', width: '40px', height: '40px', border: '1px solid #ddd' }}></div>
                  </div>
                  <div className="opt-row"><div className="bubble"></div><div className="bubble filled"></div><div className="bubble"></div><div className="bubble"></div></div>
                  <div className="opt-row"><div className="bubble"></div><div className="bubble"></div><div className="bubble filled"></div><div className="bubble"></div></div>
                  <div className="opt-row"><div className="bubble filled"></div><div className="bubble"></div><div className="bubble"></div><div className="bubble"></div></div>
                  <div className="opt-row"><div className="bubble"></div><div className="bubble"></div><div className="bubble"></div><div className="bubble filled"></div></div>
                  <div className="opt-row"><div className="bubble"></div><div className="bubble filled"></div><div className="bubble"></div><div className="bubble"></div></div>
                </div>

                <div className="cycle-paper paper-essay cycle-3">
                  <div className="line-dec short" style={{ marginBottom: '25px' }}></div>
                  <div className="essay-line"></div>
                  <div className="essay-line"></div>
                  <div className="essay-line"></div>
                  <div className="essay-line"></div>
                  <div className="essay-line"></div>
                </div>
              </div>

              <div className="panel-content">
                <span className="panel-badge badge-old"><i className="fas fa-history"></i> {isEnglish ? 'Traditional Method' : 'Geleneksel Y\u00f6ntem'}</span>
                <h3 style={{ color: '#1E293B', fontSize: '1.2rem' }}>{isEnglish ? 'An Inefficient Cycle' : 'Verimsiz D\u00f6ng\u00fc'}</h3>
                <p style={{ color: '#64748B' }}>
                  {isEnglish
                    ? 'Stacks of paper, optical forms, and memorization-based exams... Your real potential gets lost inside those procedures.'
                    : 'Ka\u011f\u0131t y\u0131\u011f\u0131nlar\u0131, optik formlar ve ezbere dayal\u0131 s\u0131navlar... Ger\u00e7ek potansiyeliniz bu prosed\u00fcrler aras\u0131nda kaybolup gidiyor.'}
                </p>
              </div>
            </div>

            <div className="split-panel panel-genius">
              <video
                className="video-bg"
                src="/video/tanitim-video.mp4"
                autoPlay
                loop
                muted
                controls
                playsInline
                preload="metadata"
                poster="assets/Image Sequence_005_0000.webp"
              />
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>

              <div className="panel-content">
                <span className="panel-badge badge-new"><i className="fas fa-check-circle"></i> {isEnglish ? 'The Genius Approach' : 'Genius Yakla\u015f\u0131m\u0131'}</span>
                <h3 style={{ color: 'white', fontSize: '1.2rem' }}>{isEnglish ? 'Gamification & Simulation' : 'Oyunla\u015ft\u0131rma & Sim\u00fclasyon'}</h3>
                <p style={{ color: '#CBD5E1' }}>
                  {isEnglish
                    ? 'A natural flow of behavior, 3D simulations, and neuro-metric analytics. Potential is discovered in play, not under pressure.'
                    : 'Do\u011fal davran\u0131\u015f ak\u0131\u015f\u0131, 3D sim\u00fclasyonlar ve n\u00f6ro-metrik veri analizi. Potansiyel, bask\u0131 alt\u0131nda de\u011fil, oyunun ak\u0131\u015f\u0131nda ke\u015ffedilir.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section" id="nasil-calisir">
        <div className="container">
          <div className="section-header-wrapper">
            <h2 className="sub-title">{isEnglish ? 'Digital Traces, Real Tendencies.' : 'Dijital \u0130zler, Ger\u00e7ek E\u011filimler.'}</h2>
            <h2 className="main-title">{isEnglish ? 'How Does It Work?' : 'Nas\u0131l \u00c7al\u0131\u015f\u0131r?'}</h2>
          </div>

          <div className="process-container fade-up">
            <div className="process-line"></div>

            <div className="process-step step-1">
              <div className="step-icon-box"><i className="fas fa-user-astronaut"></i></div>
              <h3 className="step-title">{isEnglish ? '01. Player' : '01. Oyuncu'}</h3>
              <p className="step-desc">{isEnglish ? 'Makes decisions inside open-world missions.' : 'A\u00e7\u0131k d\u00fcnya g\u00f6revlerinde kararlar al\u0131r.'}</p>
            </div>

            <div className="process-step step-2">
              <div className="step-icon-box"><i className="fas fa-fingerprint"></i></div>
              <h3 className="step-title">{isEnglish ? '02. Discovery' : '02. Ke\u015fif'}</h3>
              <p className="step-desc">{isEnglish ? 'In-game choices transform into talent signals.' : 'Oyun i\u00e7i tercihler yeteneklere d\u00f6n\u00fc\u015f\u00fcr.'}</p>
            </div>

            <div className="process-step step-3">
              <div className="step-icon-box"><i className="fas fa-network-wired"></i></div>
              <h3 className="step-title">{isEnglish ? '03. AI' : '03. Yapay Zeka'}</h3>
              <p className="step-desc">{isEnglish ? 'They are analyzed with psychometric models.' : 'Psikometrik modellerle analiz edilir.'}</p>
            </div>

            <div className="process-step step-4">
              <div className="step-icon-box"><i className="fas fa-stopwatch"></i></div>
              <h3 className="step-title">{isEnglish ? '04. Result' : '04. Sonu\u00e7'}</h3>
              <p className="step-desc">{isEnglish ? 'Talent maps are generated.' : 'Yetenek haritalar\u0131 olu\u015fturulur.'}</p>
            </div>
          </div>

          <div className="expandable-wrapper fade-up">
            <div className="metin-sinirlayici">
              <p className="giris-paragrafi">
                {isEnglish
                  ? 'An innovative discovery platform that uncovers students\' strengths and career tendencies through game-based tasks.'
                  : 'Oyun temelli g\u00f6revlerle \u00f6\u011frencilerin g\u00fc\u00e7l\u00fc y\u00f6nlerini ve kariyer e\u011filimlerini ke\u015ffeden; yenilik\u00e7i bir ke\u015fif platformu.'}
              </p>

              <div className={`hidden-content ${showHiddenContent ? 'show' : ''}`}>
                <p className="vurgulu-paragraf">
                  <span className="marka-rengi">GeniusMethods</span>
                  {isEnglish
                    ? ' turns play into more than entertainment; it becomes an experience that reveals talent. While players make decisions inside open-world tasks inspired by real life, those decisions become repeatable and measurable through dynamic scenarios. AI and psychometric models transform in-game choices into an evolving competency profile.'
                    : '\'ta oyun, sadece bir e\u011flence unsuru de\u011fil; yetenekleri ke\u015ffeden bir deneyim olarak kurgulan\u0131r. Oyuncular, ger\u00e7ek hayata benzer a\u00e7\u0131k d\u00fcnya g\u00f6revleri i\u00e7inde kararlar al\u0131rken; bu kararlar dinamik senaryolarla tekrar edilebilir ve \u00f6l\u00e7\u00fclebilir hale gelir. Yapay zek\u00e2 ve psikometrik modeller, oyun i\u00e7i tercihleri bireyin yetkinlik profiline d\u00f6n\u00fc\u015ft\u00fcr\u00fcr.'}
                </p>

                <p className="sonuc-paragrafi">
                  {isEnglish
                    ? 'This allows GeniusMethods to deliver a living product that updates career and skill maps over time, tracks development, and makes long-term potential visible.'
                    : 'Bu sayede GeniusMethods, tek seferlik sonu\u00e7lar yerine; kariyer ve beceri haritalar\u0131n\u0131 zaman i\u00e7inde g\u00fcncelleyebilen, geli\u015fimi izleyen ve gelece\u011fe d\u00f6n\u00fck potansiyeli g\u00f6r\u00fcn\u00fcr k\u0131lan ya\u015fayan bir \u00fcr\u00fcn sunar.'}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button className="read-more-btn" onClick={() => setShowHiddenContent(!showHiddenContent)}>
                {showHiddenContent
                  ? (isEnglish ? 'Show Less' : 'Daha Az G\u00f6ster')
                  : (isEnglish ? 'Read More' : 'Daha Fazla Oku')}
                <i className={`fas fa-chevron-${showHiddenContent ? 'up' : 'down'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Simulations Showcase */}
      <section id="simulasyonlar" className="sim-showcase-section">
        <div className="container">
          <div className="sim-layout fade-up">
            <div className="sim-text-side">
              <span className="sim-label"><i className="fas fa-gamepad"></i> {isEnglish ? 'In-Game Missions' : 'Oyun \u0130\u00e7i G\u00f6revler'}</span>
              <h2 className="sim-title">
                {isEnglish ? 'Play' : 'Oynarken'} <br />
                <span className="sim-title-gradient">{isEnglish ? 'with Awareness.' : 'Bilin\u00e7lenmek.'}</span>
              </h2>
              <p className="sim-desc">
                {isEnglish ? 'Every mission brings a different kind of fun and a different kind of signal.' : 'Her g\u00f6revde farkl\u0131 bir e\u011flence, farkl\u0131 bir deneyim.'}
              </p>
            </div>

            <div className="iphone-wrapper">
              <div className="iphone-frame">
                <div className="iphone-notch"></div>
                <div
                  ref={phoneScreenRef}
                  className={`iphone-screen ${!hasPhoneInteracted ? 'hint-bounce' : ''} ${isPhoneActive ? 'active' : ''}`}
                  onClick={handlePhoneClick}
                  onDragStart={(event) => event.preventDefault()}
                  onMouseDown={handlePhoneMouseDown}
                  onMouseMove={handlePhoneMouseMove}
                  onMouseUp={handlePhoneMouseUp}
                  onMouseLeave={handlePhoneMouseLeave}
                  onKeyDown={handlePhoneKeyDown}
                  tabIndex={0}
                  role="button"
                  aria-label={isEnglish
                    ? 'Simulation screen. Press and hold the lower area of the phone, then drag up for the next screen or drag down for the previous screen.'
                    : 'Sim\u00fclasyon ekran\u0131. Telefonun alt b\u00f6lgesinden bas\u0131l\u0131 tutup yukar\u0131 s\u00fcr\u00fcklerseniz sonraki, a\u015fa\u011f\u0131 s\u00fcr\u00fcklerseniz \u00f6nceki ekrana ge\u00e7er.'}
                >
                  <div
                    className="iphone-scroll-track"
                    style={{ transform: `translateY(-${simSlideIndex * 100}%)` }}
                  >
                    {simCards.map((src, idx) => (
                      <div className="iphone-slide" key={idx}>
                        <img src={src} alt={isEnglish ? 'Simulation' : 'Sim\u00fclasyon'} draggable="false" />
                      </div>
                    ))}
                  </div>
                  {!hasPhoneInteracted ? (
                    <div className="iphone-swipe-finger" aria-hidden="true">
                      <i className="fa-solid fa-hand-point-up"></i>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider: Light to Dark */}
      <div className="section-divider light-to-dark">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" />
        </svg>
      </div>

      {/* Guide Section */}
      <section className="guide-section">
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(79, 70, 229, 0.08) 0%, transparent 40%)', pointerEvents: 'none' }}></div>

        <div className="container grid-2">
          <div className="guide-content fade-up">
            <div style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--neon-purple)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px' }}>
              <i className="fas fa-compass"></i> {isEnglish ? 'SYSTEM ARCHITECTURE' : 'S\u0130STEM M\u0130MAR\u0130S\u0130'}
            </div>

            <h2>{isEnglish ? 'Your Future Guide.' : 'Gelecek Rehberiniz.'}</h2>

            <div className="guide-quote">
              <p>{isEnglish
                ? '"The world\'s first and only gamified talent analytics platform backed by a TÜBİTAK project grant."'
                : '"TÜBİTAK proje desteği alan, dünyadaki ilk ve tek oyunlaştırma tabanlı yetenek analiz platformu."'}</p>
              <div style={{ color: 'white', fontWeight: 600, marginTop: '0.5rem', fontSize: '0.9rem' }}> Genius Methods</div>
            </div>

            <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>
              {isEnglish
                ? 'This gamified system, built with TÜBİTAK support, helps children discover their strengths in play and gives parents clear summaries with practical development guidance.'
                : 'TÜBİTAK proje desteğiyle geliştirilen bu oyunlaştırma tabanlı sistem, çocukların oyun içinde güçlü yönlerini keşfetmesine yardımcı olur. Veliler için de anlaşılır özetler ve gelişim ipuçları sunar.'}
            </p>

            <div className="guide-steps">
              <div className="guide-step-item">
                <div className="gs-icon"><i className="fas fa-search"></i></div>
                <div>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '4px' }}>{isEnglish ? 'Gameplay' : 'Oyun Akışı'}</strong>
                  <span style={{ color: '#64748B', fontSize: '0.9rem' }}>{isEnglish ? 'Progresses through short missions and mini games.' : 'Kısa görevler ve mini oyunlarla ilerler.'}</span>
                </div>
              </div>

              <div className="guide-step-item">
                <div className="gs-icon" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#F472B6' }}><i className="fas fa-brain"></i></div>
                <div>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '4px' }}>{isEnglish ? 'Self-Discovery' : 'Kendini Keşfetme'}</strong>
                  <span style={{ color: '#64748B', fontSize: '0.9rem' }}>{isEnglish ? 'Children naturally try different directions while playing.' : 'Çocuklar oyun içinde doğal şekilde yönlerini dener.'}</span>
                </div>
              </div>

              <div className="guide-step-item">
                <div className="gs-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}><i className="fas fa-project-diagram"></i></div>
                <div>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '4px' }}>{isEnglish ? 'Parent Summary' : 'Veli Özeti'}</strong>
                  <span style={{ color: '#64748B', fontSize: '0.9rem' }}>{isEnglish ? 'Simple reports and suggestions guide the family.' : 'Basit rapor ve önerilerle aileye rehberlik eder.'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-up" style={{ position: 'relative' }}>
            <div className="dashboard-card">
              <div className="dash-header">
                <div className="dash-title">
                  <h4>{isEnglish ? 'Behavioral Processor' : 'Davranışsal İşlemci'}</h4>
                  <span>{isEnglish ? 'Data Flow: 4.2MB/s' : 'Veri Akışı: 4.2MB/s'}</span>
                </div>
                <div className="status-badge">
                  <div className="blink-dot"></div> {isEnglish ? 'SYSTEM ACTIVE' : 'SİSTEM AKTİF'}
                </div>
              </div>

              <div className="chart-viewport">
                <div className={`chart-slide ${currentChart === 0 ? 'active' : ''}`}>
                  <div className="bar-group"><div className="bar-fill b1"></div></div>
                  <div className="bar-group"><div className="bar-fill b2"></div></div>
                  <div className="bar-group"><div className="bar-fill b3"></div></div>
                  <div className="bar-group"><div className="bar-fill b4"></div></div>
                  <div className="bar-group"><div className="bar-fill b5"></div></div>
                </div>

                <div className={`chart-slide ${currentChart === 1 ? 'active' : ''}`}>
                  <svg className="line-chart-svg" viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                    <defs>
                      <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <path className="line-area" d="M0,50 L0,30 L20,35 L40,10 L60,25 L80,5 L100,20 L100,50 Z" fill="url(#gradientArea)" style={{ opacity: 0.4 }} />
                    <path className="line-path" d="M0,30 L20,35 L40,10 L60,25 L80,5 L100,20" fill="none" stroke="#F59E0B" strokeWidth="3" />
                  </svg>
                </div>

                <div className={`chart-slide ${currentChart === 2 ? 'active' : ''}`} style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'conic-gradient(#A855F7 0% 65%, #3B82F6 65% 94%, rgba(255,255,255,0.1) 94% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '70%', height: '70%', background: '#0F172A', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>%94</span>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{isEnglish ? 'MATCH' : 'EŞLEŞME'}</span>
                    </div>
                  </div>
                </div>

                <div className={`chart-slide ${currentChart === 3 ? 'active' : ''}`} style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '180px', height: '180px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(255,255,255,0.1)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                    <div style={{ position: 'absolute', width: '60%', height: '60%', border: '1px dashed rgba(255,255,255,0.2)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(79, 70, 229, 0.5)', border: '2px solid #818CF8', clipPath: 'polygon(50% 10%, 90% 25%, 80% 80%, 50% 95%, 20% 65%, 10% 30%)' }}></div>
                    <span style={{ position: 'absolute', top: '-15px', fontSize: '0.65rem', color: '#94A3B8' }}>{isEnglish ? 'Leadership' : 'Liderlik'}</span>
                    <span style={{ position: 'absolute', right: '-10px', bottom: '20px', fontSize: '0.65rem', color: '#94A3B8' }}>{isEnglish ? 'Analytical' : 'Analitik'}</span>
                    <span style={{ position: 'absolute', left: '-10px', bottom: '20px', fontSize: '0.65rem', color: '#94A3B8' }}>{isEnglish ? 'Social' : 'Sosyal'}</span>
                  </div>
                </div>

                <div className={`chart-slide ${currentChart === 4 ? 'active' : ''}`}>
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%', position: 'absolute', boxShadow: '0 0 10px #10B981', top: '20%', left: '20%' }}></div>
                    <div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%', position: 'absolute', boxShadow: '0 0 10px #10B981', top: '50%', left: '50%' }}></div>
                    <div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%', position: 'absolute', boxShadow: '0 0 10px #10B981', top: '80%', left: '20%' }}></div>
                    <div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%', position: 'absolute', boxShadow: '0 0 10px #10B981', top: '30%', left: '80%' }}></div>
                    <div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%', position: 'absolute', boxShadow: '0 0 10px #10B981', top: '70%', left: '70%' }}></div>
                  </div>
                </div>

                <div className={`chart-slide ${currentChart === 5 ? 'active' : ''}`}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    {[...Array(10)].map((_, i) => (
                      <div key={i} style={{ width: '8px', height: '20px', background: '#F59E0B', borderRadius: '4px', opacity: 0.5, animation: 'waveEqualizer 1s infinite ease-in-out', animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                  <div style={{ position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', fontSize: '0.8rem', color: '#F59E0B' }}>
                    {isEnglish ? 'REACTION TIME: 0.12ms' : 'TEPKİ SÜRESİ: 0.12ms'}
                  </div>
                </div>
              </div>

              <div className="log-console">
                {logMessages.map((log, idx) => (
                  <div className="log-item" key={idx}>
                    <span>{log.text}</span>
                    <span style={{ color: log.type === 'success' ? '#10B981' : '#F59E0B' }}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '250px', height: '250px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.2, zIndex: -1 }}></div>
          </div>
        </div>
      </section>

      {/* Divider: Dark to Light */}
      <div className="section-divider dark-to-light">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C360,0 1080,120 1440,60 L1440,120 L0,120 Z" />
        </svg>
      </div>

      {/* Science Trust Section */}
      <section className="science-trust-section">
        <div className="container">
          <div className="st-header fade-up">
            <h2>{isEnglish ? 'Built on Science. Not Luck.' : 'Arkasında Bilim Var. Şans Yok.'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {isEnglish ? 'A blend of globally trusted psychometric models, modern technology, and ethical design.' : 'Global kabul görmüş psikometrik modellerin, modern teknoloji ve etik değerlerle birleşimi.'}
            </p>
          </div>

          <div className="science-grid fade-up">
            <div className="science-item">
              <div className="science-icon"><i className="fas fa-shapes"></i></div>
              <h3>{isEnglish ? 'Holland Codes (RIASEC)' : 'Holland Kodları (RIASEC)'}</h3>
              <p>{isEnglish ? 'A globally recognized gold-standard inventory for career orientation.' : 'Kariyer yöneliminde dünyada altın standart kabul edilen envanter.'}</p>
            </div>

            <div className="science-item">
              <div className="science-icon"><i className="fas fa-search"></i></div>
              <h3>{isEnglish ? 'Evidence-Based Design' : 'Kanıt Temelli Tasarım'}</h3>
              <p>{isEnglish ? 'Game mechanics are designed to measure specific skills, never at random.' : 'Oyun mekanikleri rastgele değil, spesifik becerileri ölçmek için kurgulandı.'}</p>
            </div>

            <div className="science-item">
              <div className="science-icon"><i className="fas fa-shield-alt"></i></div>
              <h3>{isEnglish ? 'Ethical AI' : 'Etik Yapay Zeka'}</h3>
              <p>{isEnglish ? 'No labeling and no bias. Only clean performance analysis.' : 'Etiketleme veya önyargı yok. Sadece saf performans analizi var.'}</p>
            </div>

            <div className="science-item">
              <div className="science-icon fingerprint-icon"><i className="fas fa-fingerprint"></i></div>
              <h3>{isEnglish ? 'You Control the Data' : 'Veri Kontrolü Sizde'}</h3>
              <p>{isEnglish ? 'Your data is never shared with third parties. Deletion rights stay entirely with you.' : 'Verileriniz 3. taraflarla asla paylaşılmaz. Silme hakkı tamamen size aittir.'}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="light-to-dark-footer-simple" />

      {/* Footer */}
      <footer>
        <div className="cta-section fade-up">
          <div className="final-slogan-wrapper">
            <div className="final-slogan-badge" ref={badgeRef}>
              <i className="fas fa-globe-americas"></i> {isEnglish ? 'A WORLD FIRST' : 'DÜNYA\'DA BİR İLK'}
            </div>
            <h2 className="final-slogan">
              <span className="slogan-line-1">{isEnglish ? 'Experience the world\'s first and only' : 'Dünya\'nın ilk ve tek'}</span>
              <span className="slogan-highlight">{isEnglish ? 'gamification-based' : 'oyunlaştırma tabanlı'}</span>
              <span className="slogan-line-3">{isEnglish ? 'talent analytics platform.' : 'yetenek analiz platformunu deneyimleyin.'}</span>
            </h2>
            <div className="final-slogan-underline"></div>
          </div>

          <Link to="/urunler" className="play-btn">
            <i className="fas fa-play"></i> {isEnglish ? 'Play Free Now' : 'Ücretsiz Hemen Oyna'}
          </Link>
        </div>

        <div className="footer-links-area">
          <div className="footer-grid">
            <div className="footer-col">
              <img src={Logomuz} alt="Genius Methods" />
              <p>
                {isEnglish ? 'We combine the power of play with the clarity of science to reveal real potential.' : 'Oyunun gücünü bilimin ışığıyla birleştirerek, gerçek potansiyeli keşfediyoruz.'}
              </p>
            </div>

            <div className="footer-col">
              <h4>{isEnglish ? 'Explore' : 'Keşfet'}</h4>
              <ul className="f-links">
                <li><Link to="/vizyon-misyon">{isEnglish ? 'What is Genius?' : 'Genius Nedir?'}</Link></li>
                <li><Link to="/biz-kimiz">{isEnglish ? 'Who We Are' : 'Biz Kimiz?'}</Link></li>
                <li><Link to="/urunler">{isEnglish ? 'Products' : 'Ürünler'}</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>{isEnglish ? 'Corporate' : 'Kurumsal'}</h4>
              <ul className="f-links">
                <li><Link to="/vizyon-misyon">{isEnglish ? 'About Us' : 'Hakkımızda'}</Link></li>
                <li><Link to="#">{isEnglish ? 'Privacy (KVKK)' : 'Gizlilik (KVKK)'}</Link></li>
                <li><Link to="#">{isEnglish ? 'Terms of Use' : 'Kullanım Şartları'}</Link></li>
                <li><Link to="#">{isEnglish ? 'Contact' : 'İletişim'}</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>{isEnglish ? 'Social' : 'Sosyal Medya'}</h4>
              <ul className="f-links">
                <li><a href="#"><i className="fab fa-linkedin"></i> LinkedIn</a></li>
                <li><a href="#"><i className="fab fa-instagram"></i> Instagram</a></li>
                <li><a href="#"><i className="fas fa-envelope"></i> {isEnglish ? 'E-Mail' : 'E-Posta'}</a></li>
              </ul>
            </div>
          </div>

          <div className="copyright">
            <span>&copy; 2026 Genius Methods. {isEnglish ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}</span>
            <span><i className="fas fa-map-marker-alt"></i> Antalya Teknokent / AR-GE</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MarketingIndex
