import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '@/shared/components/Button'
import '../NotFoundPage.css'  // Reutilizar estilos

const ForbiddenPage = () => {
  const { t } = useTranslation('notFound')
  const navigate = useNavigate()

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <span className="not-found-code">403</span>
        <h1 className="not-found-title">{t('titleF')}</h1>
        <p className="not-found-message">{t('messageF')}</p>
        <Button onClick={() => navigate('/')}>
          {t('backHomeF')}
        </Button>
      </div>
    </div>
  )
}

export default ForbiddenPage