import { useTranslation } from 'react-i18next'

export function FacilitiesSection() {
  const { t } = useTranslation('home')

  const facilities = [
    {
      title: t('facilitiesMainCardTitle'),
      description: t('facilitiesMainCardDesc'),
      image: '/gym-weights.png'
    },
    {
      title: t('facilitiesCard2Title'),
      description: t('facilitiesCard2Desc'),
      image: '/gym-cardio.png'
    },
    {
      title: t('facilitiesCard3Title'),
      description: t('facilitiesCard3Desc'),
      image: '/class-spinning.png'
    },
    {
      title: t('facilitiesCard4Title'),
      description: t('facilitiesCard4Desc'),
      image: '/gym-lounge.png'
    }
  ]

  return (
    <section id="instalaciones" className="home-section facilities-section">
      <div className="section-container">
        <div className="section-header-center">
          <span className="section-tag">
            {t('facilitiesTag')}
          </span>
          <h2 className="section-title">
            {t('facilitiesTitle')}
          </h2>
          <p className="section-description">
            {t('facilitiesDescription')}
          </p>
        </div>

        <div className="facilities-grid-primary">
          <FacilityCard facility={facilities[0]} tall />
          <FacilityCard facility={facilities[1]} className="facility-card-col-2" />
          <FacilityCard facility={facilities[2]} className="facility-card-col-2" />
        </div>

        <div className="facilities-grid-secondary">
          <FacilityCard facility={facilities[3]} />
          <div className="facilities-stats-box">
            <div className="stats-grid">
              <Stat value="+40" label={t('statMachines')} />
              <Stat value="+25" label={t('statClasses')} />
              <Stat value="6-23h" label={t('statHours')} />
            </div>
            <p className="stats-text">
              {t('facilitiesCtaText')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FacilityCard({ facility, className = '', tall = false }) {
  return (
    <article className={`facility-card ${tall ? 'tall' : 'facility-card-aspect'} ${className}`}>
      <img
        src={facility.image}
        alt={facility.title}
        className="facility-card-image"
      />
      <div className="facility-card-overlay" />
      <div className="facility-card-content">
        <h3 className="facility-card-title">{facility.title}</h3>
        <p className="facility-card-desc">{facility.description}</p>
      </div>
    </article>
  )
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  )
}
