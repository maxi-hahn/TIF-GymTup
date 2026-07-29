import ClassCard from './ClassCard'
import './ClassCatalog.css'
const ClassCatalog = ({ classes }) => {
  if (classes.length === 0) {return <p>No classes available.</p>}
  return (   
    <section className='class-catalog'>
      {classes.map((gymClass) => (
        <ClassCard
          key={gymClass.id}
          gymClass={gymClass}
        />
      ))}
    </section>
  )
}

export default ClassCatalog