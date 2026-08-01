import { useTranslation } from 'react-i18next'
import './EmptyState.css'

const EmptyState = () => {
  const { t } = useTranslation('classes')

  return (
    <div className="empty-state">
      <div className="empty-icon">🏋️</div>

      <h2>{t('noClassesAvailable')}</h2>

      <p>{t('emptyStateDescription')}</p>
    </div>
  )
}

export default EmptyState