import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/shared/contexts/AuthContext'
import '../verification.css'

const EmailVerifiedPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('verification')
  const { isAuthenticated } = useAuth()

  return (
    <div className="verification-page">
      <div className="verification-card">
        <div className="verification-icon-wrapper success">✓</div>
        <h1 className="verification-title">{t('success')}</h1>
        <p className="verification-message">{t('successMessage')}</p>

        <div className="verification-actions">
          {isAuthenticated ? (
            <button
              className="verification-button verification-button-primary"
              onClick={() => navigate('/classes')}
            >
              {t('goToClasses')}
            </button>
          ) : (
            <button
              className="verification-button verification-button-primary"
              onClick={() => navigate('/login')}
            >
              {t('goToLogin')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailVerifiedPage
