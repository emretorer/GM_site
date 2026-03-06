import { useMarketingLanguage } from '../../../context/MarketingLanguageContext.jsx'

const TEAM_COPY = {
  tr: {
    label: 'EKİBİMİZ',
    titleLead: 'Arkasındaki',
    titleAccent: 'İnsanlar',
    description: 'Farklı disiplinlerden gelen tutkulu profesyonellerden oluşan ekibimizle tanışın.',
    members: [
      {
        name: 'Ahmet Yılmaz',
        role: 'Kurucu & CEO',
        bio: 'Vizyon sahibi lider. Yapay zeka ve eğitim teknolojileri alanında 10+ yıl deneyim.',
        socials: { linkedin: '#', twitter: '#' },
      },
      {
        name: 'Elif Kaya',
        role: 'Baş Psikolog',
        bio: 'Psikometrik modelleme ve davranışsal analiz uzmanı. RIASEC Holland modeli araştırmacısı.',
        socials: { linkedin: '#', twitter: '#' },
      },
      {
        name: 'Mehmet Demir',
        role: 'CTO',
        bio: 'Yazılım mimarisi ve yapay zeka sistemleri konusunda uzman. Ölçeklenebilir platform geliştirici.',
        socials: { linkedin: '#', github: '#' },
      },
      {
        name: 'Zeynep Arslan',
        role: 'Ürün Tasarımcısı',
        bio: 'Kullanıcı deneyimi ve arayüz tasarımı uzmanı. Eğitim odaklı UX araştırmacısı.',
        socials: { linkedin: '#', twitter: '#' },
      },
    ],
  },
  en: {
    label: 'OUR TEAM',
    titleLead: 'The',
    titleAccent: 'People Behind It',
    description: 'Meet our team of passionate professionals from different disciplines.',
    members: [
      {
        name: 'Ahmet Yilmaz',
        role: 'Founder & CEO',
        bio: 'A visionary leader with 10+ years of experience in AI and education technology.',
        socials: { linkedin: '#', twitter: '#' },
      },
      {
        name: 'Elif Kaya',
        role: 'Lead Psychologist',
        bio: 'Expert in psychometric modeling and behavioral analytics. Researcher of the RIASEC Holland model.',
        socials: { linkedin: '#', twitter: '#' },
      },
      {
        name: 'Mehmet Demir',
        role: 'CTO',
        bio: 'Specialist in software architecture and AI systems. Builder of scalable platforms.',
        socials: { linkedin: '#', github: '#' },
      },
      {
        name: 'Zeynep Arslan',
        role: 'Product Designer',
        bio: 'Specialist in user experience and interface design. UX researcher focused on education.',
        socials: { linkedin: '#', twitter: '#' },
      },
    ],
  },
}

const SOCIAL_ICONS = {
  linkedin: 'fab fa-linkedin-in',
  twitter: 'fab fa-x-twitter',
  github: 'fab fa-github',
}

function TeamCard({ name, role, bio, socials, delay }) {
  return (
    <div className="team-card fade-up" style={{ transitionDelay: `${delay}s` }}>
      <div className="team-avatar">
        <i className="fas fa-user"></i>
      </div>
      <h3 className="team-name">{name}</h3>
      <div className="team-role">{role}</div>
      <p className="team-bio">{bio}</p>
      <div className="team-socials">
        {Object.entries(socials).map(([platform, url]) => (
          <a
            key={platform}
            href={url}
            className="team-social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} - ${platform}`}
          >
            <i className={SOCIAL_ICONS[platform]}></i>
          </a>
        ))}
      </div>
    </div>
  )
}

function TeamSection() {
  const { language } = useMarketingLanguage()
  const copy = TEAM_COPY[language]

  return (
    <section className="team-section">
      <div className="container">
        <div className="team-header">
          <span className="section-label fade-up">{copy.label}</span>
          <h2 className="fade-up" style={{ transitionDelay: '0.1s' }}>
            {copy.titleLead} <span className="text-gradient">{copy.titleAccent}</span>
          </h2>
          <p className="fade-up" style={{ transitionDelay: '0.15s' }}>
            {copy.description}
          </p>
        </div>

        <div className="team-grid">
          {copy.members.map((member, index) => (
            <TeamCard key={member.name} {...member} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamSection
