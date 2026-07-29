import { useTranslation } from 'react-i18next'
import ScheduleCard from './ScheduleCard'

const ClassCardBack = ({ gymClass, onBack }) => {
  const { t } = useTranslation('classes')

  return (
    <div className='class-card-back'>

      <h2>{gymClass.name}</h2>

      <p>
        {t('maximumCapacity')}: {gymClass.max_Users}
      </p>
      <div className="schedule-list">
      {gymClass.schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.id}
          schedule={schedule}
        />))}
      </div>

      <button onClick={onBack} className='back-button'>
        {t('back')}
      </button>

    </div>
  )
}

export default ClassCardBack