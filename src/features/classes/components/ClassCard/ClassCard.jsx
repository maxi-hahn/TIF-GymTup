import { useState } from 'react'
import ClassCardFront from './ClassCardFront'
import ClassCardBack from './ClassCardBack'
import './ClassCard.css'

const ClassCard = ({ gymClass, onEnroll, onCancel, loadingSchedule }) => {
    const [showBack, setShowBack] = useState(false)
  
    return (
      <article className='class-card'>
        {showBack ? (
          <ClassCardBack
            gymClass={gymClass}
            onBack={() => setShowBack(false)}
            onEnroll={onEnroll}
            onCancel={onCancel}
            loadingSchedule={loadingSchedule}
          />
        ) : (
          <ClassCardFront
            gymClass={gymClass}
            onMoreInfo={() => setShowBack(true)}
          />
        )}
      </article>
    )
  }
  export default ClassCard