import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TIME_SLOTS, DAYS_ORDER } from '@/utils/scheduleConstants'
import './CreateScheduleCard.css'

const CreateScheduleCard = ({ onCreateSchedule }) => {
  const { t } = useTranslation('classes')
  
  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    endTime: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStartTimeChange = (e) => {
    const newStart = e.target.value
    setFormData(prev => {
      const newData = { ...prev, startTime: newStart }
      
      if (prev.endTime && prev.endTime <= newStart) {
        const startIndex = TIME_SLOTS.indexOf(newStart)
        const nextSlot = startIndex >= 0 && startIndex < TIME_SLOTS.length - 1
          ? TIME_SLOTS[startIndex + 1]
          : newStart
        newData.endTime = nextSlot
      }
      
      return newData
    })
  }

  const isFormValid = formData.day !== '' && 
    formData.startTime && 
    formData.endTime

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isFormValid || isCreating) return
    
    setIsCreating(true)
    
    try {
      const schedulePayload = {
        dayOfWeek: Number(formData.day),
        startTime: formData.startTime,
        endTime: formData.endTime
      }
      
      await onCreateSchedule(schedulePayload)
      
      // Reset form
      setFormData({
        day: '',
        startTime: '',
        endTime: ''
      })
      
    } catch (error) {
      console.error('Error creating schedule:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="create-schedule-card">
      <form onSubmit={handleSubmit} className="create-schedule-form">
        
        <div className="create-schedule-header">
          <span className="schedule-placeholder">
            {t('day')}: <span className="placeholder-value">{formData.day ? t(`daysN.${formData.day}`) : '___'}</span>
          </span>
          <span className="schedule-placeholder">
            {t('startTime')}: <span className="placeholder-value">{formData.startTime || '___'}</span>
          </span>
          <span className="schedule-placeholder">
            {t('endTime')}: <span className="placeholder-value">{formData.endTime || '___'}</span>
          </span>
        </div>

        <div className="create-schedule-controls">
          <select
            className="schedule-select"
            value={formData.day}
            onChange={(e) => handleInputChange('day', e.target.value)}
            required
          >
            <option value="">
              {t('selectDay') || 'Día...'}
            </option>
            {DAYS_ORDER.map(dayNum => (
              <option key={dayNum} value={dayNum}>
                {t(`daysN.${dayNum}`)}
              </option>
            ))}
          </select>

          <select
            className="schedule-select"
            value={formData.startTime}
            onChange={handleStartTimeChange}
            required
          >
            <option value="">
              {t('selectStartTime') || 'Inicio...'}
            </option>
            {TIME_SLOTS.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <select
            className="schedule-select"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            required
            disabled={!formData.startTime}
          >
            <option value="">
              {t('selectEndTime') || 'Fin...'}
            </option>
            {TIME_SLOTS.map(time => {
              const isOptionDisabled = formData.startTime && time <= formData.startTime
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

          <button
            type="submit"
            className="create-schedule-submit"
            disabled={!isFormValid || isCreating}
          >
            {isCreating 
              ? (t('creating') || 'Creando...') 
              : (t('createSchedule') || 'Crear horario')}
          </button>
        </div>

      </form>
    </div>
  )
}

export default CreateScheduleCard