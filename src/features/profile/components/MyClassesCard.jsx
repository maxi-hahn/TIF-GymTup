import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '@/shared/components/Button'
import ClassItem from './ClassItem'
import CancelClassModal from './CancelClassModal'
import inscriptionService from '@/shared/services/inscriptionService'

import { calculateNextClassDate } from '@/utils/dateUtils'

const MyClassesCard = ({ inscriptions = [], onClassesUpdated }) => {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState(null)
  const [canceling, setCanceling] = useState(false)

  const handleCancelConfirm = async () => {
    if (!selectedClass) return
    setCanceling(true)
    try {
      const scheduleId = selectedClass.scheduleId || selectedClass.id
      await inscriptionService.cancel(scheduleId)
      toast.success(t('toasts.classCancelled'))
      setSelectedClass(null)
      if (onClassesUpdated) onClassesUpdated()
    } catch (err) {
      toast.error(t('toasts.classCancelError'))
    } finally {
      setCanceling(false)
    }
  }

  // Ordenar inscripciones por la fecha más próxima
  const sortedInscriptions = [...inscriptions].sort((a, b) => {
    const rawDayA = a.day ?? a.schedule?.day ?? a.dayOfWeek ?? a.schedule?.dayOfWeek
    const rawDayB = b.day ?? b.schedule?.day ?? b.dayOfWeek ?? b.schedule?.dayOfWeek
    const startTimeA = a.startTime || a.schedule?.startTime || ''
    const startTimeB = b.startTime || b.schedule?.startTime || ''

    const dateA = a.date || a.nextClassDate || a.schedule?.nextClassDate
      ? new Date(a.date || a.nextClassDate || a.schedule?.nextClassDate)
      : calculateNextClassDate(rawDayA, startTimeA)

    const dateB = b.date || b.nextClassDate || b.schedule?.nextClassDate
      ? new Date(b.date || b.nextClassDate || b.schedule?.nextClassDate)
      : calculateNextClassDate(rawDayB, startTimeB)

    const timeA = dateA ? dateA.getTime() : Infinity
    const timeB = dateB ? dateB.getTime() : Infinity

    return timeA - timeB
  })

  return (
    <>
      <article className="profile-card" style={{ marginTop: '1.5rem' }}>
        <h2 className="profile-section-title">
          <span className="profile-section-icon">🗓️</span>
          {t('sections.myClasses')}
        </h2>

        {sortedInscriptions.length === 0 ? (
          <div className="profile-empty-state">
            <span className="profile-empty-icon">🏋️</span>
            <h3 className="profile-empty-title">{t('classes.noClassesTitle')}</h3>
            <p className="profile-empty-desc">{t('classes.noClassesDesc')}</p>
            <Button size="sm" onClick={() => navigate('/classes')}>
              {t('classes.exploreClasses')} →
            </Button>
          </div>
        ) : (
          <div className="profile-classes-list">
            {sortedInscriptions.map((item, idx) => (
              <ClassItem
                key={item.id || item.scheduleId || idx}
                item={item}
                onCancelClick={(cls) => setSelectedClass(cls)}
              />
            ))}
          </div>
        )}
      </article>

      <CancelClassModal
        isOpen={Boolean(selectedClass)}
        classData={selectedClass}
        onClose={() => setSelectedClass(null)}
        onConfirm={handleCancelConfirm}
        loading={canceling}
      />
    </>
  )
}

export default MyClassesCard
