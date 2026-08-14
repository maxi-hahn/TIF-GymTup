import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import ScheduleCard from './ScheduleCard'
import CreateScheduleCard from '@/features/classes/components/CreateScheduleCard'
import './ClassCard.css'

const ClassCardBack = ({
  gymClass,
  onBack,
  onEnroll,
  onCancel,
  loadingSchedule,
  classIsActive,
  isAdmin,
  onToggleScheduleStatus,
  onDeleteSchedule,
  onEditSchedule,
  onCreateSchedule,
  onUpdateCapacity
}) => {
  const { t } = useTranslation('classes')
  const [isEditingCapacity, setIsEditingCapacity] = useState(false)
  const [capacityValue, setCapacityValue] = useState(String(gymClass.max_Users))
  const [isSaving, setIsSaving] = useState(false)

  const handleEditCapacity = () => {
    setCapacityValue(String(gymClass.max_Users))
    setIsEditingCapacity(true)
  }

  const handleCancelCapacity = () => {
    setCapacityValue(String(gymClass.max_Users))
    setIsEditingCapacity(false)
  }

  const handleSaveCapacity = async () => {
    const parsed = parseInt(capacityValue, 10)

    if (!capacityValue || isNaN(parsed) || parsed < 1) {
      toast.error(t('invalidCapacity'))
      return
    }

    if (parsed === gymClass.max_Users) {
      setIsEditingCapacity(false)
      return
    }

    setIsSaving(true)
    try {
      await onUpdateCapacity(gymClass.id, parsed)
      setIsEditingCapacity(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="class-card-back">

      <h2>{gymClass.name}</h2>

      <div className="capacity-row">
        <span className="capacity-label">
          {t('maximumCapacity')}:
        </span>

        {isEditingCapacity ? (
          <div className="capacity-edit-controls">
            <input
              type="number"
              className="capacity-input"
              value={capacityValue}
              min="1"
              onChange={(e) => setCapacityValue(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="capacity-save-btn"
              onClick={handleSaveCapacity}
              disabled={isSaving}
              title={t('saving')}
            >
              ✓
            </button>
            <button
              type="button"
              className="capacity-cancel-btn"
              onClick={handleCancelCapacity}
              disabled={isSaving}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="capacity-display">
            <span className="capacity-value">{gymClass.max_Users}</span>
            {isAdmin && (
              <button
                type="button"
                className="capacity-edit-btn"
                onClick={handleEditCapacity}
                title={t('editCapacity')}
              >
                ✎
              </button>
            )}
          </div>
        )}
      </div>

      <div className="schedule-list">
        {isAdmin && (
          <CreateScheduleCard
            onCreateSchedule={(scheduleData) => onCreateSchedule(gymClass.id, scheduleData)}
          />
        )}

        {gymClass.schedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onEnroll={onEnroll}
            onCancel={onCancel}
            isLoading={loadingSchedule === schedule.id}
            classIsActive={classIsActive}
            isAdmin={isAdmin}
            onToggleScheduleStatus={onToggleScheduleStatus}
            onDeleteSchedule={onDeleteSchedule}
            onEditSchedule={onEditSchedule}
          />
        ))}

      </div>

      <button
        onClick={onBack}
        className="back-button"
      >
        {t('back')}
      </button>

    </div>
  )
}

export default ClassCardBack