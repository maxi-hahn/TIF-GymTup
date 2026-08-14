import ClassCard from './ClassCard'
import CreateClassCard from './CreateClassCard'
import './ClassCatalog.css'
import EmptyState from './EmptyState'

const ClassCatalog = ({
  classes,
  onEnroll,
  onCancel,
  loadingSchedule,
  isAdmin,
  onDisable,
  onDelete,
  onEditSchedule,
  onToggleScheduleStatus,
  onDeleteSchedule,
  onCreateClass,
  onCreateSchedule,
  onUpdateCapacity
}) => {
  return (
    <section className="class-catalog">
      
      {/* Create Class Card - Only visible for admin */}
      {isAdmin && (
        <CreateClassCard 
          isAdmin={isAdmin}
          onCreateClass={onCreateClass}
        />
      )}

      {classes.length === 0 && !isAdmin ? (
        <EmptyState />
      ) : (
        classes.map((gymClass) => (
          <ClassCard
            key={gymClass.id}
            gymClass={gymClass}
            onEnroll={onEnroll}
            onCancel={onCancel}
            loadingSchedule={loadingSchedule}
            isAdmin={isAdmin}
            onDisable={() => onDisable(gymClass)}
            onDelete={() => onDelete(gymClass)}
            onEditSchedule={onEditSchedule}
            onToggleScheduleStatus={onToggleScheduleStatus}
            onDeleteSchedule={onDeleteSchedule}
            onCreateSchedule={onCreateSchedule}
            onUpdateCapacity={onUpdateCapacity}
          />
        ))
      )}
    </section>
  )
}

export default ClassCatalog