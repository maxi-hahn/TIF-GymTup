import { useTranslation } from 'react-i18next'
import { getClassInfo } from '../../data/GetClassInfo'


const ClassCardFront = ({ gymClass, onMoreInfo }) => {
  const { t, i18n } = useTranslation('classes')
  const classContent = getClassInfo(i18n.language)
  
  const extraInfo = classContent[gymClass.name] ?? {
    image: '',
    badge: '',
    duration: '',
    intensity: '',
    description: '',
    benefits: []
  }

  const getAvailabilityMessage = () => {
    const totalSchedules = gymClass.schedules.length
    const fullSchedules = gymClass.schedules.filter(s => s.isFull).length

    if (fullSchedules === totalSchedules)
      return t('noSchedulesAvailable')

    if (fullSchedules === 0)
      return t('allSchedulesAvailable')

    return t('someSchedulesAvailable')
  }

  return (
    <div className="class-card-front">

      <div className="class-image">

        <img
          src={extraInfo.image}
          alt={gymClass.name}
        />

        <div className="image-overlay" />

        <span className="badge">
          {extraInfo.badge}
        </span>

      </div>

      <div className="class-header">

        <h2>{gymClass.name}</h2>

        <div className="class-info">

          <span>🕒 {extraInfo.duration}</span>

          <span>🔥 {extraInfo.intensity}</span>

        </div>
        <hr />
      </div>
      <div className='class-content'>
        <p className="description">
          {extraInfo.description}
        </p>

        <ul>

          {extraInfo.benefits.map((benefit, index) => (

            <li key={index}>
              ✔ {benefit}
            </li>

          ))}

        </ul>

        <p className="availability">
          {getAvailabilityMessage()}
        </p>

        <button
          onClick={onMoreInfo}
          className="view-button"
        >
          {t('ViewSchedules')}
        </button>

      </div>

    </div>
  )
}

export default ClassCardFront