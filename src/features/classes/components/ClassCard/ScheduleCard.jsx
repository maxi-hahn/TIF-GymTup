import { useTranslation } from 'react-i18next'
import dayOfWeekMap from '@/utils/dayOfWeekMap'
import './ScheduleClassCard.css';
import { useAuth } from '@/shared/contexts/AuthContext'
const ScheduleCard = ({ schedule, onEnroll, onCancel, isLoading }) => {
  const { user } = useAuth()
  const { t } = useTranslation('classes')

  return (
    <div className="schedule-card">

      <h4>
        {t(dayOfWeekMap[schedule.dayOfWeek])}
      </h4>

      <p>
        {schedule.startTime.slice(0, 5)}
        {' - '}
        {schedule.endTime.slice(0, 5)}
      </p>

      <p>
        {t('enrolledUsers')}: {schedule.enrolledUsers}
      </p>

      <p>
        {t('availableSpots')}: {schedule.availableSpots}
      </p>

      {schedule.isEnrolled ? (
        <button
          className="cancel-btn"
          disabled={isLoading}
          onClick={() => onCancel(schedule.id)}
        >
          {isLoading ? t('canceling') : t('cancelEnrollment')}
        </button>
      ) : (
        <button
          disabled={schedule.isFull || isLoading || !user?.hasPlan}
          onClick={() => onEnroll(schedule.id)}
        >
          {isLoading
            ? t('enrolling')
            : !user?.hasPlan
              ? t('planRequired')
              : schedule.isFull
                ? t('full')
                : t('enroll')}
        </button>
      )}

    </div>
  )
}

export default ScheduleCard