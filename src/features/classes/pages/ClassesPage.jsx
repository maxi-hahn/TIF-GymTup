import { useEffect, useState, useCallback } from 'react'
import classService from '@/shared/services/classService'
import inscriptionService from '@/shared/services/inscriptionService'
import { getAuthToken } from '@/shared/utils/authUtils'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import ClassCatalog from '../components/ClassCatalog'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { handleBackendError } from '@/shared/utils/errorHandler'
import PlanRequiredBanner from '@/shared/components/PlanRequiredBanner'
import { useAuth } from '@/shared/contexts/AuthContext'
import ConfirmationModal from '@/shared/components/modals/ConfirmationModal'
const ClassesPage = () => {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingSchedule, setLoadingSchedule] = useState(null)
  const [scheduleToCancel, setScheduleToCancel] = useState(null)
  const { t } = useTranslation('classes')

  /**
   * Fetches classes (and inscriptions when the user is authenticated) and
   * merges the data into a unified list. Conditionally calls
   * GET /api/Inscription/me only when a JWT token is present, so the page
   * works correctly before Sprint 1 (Authentication) is integrated.
   *
   * When Sprint 1 delivers AuthContext, only authUtils.getAuthToken() needs
   * to be updated — no changes are required here.
   */
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
  const { user } = useAuth()
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)

      const classesData = await classService.getClasses()

      const enrolledScheduleIds = new Set()
      const token = getAuthToken()
      if (token) {
        const inscriptionsData = await inscriptionService.getMyInscriptions()
        inscriptionsData.forEach(i => enrolledScheduleIds.add(i.scheduleId))
      }

      const mergedClasses = classesData.map(gymClass => ({
        ...gymClass,
        schedules: gymClass.schedules.map(schedule => ({
          ...schedule,
          isEnrolled: enrolledScheduleIds.has(schedule.id)
        }))
      }))

      setClasses(mergedClasses)
    } catch (error) {
      console.error(error)
      toast.error(t('loadingError'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // loadData is an async data-fetching function. Calling it here is the
  // recommended React pattern for loading data on mount. The setState calls
  // inside loadData are deferred (they run after awaited I/O), so there are
  // no synchronous cascading renders. The react-hooks/set-state-in-effect
  // rule is suppressed for this line because this usage is intentional and
  // correct.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadData()
  }, [loadData])

  const handleEnroll = async (scheduleId) => {
    try {
      setLoadingSchedule(scheduleId)
      await inscriptionService.enroll(scheduleId)
      toast.success(t('enrollmentSuccess'))
      await loadData()
    }catch (error) {
      handleBackendError(error, navigate, t)
    }finally {
      setLoadingSchedule(null)
    }
    
  }

  const handleCancel = async (scheduleId) => {
    try {
      setLoadingSchedule(scheduleId)
      await inscriptionService.cancel(scheduleId)
      toast.success(t('cancelSuccess'))
      await loadData()
    } catch (error) {
      handleBackendError(error, navigate, t)
    }finally {
      setLoadingSchedule(null)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <>
      <h1>{t("title")}</h1>
      {!user?.hasPlan && (
         <PlanRequiredBanner />
      )}

      <ClassCatalog
        classes={classes} 
        onEnroll={handleEnroll}
        onCancel={openCancelModal}
        loadingSchedule={loadingSchedule}
      />
      <ConfirmationModal
          isOpen={scheduleToCancel !== null}
          title={t("cancelEnrollment")}
          message={t("cancelEnrollmentMessage")}
          confirmText={t("confirm")}
          cancelText={t("back")}
          onConfirm={confirmCancel}
          onCancel={closeCancelModal}
      />
    </>
  )
}

export default ClassesPage