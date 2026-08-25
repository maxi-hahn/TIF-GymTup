import { useTranslation } from 'react-i18next'
import Button from '@/shared/components/Button'
import { calculateNextClassDate, getTimeUntilText } from '@/utils/dateUtils'

const dayNames = {
  0: 'Domingo', 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado',
  '0': 'Domingo', '1': 'Lunes', '2': 'Martes', '3': 'Miércoles', '4': 'Jueves', '5': 'Viernes', '6': 'Sábado',
  'sunday': 'Domingo', 'monday': 'Lunes', 'tuesday': 'Martes', 'wednesday': 'Miércoles',
  'thursday': 'Jueves', 'friday': 'Viernes', 'saturday': 'Sábado'
}

const ClassItem = ({ item, onCancelClick }) => {
  const { t } = useTranslation(['profile', 'classes'])

  const className = item.className || item.schedule?.className || item.name || 'Clase'
  
  const rawDay = item.day ?? item.schedule?.day ?? item.dayOfWeek ?? item.schedule?.dayOfWeek
  let dayName = ''
  if (rawDay !== undefined && rawDay !== null) {
    dayName = dayNames[rawDay] || (typeof rawDay === 'string' && rawDay.length > 2 ? rawDay : `Día ${rawDay}`)
  }

  const startTime = item.startTime || item.schedule?.startTime || ''
  const endTime = item.endTime || item.schedule?.endTime || ''
  
  // Calcular siempre la fecha exacta local para sincronizar con la tarjeta de clases
  const classDateObj = calculateNextClassDate(rawDay, startTime) || (item.date ? new Date(item.date) : null)

  const dateStr = classDateObj ? classDateObj.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : null

  const timeUntilStr = getTimeUntilText(classDateObj)
  const isUpcoming = item.isUpcoming !== false

  return (
    <div className="profile-class-item">
      <div className="profile-class-main-info">
        <div className="profile-class-title-row">
          <h4 className="profile-class-name">{className}</h4>
          <span className={`profile-badge ${isUpcoming ? 'profile-badge-active' : 'profile-badge-expired'}`}>
            {isUpcoming ? t('classes.upcoming') : t('classes.passed')}
          </span>
          {timeUntilStr && (
            <span className="profile-badge profile-badge-role" style={{ color: '#24d1a7', borderColor: 'rgba(36, 209, 167, 0.3)' }}>
              ⏳ {timeUntilStr}
            </span>
          )}
        </div>

        <div className="profile-class-meta">
          {(dayName || startTime) && (
            <div className="profile-class-meta-item">
              <span>🕒</span>
              <strong style={{ color: '#ffffff' }}>
                {dayName} {startTime ? `(${startTime.slice(0, 5)}${endTime ? ` - ${endTime.slice(0, 5)}` : ''})` : ''}
              </strong>
            </div>
          )}

          {dateStr && (
            <div className="profile-class-meta-item">
              <span>📅</span>
              <span>{dateStr}</span>
            </div>
          )}
        </div>
      </div>

      {isUpcoming && (
        <Button
          size="xs"
          variant="destructive"
          onClick={() => onCancelClick(item)}
        >
          {t('classes.cancelEnrollment')}
        </Button>
      )}
    </div>
  )
}

export default ClassItem
