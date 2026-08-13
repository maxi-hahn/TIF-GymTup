import { useTranslation } from 'react-i18next'
import './ClassManagementModal.css'

const ClassManagementModal = ({
  gymClass,
  onDisable,
  onDelete,
  onClose
}) => {
  const { t } = useTranslation('classes')

  if (!gymClass) return null

  return (
    <div className="class-modal-overlay" onClick={onClose}>
      <div
        className="class-management-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="class-modal-header">
          <h2>{t('manageClass')}</h2>

          <button
            type="button"
            className="class-modal-close"
            onClick={onClose}
            aria-label={t('close')}
          >
            ×
          </button>
        </div>

        <p className="class-modal-class-name">
          {gymClass.name}
        </p>

        <p className="class-modal-description">
          {t('manageClassDescription')}
        </p>

        <div className="class-modal-actions">
          <button
            type="button"
            className="class-modal-disable"
            onClick={onDisable}
          >
            {gymClass.isActive
              ? t('disableClass')
              : t('enableClass')}
          </button>

          <button
            type="button"
            className="class-modal-delete"
            onClick={onDelete}
          >
            {t('deleteClass')}
          </button>
        </div>

        <button
          type="button"
          className="class-modal-cancel"
          onClick={onClose}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  )
}

export default ClassManagementModal