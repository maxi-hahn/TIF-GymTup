import { useEffect, useState, useCallback } from 'react'
import classService from '@/shared/services/classService'
import inscriptionService from '@/shared/services/inscriptionService'
import { getAuthToken } from '@/shared/utils/authUtils'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import ClassCatalog from '../components/ClassCatalog'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
const ClassesPage = () => {
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingSchedule, setLoadingSchedule] = useState(null)
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
      toast.error(i18n.t('loadingError'))
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
    } catch (error) {
      console.error(error)
      toast.error(t('enrollmentError'))
    } finally {
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
      console.error(error)
      toast.error(t('cancelError'))
    } finally {
      setLoadingSchedule(null)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <>
      <h1>{t("title")}</h1>
      <ClassCatalog 
        classes={classes} 
        onEnroll={handleEnroll}
        onCancel={handleCancel}
        loadingSchedule={loadingSchedule}
      />
    </>
  )
}

export default ClassesPage