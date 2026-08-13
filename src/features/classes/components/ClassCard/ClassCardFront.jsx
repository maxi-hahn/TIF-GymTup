import { useTranslation } from 'react-i18next'
import { getClassInfo } from '../../data/GetClassInfo'

const ClassCardFront = ({
  gymClass,
  onMoreInfo,
  isAdmin,
  onManage
}) => {
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
    if (!gymClass.isActive) {
      return t('classDisabled')
    }

    const totalSchedules = gymClass.schedules.length
    const fullSchedules = gymClass.schedules.filter(
      s => s.isFull
    ).length

    if (fullSchedules === totalSchedules)
      return t('noSchedulesAvailable')

    if (fullSchedules === 0)
      return t('allSchedulesAvailable')

    return t('someSchedulesAvailable')
  }

  return (
    <div className="class-card-front">

      <div className="class-image">

        {isAdmin && (
          <button
            type="button"
            className={`class-admin-button ${
              !gymClass.isActive ? 'class-admin-button-active' : ''
            }`}
            onClick={onManage}
            aria-label={t('manageClass')}
          >
            {gymClass.isActive ? '×' : '✓'}
          </button>
        )}

        <img
          src={extraInfo.image}
          alt={gymClass.name}
        />

        <div className="image-overlay" />

        <span className="badge">
          {extraInfo.badge}
        </span>

        {!gymClass.isActive && !isAdmin && (
          <span className="class-disabled-badge">
            {t('classDisabled')}
          </span>
        )}

      </div>

      <div className="class-header">

        <h2>{gymClass.name}</h2>

        <div className="class-info">

          <span>🕒 {extraInfo.duration}</span>

          <span>🔥 {extraInfo.intensity}</span>

        </div>

        <hr />

      </div>

      <div className="class-content">

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

        <p
          className={`availability ${
            !gymClass.isActive ? 'availability-disabled' : ''
          }`}
        >
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