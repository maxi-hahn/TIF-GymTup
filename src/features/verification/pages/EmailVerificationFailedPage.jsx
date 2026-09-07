import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../verification.css'

const EmailVerificationFailedPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('verification')

  return (
    <div className="verification-page">
      <div className="verification-card">
        <div className="verification-icon-wrapper failed">✕</div>
        <h1 className="verification-title">{t('failed')}</h1>
        <p className="verification-message">{t('failedMessage')}</p>

        <div className="verification-actions">
          <button
            className="verification-button verification-button-secondary"
            onClick={() => navigate('/')}
          >
            {t('backHome')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationFailedPage
