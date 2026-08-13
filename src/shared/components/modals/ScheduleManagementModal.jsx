import { useTranslation } from 'react-i18next'
import dayOfWeekMap from '@/utils/dayOfWeekMap'
import './ScheduleManagementModal.css'

const ScheduleManagementModal = ({
  schedule,
  onDisable,
  onDelete,
  onClose
}) => {
  const { t } = useTranslation('classes')

  if (!schedule) return null

  const dayName = dayOfWeekMap[schedule.dayOfWeek]
    ? t(dayOfWeekMap[schedule.dayOfWeek])
    : schedule.dayOfWeek

  return (
    <div
      className="schedule-modal-overlay"
      onClick={onClose}
    >
      <div
        className="schedule-management-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="schedule-modal-header">
          <h2>{t('manageSchedule')}</h2>
        </div>

        <p className="schedule-modal-info">
          📅 {dayName} ({schedule.startTime?.slice(0, 5)} - {schedule.endTime?.slice(0, 5)})
        </p>

        <p className="schedule-modal-description">
          {t('manageScheduleDescription')}
        </p>

        <div className="schedule-modal-actions">
          <button
            type="button"
            className="schedule-modal-disable"
            onClick={onDisable}
          >
            {schedule.isActive
              ? t('disableSchedule')
              : t('enableSchedule')}
          </button>

          <button
            type="button"
            className="schedule-modal-delete"
            onClick={onDelete}
          >
            {t('deleteSchedule')}
          </button>
        </div>

        <button
          type="button"
          className="schedule-modal-cancel"
          onClick={onClose}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  )
}

export default ScheduleManagementModal