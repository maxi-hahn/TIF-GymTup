import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '@/shared/components/Button'
import '../NotFoundPage.css'

const NotFoundPage = () => {
  const { t } = useTranslation('notFound')
  const navigate = useNavigate()

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">{t('title')}</h1>
        <p className="not-found-message">{t('message')}</p>
        <Button onClick={() => navigate('/')}>
          {t('backHome')}
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage