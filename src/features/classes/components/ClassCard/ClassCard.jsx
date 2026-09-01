import { useState, useEffect } from 'react'
import ClassCardFront from './ClassCardFront'
import ClassCardBack from './ClassCardBack'
import './ClassCard.css'
import ClassManagementModal from '@/shared/components/modals/ClassManagementModal'

const ClassCard = ({
  gymClass,
  onEnroll,
  onCancel,
  loadingSchedule,
  isAdmin,
  onDisable,
  onDelete,
  onToggleScheduleStatus,
  onDeleteSchedule,
  onEditSchedule,
  onCreateSchedule,
  onUpdateCapacity
}) => {
  const [showBack, setShowBack] = useState(false)
  const [showManagementModal, setShowManagementModal] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDisable = async () => {
    await onDisable()
    setShowManagementModal(false)
  }

  const handleDelete = async () => {
    await onDelete()
    setShowManagementModal(false)
  }

  return (
    <article className={`class-card ${showBack ? 'is-flipped' : ''} ${isMobile ? 'is-mobile' : ''}`}>
      <div className="class-card-inner"> 
        {showBack ? (
          <ClassCardBack
            gymClass={gymClass}
            onBack={() => setShowBack(false)}
            onEnroll={onEnroll}
            onCancel={onCancel}
            loadingSchedule={loadingSchedule}
            classIsActive={gymClass.isActive}
            isAdmin={isAdmin}
            onToggleScheduleStatus={onToggleScheduleStatus}
            onDeleteSchedule={onDeleteSchedule}
            onEditSchedule={onEditSchedule}
            onCreateSchedule={onCreateSchedule}
            onUpdateCapacity={onUpdateCapacity}
          />
        ) : (
          <ClassCardFront
            gymClass={gymClass}
            onMoreInfo={() => setShowBack(true)}
            isAdmin={isAdmin}
            onManage={() => setShowManagementModal(true)}
          />
        )}

        {showManagementModal && (
          <ClassManagementModal
            gymClass={gymClass}
            onDisable={handleDisable}
            onDelete={handleDelete}
            onClose={() => setShowManagementModal(false)}
          />
        )}
      </div>
    </article>
  )
}

export default ClassCard