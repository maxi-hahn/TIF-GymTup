import { useTranslation } from 'react-i18next'
import dayOfWeekMap from '@/utils/dayOfWeekMap'
import './ScheduleClassCard.css';
const ScheduleCard = ({ schedule }) => {
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

      <button
        disabled={schedule.isFull}
        // onClick={() => handleEnroll(schedule.id)}
      >
        {schedule.isFull
          ? t('full')
          : t('enroll')}
      </button>

    </div>
  )
}

export default ScheduleCard