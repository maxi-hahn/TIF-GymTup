import { useTranslation } from 'react-i18next'
import Button from '@/shared/components/Button'

const CancelClassModal = ({ isOpen, classData, onClose, onConfirm, loading }) => {
  const { t } = useTranslation('profile')

  if (!isOpen || !classData) return null

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <span className="profile-modal-icon">🗓️</span>
          <h2 className="profile-modal-title">{t('modals.cancelClassTitle')}</h2>
        </div>

        <p className="profile-modal-message">
          {t('modals.cancelClassDetails')}{' '}
          <strong style={{ color: '#ffffff' }}>{classData.className}</strong> ({classData.day} {classData.time})
        </p>

        <div className="profile-modal-warning">
          {t('modals.cancelClassWarning3Days')}
        </div>

        <div className="profile-modal-actions">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            {t('modals.close')}
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm} disabled={loading}>
            {loading ? t('classes.canceling') : t('modals.confirmCancelClass')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CancelClassModal
