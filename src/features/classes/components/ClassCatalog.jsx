import ClassCard from './ClassCard'
import './ClassCatalog.css'
import EmptyState from './EmptyState'
const ClassCatalog = ({ classes, onEnroll, onCancel, loadingSchedule }) => {
  if (classes.length === 0) {return <EmptyState />}
  return (   
    <section className='class-catalog'>
      {classes.map((gymClass) => (
        <ClassCard
          key={gymClass.id}
          gymClass={gymClass}
          onEnroll={onEnroll}
          onCancel={onCancel}
          loadingSchedule={loadingSchedule}
        />
      ))}
    </section>
  )
}

export default ClassCatalog