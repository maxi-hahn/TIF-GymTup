import { useState } from 'react'
import ClassCardFront from './ClassCardFront'
import ClassCardBack from './ClassCardBack'
import './ClassCard.css'

const ClassCard = ({ gymClass }) => {
    const [showBack, setShowBack] = useState(false)
  
    return (
      <article className='class-card'>
        {showBack ? (
          <ClassCardBack
            gymClass={gymClass}
            onBack={() => setShowBack(false)}
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