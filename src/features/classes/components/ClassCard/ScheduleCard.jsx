import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayOfWeekMap from '@/utils/dayOfWeekMap'
import './ScheduleClassCard.css'
import { useAuth } from '@/shared/contexts/AuthContext'
import ScheduleManagementModal from '@/shared/components/modals/ScheduleManagementModal'
import { TIME_SLOTS, DAYS_ORDER } from '@/utils/scheduleConstants'
const ScheduleCard = ({
  schedule,
  onEnroll,
  onCancel,
  isLoading,
  classIsActive,
  isAdmin,
  onEditSchedule,
  onToggleScheduleStatus,
  onDeleteSchedule
}) => {
  const { user } = useAuth()
  const { t } = useTranslation('classes')
  const [showManagementModal, setShowManagementModal] = useState(false)

  // Inline Editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editDay, setEditDay] = useState(schedule.dayOfWeek)
  const [editStartTime, setEditStartTime] = useState(
    schedule.startTime ? schedule.startTime.slice(0, 5) : '08:00'
  )
  const [editEndTime, setEditEndTime] = useState(
    schedule.endTime ? schedule.endTime.slice(0, 5) : '09:00'
  )

  const isScheduleActive = schedule.isActive

  const isDisabled = !classIsActive || !isScheduleActive

  const getDisabledMessage = () => {
    if (!classIsActive) {
      return t('classDisabled')
    }

    if (!isScheduleActive) {
      return t('scheduleDisabled')
    }

    return null
  }

  const handleStartTimeChange = (e) => {
    const newStart = e.target.value
    setEditStartTime(newStart)

    // Validation rule: If Start Time changes to a value equal to or after current End Time,
    // automatically reset End Time to the next valid slot.
    if (editEndTime <= newStart) {
      const startIndex = TIME_SLOTS.indexOf(newStart)
      const nextSlot =
        startIndex >= 0 && startIndex < TIME_SLOTS.length - 1
          ? TIME_SLOTS[startIndex + 1]
          : newStart
      setEditEndTime(nextSlot)
    }
  }

  const handleSaveEdit = async () => {
    const origStart = schedule.startTime ? schedule.startTime.slice(0, 5) : ''
    const origEnd = schedule.endTime ? schedule.endTime.slice(0, 5) : ''

    const isUnchanged =
      Number(editDay) === schedule.dayOfWeek &&
      editStartTime === origStart &&
      editEndTime === origEnd

    if (isUnchanged) {
      setIsEditing(false)
      return
    }

    if (onEditSchedule) {
      await onEditSchedule({
        ...schedule,
        dayOfWeek: Number(editDay),
        startTime: editStartTime,
        endTime: editEndTime
      })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleDisable = async () => {
    if (onToggleScheduleStatus) {
      await onToggleScheduleStatus(schedule)
    }
    setShowManagementModal(false)
  }

  const handleDelete = async () => {
    if (onDeleteSchedule) {
      await onDeleteSchedule(schedule)
    }
    setShowManagementModal(false)
  }

  return (
    <div className="schedule-card">

      <div className="schedule-header">

        {isEditing ? (
          <select
            className="schedule-select schedule-day-select"
            value={editDay}
            onChange={(e) => setEditDay(Number(e.target.value))}
          >
            {DAYS_ORDER.map((dayNum) => (
              <option key={dayNum} value={dayNum}>
                {t(dayOfWeekMap[dayNum])}
              </option>
            ))}
          </select>
        ) : (
          <h4>
            {t(dayOfWeekMap[schedule.dayOfWeek])}
          </h4>
        )}

        {isDisabled && (
          <span className="schedule-disabled-badge">
            {getDisabledMessage()}
          </span>
        )}

      </div>

      {isEditing ? (
        <div className="schedule-time-edit">
          <div className="schedule-time-selects">
            <select
              className="schedule-select schedule-time-select"
              value={editStartTime}
              onChange={handleStartTimeChange}
            >
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <span className="schedule-time-separator">-</span>

            <select
              className="schedule-select schedule-time-select"
              value={editEndTime}
              onChange={(e) => setEditEndTime(e.target.value)}
            >
              {TIME_SLOTS.map((time) => {
                const isOptionDisabled = time <= editStartTime
                return (
                  <option
                    key={time}
                    value={time}
                    disabled={isOptionDisabled}
                  >
                    {time}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      ) : (
        <p>
          {schedule.startTime?.slice(0, 5)}
          {' - '}
          {schedule.endTime?.slice(0, 5)}
        </p>
      )}

      <p>
        {t('enrolledUsers')}: {schedule.enrolledUsers}
      </p>

      <p>
        {t('availableSpots')}: {schedule.availableSpots}
      </p>

      {isAdmin ? (

        <div className="schedule-admin-actions">

          {isEditing ? (
            <>
              <button
                type="button"
                className="schedule-save-btn"
                onClick={handleSaveEdit}
                title={t('confirm') || 'Guardar'}
              >
                ✓
              </button>

              <button
                type="button"
                className="schedule-cancel-btn"
                onClick={handleCancelEdit}
                title={t('cancel') || 'Cancelar'}
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="schedule-edit-btn"
                onClick={() => {
                  setEditDay(schedule.dayOfWeek)
                  setEditStartTime(
                    schedule.startTime
                      ? schedule.startTime.slice(0, 5)
                      : '08:00'
                  )
                  setEditEndTime(
                    schedule.endTime
                      ? schedule.endTime.slice(0, 5)
                      : '09:00'
                  )
                  setIsEditing(true)
                }}
                title={t('editSchedule')}
              >
                ✎
              </button>

              <button
                type="button"
                className="schedule-delete-btn"
                onClick={() => setShowManagementModal(true)}
                title={t('manageSchedule')}
              >
                {schedule.isActive ? '×' : '⚙'}
              </button>
            </>
          )}

        </div>

      ) : (

        schedule.isEnrolled ? (

          <button
            className="cancel-btn"
            disabled={isLoading}
            onClick={() => onCancel(schedule.id)}
          >
            {isLoading
              ? t('canceling')
              : t('cancelEnrollment')}
          </button>

        ) : (

          <button
            disabled={
              isDisabled ||
              schedule.isFull ||
              isLoading ||
              !user?.hasPlan
            }
            onClick={() => onEnroll(schedule.id)}
          >
            {isLoading
              ? t('enrolling')
              : !classIsActive
                ? t('classDisabled')
                : !isScheduleActive
                  ? t('scheduleDisabled')
                  : !user?.hasPlan
                    ? t('planRequired')
                    : schedule.isFull
                      ? t('full')
                      : t('enroll')}
          </button>

        )

      )}

      {showManagementModal && (
        <ScheduleManagementModal
          schedule={schedule}
          onDisable={handleDisable}
          onDelete={handleDelete}
          onClose={() => setShowManagementModal(false)}
        />
      )}

    </div>
  )
}

export default ScheduleCard