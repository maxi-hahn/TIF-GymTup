import { useTranslation } from 'react-i18next'
import Button from '@/shared/components/Button'

const RemovePlanModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const { t } = useTranslation('profile')

  if (!isOpen) return null

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <span className="profile-modal-icon">⚠️</span>
          <h2 className="profile-modal-title">{t('modals.removePlanTitle')}</h2>
        </div>

        <div className="profile-modal-warning">
          {t('modals.removePlanWarning')}
        </div>

        <div className="profile-modal-actions">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            {t('modals.close')}
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm} disabled={loading}>
            {loading ? t('plan.removingPlan') : t('modals.confirmRemove')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RemovePlanModal
