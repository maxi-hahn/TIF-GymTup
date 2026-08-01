import './LoadingSpinner.css'
import { useTranslation } from 'react-i18next'

const LoadingSpinner = () => {
  const { t } = useTranslation('classes')

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{t('loading')}</p>
    </div>
  )
}

export default LoadingSpinner