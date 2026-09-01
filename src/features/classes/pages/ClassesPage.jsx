import classService from '@/shared/services/classService'
import inscriptionService from '@/shared/services/inscriptionService'
import scheduleService from '@/shared/services/scheduleService'
import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { handleBackendError } from '@/shared/utils/errorHandler'
import { useAuth } from '@/shared/contexts/AuthContext'
import ClassCatalog from '../components/ClassCatalog'
import ConfirmationModal from '@/shared/components/modals/ConfirmationModal'
import toast from 'react-hot-toast'
import './ClassesPage.css'

const ClassesPage = () => {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingSchedule, setLoadingSchedule] = useState(null)
  const [scheduleToCancel, setScheduleToCancel] = useState(null)

  const { t } = useTranslation('classes')
  const { user } = useAuth()

  const isAdmin = user?.rol === 'Admin' || user?.rol === 'SysAdmin'
  const isClient = user?.rol === 'Client'

  const loadData = useCallback(async () => {
    try {
      const classesData = await classService.getClasses()
      setClasses(classesData)
    } catch (error) {
      console.error(error)
      toast.error(t('loadingError'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openCancelModal = (scheduleId) => {
    setScheduleToCancel(scheduleId)
  }

  const closeCancelModal = () => {
    setScheduleToCancel(null)
  }

  const confirmCancel = async () => {
    await handleCancel(scheduleToCancel)
    closeCancelModal()
  }

  const handleEnroll = async (scheduleId) => {
    try {
      setLoadingSchedule(scheduleId)
      await inscriptionService.enroll(scheduleId)
      toast.success(t('enrollmentSuccess'))
      
      // Disparar evento para actualizar navbar
      window.dispatchEvent(new Event('planUpdated'))
      window.dispatchEvent(new Event('notificationsUpdated'))


      await loadData()
    } catch (error) {
      handleBackendError(error, navigate, t)
    } finally {
      setLoadingSchedule(null)
    }
}

const handleCancel = async (scheduleId) => {
    try {
      setLoadingSchedule(scheduleId)
      await inscriptionService.cancel(scheduleId)
      toast.success(t('cancelSuccess'))
      
      // Disparar evento para actualizar navbar
      window.dispatchEvent(new Event('planUpdated'))
      window.dispatchEvent(new Event('notificationsUpdated'))

      await loadData()
    } catch (error) {
      handleBackendError(error, navigate, t)
    } finally {
      setLoadingSchedule(null)
    }
}

  const handleDisable = async (gymClass) => {
    try {
      await classService.updateStatus(
        gymClass.id,
        !gymClass.isActive
      )

      toast.success(
        gymClass.isActive
          ? t('classDisabled')
          : t('classEnabled')
      )

      await loadData()
    } catch (error) {
      handleBackendError(error, navigate, t)
    }
  }

  const handleDelete = async (gymClass) => {
    try {
      await classService.deleteClass(gymClass.id)

      toast.success(t('classDeleted'))

      await loadData()
    } catch (error) {
      handleBackendError(error, navigate, t)
    }
  }

  const handleToggleScheduleStatus = async (schedule) => {
    try {
      await scheduleService.updateStatus(
        schedule.id,
        !schedule.isActive
      )
  
      toast.success(
        schedule.isActive
          ? t('scheduleDisabled')
          : t('scheduleEnabled')
      )
  
      await loadData()
    } catch (error) {
      handleBackendError(error, navigate, t)
    }
  }
  const handleDeleteSchedule = async (schedule) => {
    try {
      await scheduleService.deleteSchedule(schedule.id)
  
      toast.success(t('scheduleDeleted'))
  
      await loadData()
    } catch (error) {
      handleBackendError(error, navigate, t)
    }
  }

  const handleEditSchedule = async (updatedSchedule) => {
    try {
      await scheduleService.updateSchedule(updatedSchedule.id, {
        dayOfWeek: updatedSchedule.dayOfWeek,
        startTime: updatedSchedule.startTime,
        endTime: updatedSchedule.endTime,
        isActive: updatedSchedule.isActive
      })

      setClasses((prevClasses) =>
        prevClasses.map((cls) => ({
          ...cls,
          schedules: cls.schedules.map((sch) =>
            sch.id === updatedSchedule.id
              ? { ...sch, ...updatedSchedule }
              : sch
          )
        }))
      )
      toast.success(t('scheduleUpdated'))
    } catch (error) {
      handleBackendError(error, navigate, t)
    }
  }
  const handleCreateSchedule = async (classId, scheduleData) => {
    try {
      await scheduleService.createSchedule(classId, scheduleData)
      
      toast.success(t('scheduleCreatedSuccess'))
      
      await loadData()
    } catch (error) {
      handleBackendError(error, navigate, t)
    }
  }
  const handleCreateClass = async () => {
    await loadData()
  }

  const handleUpdateCapacity = async (classId, maxUsers) => {
    try {
      await classService.updateCapacity(classId, maxUsers)
      toast.success(t('capacityUpdated'))
      await loadData()
    } catch (error) {
      handleBackendError(error, navigate, t)
    }
  }


  if (isLoading) {
    return <div className="classes-loading">{t('loading')}</div>
  }

  return (
    <div className="classes-page">
      {/* Hero Section */}
      <section className="classes-hero">
        <div className="classes-hero-content">
          <span className="classes-hero-badge">
            {t('heroBadge')}
          </span>
          <h1 className="classes-hero-title">
            {t('heroTitle')}
          </h1>
          <p className="classes-hero-description">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* Política de cancelación - solo para clientes */}
      {isClient && (
        <section className="cancellation-policy">
          <div className="cancellation-policy-icon">📌</div>
          <div className="cancellation-policy-content">
            <h3 className="cancellation-policy-title">
              {t('cancellationPolicyTitle')}
            </h3>
            <ul className="cancellation-policy-list">
              <li>{t('policy30min')}</li>
              <li>{t('policy3days')}</li>
            </ul>
          </div>
        </section>
      )}

      {/* Catálogo de clases */}
      <ClassCatalog
        classes={classes}
        onEnroll={handleEnroll}
        onCancel={openCancelModal}
        loadingSchedule={loadingSchedule}
        isAdmin={isAdmin}
        onDisable={handleDisable}
        onDelete={handleDelete}
        onToggleScheduleStatus={handleToggleScheduleStatus}
        onDeleteSchedule={handleDeleteSchedule}
        onEditSchedule={handleEditSchedule}
        onCreateClass={handleCreateClass}
        onCreateSchedule={handleCreateSchedule}
        onUpdateCapacity={handleUpdateCapacity}
      />

      <ConfirmationModal
        isOpen={scheduleToCancel !== null}
        title={t('cancelEnrollment')}
        message={t('cancelEnrollmentMessage')}
        confirmText={t('confirm')}
        cancelText={t('back')}
        onConfirm={confirmCancel}
        onCancel={closeCancelModal}
      />
    </div>
  )
}

export default ClassesPage