import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ClassInfoEs } from '@/features/classes/data/ClassInfoEs' // Importar directamente el español
import classService from '@/shared/services/classService'
import { handleBackendError } from '@/shared/utils/errorHandler'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './CreateClassCard.css'
import scheduleService from '@/shared/services/scheduleService'
import { TIME_SLOTS, DAYS_ORDER } from '@/utils/scheduleConstants'

const CreateClassCard = ({ onCreateClass, isAdmin }) => {
  const { t } = useTranslation('classes')
  const navigate = useNavigate()
  
  // Usar siempre las claves en español
  const classContent = ClassInfoEs

  const [isFlipped, setIsFlipped] = useState(false)
  const [formData, setFormData] = useState({
    discipline: '',
    capacity: '',
    day: '',
    startTime: '',
    endTime: ''
  })
  const [schedules, setSchedules] = useState([])
  const [showScheduleForm, setShowScheduleForm] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  // RBAC: Return null if not admin
  if (!isAdmin) {
    return null
  }

  const handleFlip = (e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setIsFlipped(prev => !prev)
  }

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

  const handleAddSchedule = () => {
    const newSchedule = {
      dayOfWeek: Number(formData.day),
      startTime: formData.startTime,
      endTime: formData.endTime
    }

    setSchedules(prev => [...prev, newSchedule])

    // Limpiar campos del horario
    setFormData(prev => ({
      ...prev,
      day: '',
      startTime: '',
      endTime: ''
    }))

    // Mantener visible el formulario de horario
    setShowScheduleForm(true)
  }

  const handleRemoveSchedule = (index) => {
    setSchedules(prev => prev.filter((_, i) => i !== index))
  }

  const isStep1Complete = formData.discipline && formData.capacity
  const hasCurrentSchedule = formData.day !== '' && formData.startTime && formData.endTime
  const isFormValid = isStep1Complete &&
    (schedules.length > 0 || hasCurrentSchedule)

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isFormValid || isCreating) return

    setIsCreating(true)

    try {
      // PASO 1: Crear la clase
      const classPayload = {
        name: formData.discipline,
        max_Users: Number(formData.capacity)
      }

      const createdClass = await classService.createClass(classPayload)

      // PASO 2: Crear los horarios para la clase recién creada
      if (createdClass && createdClass.id) {
        // Crear todos los horarios guardados
        for (const schedule of schedules) {
          await scheduleService.createSchedule(createdClass.id, schedule)
        }

        // Crear el horario actual si existe
        if (formData.day && formData.startTime && formData.endTime) {
          const currentSchedule = {
            dayOfWeek: Number(formData.day),
            startTime: formData.startTime,
            endTime: formData.endTime
          }
          await scheduleService.createSchedule(createdClass.id, currentSchedule)
        }
      }

      toast.success(t('classCreatedSuccess') || '¡Clase creada exitosamente!')

      // Call the callback if provided
      if (onCreateClass) {
        await onCreateClass()
      }

      // Reset form after successful creation
      setFormData({
        discipline: '',
        capacity: '',
        day: '',
        startTime: '',
        endTime: ''
      })
      setSchedules([])
      setShowScheduleForm(true)
      setIsFlipped(false)

    } catch (error) {
      console.error('Error creating class:', error)

      // Si falla después de crear la clase, mostrar error específico
      if (error.response?.status === 409) {
        toast.error(t('classAlreadyExists') || 'Ya existe una clase con ese nombre')
      } else if (error.response?.status === 404) {
        toast.error(t('scheduleCreationFailed') || 'Error al crear el horario')
      } else {
        handleBackendError(error, navigate, t)
      }
    } finally {
      setIsCreating(false)
    }
  }

  const getDisciplineOptions = () => {
    // Usar Object.keys de ClassInfoEs que ahora siempre tiene las claves en español
    return Object.keys(classContent).map(disciplineKey => ({
      value: disciplineKey,
      label: disciplineKey
    }))
  }

  return (
    <article
      className={`create-class-card ${isFlipped ? 'is-flipped' : ''}`}
      onClick={!isFlipped ? handleFlip : undefined}
    >
      <div className="create-class-card-inner">

        {/* FRONT FACE */}
        <div className="create-class-front" onClick={handleFlip}>
          <button
            type="button"
            className="create-class-button"
            aria-label={t('createNewClass') || 'Crear nueva clase'}
          >
            <span className="create-class-icon">+</span>
          </button>
        </div>

        {/* BACK FACE - FORM */}
        <div 
          className="create-class-back"
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <form 
            onSubmit={handleSubmit} 
            className="create-class-form"
            onClick={(e) => e.stopPropagation()}
          >
          
            <h3 className="create-class-title">
              {t('createNewClass') || 'Crear Nueva Clase'}
            </h3>

            {/* STEP 1: Discipline and Capacity */}
            <div className="form-step">
              <h4 className="step-title">
                {t('selectDiscipline') || 'Selecciona la disciplina'}
              </h4>

              <select
                className="form-select"
                value={formData.discipline}
                onChange={(e) => handleInputChange('discipline', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                required
              >
                <option value="">
                  {t('chooseDiscipline') || 'Elige una disciplina...'}
                </option>
                {getDisciplineOptions().map(discipline => (
                  <option key={discipline.value} value={discipline.value}>
                    {discipline.label}
                  </option>
                ))}
              </select>

              <h4 className="step-title">
                {t('selectCapacity') || 'Selecciona cuántos cupos tendrá esta clase'}
              </h4>

              <select
                className="form-select"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                required
              >
                <option value="">
                  {t('chooseCapacity') || 'Selecciona cupos...'}
                </option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1
                      ? (t('spot') || 'cupo')
                      : (t('spots') || 'cupos')}
                  </option>
                ))}
              </select>
            </div>

            {/* STEP 2: Schedule - Only visible if Step 1 is complete */}
            {isStep1Complete && (
              <div className="form-step">
                <h4 className="step-title schedule-step-title">
                  {t('addSchedule') || 'Agrégale un horario a tu clase'}
                </h4>

                {/* Lista de horarios agregados */}
                {schedules.length > 0 && (
                  <div className="schedules-list">
                    <h5 className="schedules-list-title">
                      {t('addedSchedules') || 'Horarios agregados'}
                    </h5>
                    {schedules.map((schedule, index) => (
                      <div key={index} className="schedule-item">
                        <span>
                          {t(`daysN.${schedule.dayOfWeek}`)} {schedule.startTime} - {schedule.endTime}
                        </span>
                        <button
                          type="button"
                          className="remove-schedule-button"
                          onClick={() => handleRemoveSchedule(index)}
                          aria-label={t('removeSchedule') || 'Eliminar horario'}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="schedule-form-group">
                  <label className="form-label">
                    {t('day') || 'Día'}
                  </label>
                  <select
                    className="form-select"
                    value={formData.day}
                    onChange={(e) => handleInputChange('day', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    required
                  >
                    <option value="">
                      {t('selectDay') || 'Selecciona día...'}
                    </option>
                    {DAYS_ORDER.map(dayNum => (
                      <option key={dayNum} value={dayNum}>
                        {t(`daysN.${dayNum}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="schedule-time-group">
                  <div className="time-field">
                    <label className="form-label">
                      {t('startTime') || 'Hora de Inicio'}
                    </label>
                    <select
                      className="form-select"
                      value={formData.startTime}
                      onChange={handleStartTimeChange}
                      onClick={(e) => e.stopPropagation()}
                      required
                    >
                      <option value="">
                        {t('selectStartTime') || 'Hora inicio...'}
                      </option>
                      {TIME_SLOTS.map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="time-field">
                    <label className="form-label">
                      {t('endTime') || 'Hora de Fin'}
                    </label>
                    <select
                      className="form-select"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      required
                      disabled={!formData.startTime}
                    >
                      <option value="">
                        {t('selectEndTime') || 'Hora fin...'}
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
                  </div>
                </div>

                {/* Botón para agregar otro horario */}
                {hasCurrentSchedule && (
                  <button
                    type="button"
                    className="add-schedule-button"
                    onClick={handleAddSchedule}
                  >
                    {t('addAnotherSchedule') || 'Crear otro horario'}
                  </button>
                )}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="form-actions">
              <button
                type="submit"
                className="create-class-submit"
                disabled={!isFormValid || isCreating}
                onClick={(e) => e.stopPropagation()}
              >
                {isCreating
                  ? (t('creating') || 'Creando...')
                  : (t('createClass') || 'Crear clase')}
              </button>

              <button
                type="button"
                className="create-class-back-button"
                onClick={handleFlip}
              >
                {t('back') || 'Volver'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </article>
  )
}

export default CreateClassCard