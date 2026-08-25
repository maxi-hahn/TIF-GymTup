import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '@/shared/components/Button'

export function CtaSection() {
  const { t } = useTranslation('home')
  const navigate = useNavigate()

  return (
    <section id="empezar" className="cta-section">
      <div className="cta-banner">
        <img
          src="/class-spinning.png"
          alt="Clase de spinning en GymTup"
          className="cta-bg-image"
        />
        <div className="cta-overlay" />
        <div className="cta-content">
          <h2 className="cta-title">
            {t('ctaTitle')}
          </h2>
          <p className="cta-description">
            {t('ctaDescription')}
          </p>
          <div className="cta-actions">
            <Button
              size="lg"
              className="hero-btn"
              onClick={() => navigate('/plans')}
            >
              {t('ctaViewPlans')}
              <span className="btn-icon-right">→</span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="hero-btn"
              onClick={() => navigate('/login')}
            >
              {t('ctaRegister')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
