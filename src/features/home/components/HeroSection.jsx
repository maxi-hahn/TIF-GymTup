import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '@/shared/components/Button'
import { useAuth } from '@/shared/contexts/AuthContext'

export function HeroSection() {
  const { t } = useTranslation('home')
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <section id="bienvenida" className="home-section hero-section">
      <img
        src="/gym-hero.png"
        alt="Instalaciones de GymTup"
        className="hero-bg-image"
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <span className="hero-badge">
          <span className="hero-badge-dot" />
          {user ? t('badgeWelcomeUser', { name: user.name }) : t('badgeWelcome')}
        </span>

        <h1 className="hero-title">
          {t('heroTitlePrefix')}{' '}
          <span className="hero-title-highlight">{t('heroTitleHighlight')}</span>
        </h1>

        <p className="hero-description">
          {t('heroDescription')}
        </p>

        <div className="hero-actions">
          <Button
            size="lg"
            className="hero-btn"
            onClick={() => navigate('/plans')}
          >
            {t('heroCtaEnroll')}
            <span className="btn-icon-right">→</span>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="hero-btn"
            onClick={() => navigate('/classes')}
          >
            {t('heroCtaClasses')}
          </Button>
        </div>
      </div>

      <a
        href="#instalaciones"
        className="hero-scroll-down"
        aria-label={t('heroDiscoverMore')}
      >
        {t('heroDiscoverMore')}
        <span className="hero-chevron-icon">↓</span>
      </a>
    </section>
  )
}
