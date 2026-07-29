import { useEffect, useState } from 'react'
import ClassCatalog from '../components/ClassCatalog'
import classService from '@/shared/services/classService'

const ClassesPage = () => {
  const [classes, setClasses] = useState([])



  useEffect(() => {
    const fetchClasses = async () => {
        try {
            const data = await classService.getClasses()
            setClasses(data)
        } catch (error) {
            console.error(error)
        }
    }

    fetchClasses()
}, [])
  return (
    <>
      <h1>Classes</h1>

      <ClassCatalog classes={classes} />
    </>
  )
}

export default ClassesPage