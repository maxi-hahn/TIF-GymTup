import { useEffect } from 'react'
import classService from '@/shared/services/classService'

const ClassesPage = () => {
  useEffect(() => {
    loadClasses()
  }, [])
  const [classes, setClasses] = useState([])
  const loadClasses = async () => {
    try {
      const data = await classService.getClasses()
      setClasses(data)
    } catch (error) {
      console.error(error)
    }
  }

  return <h1>Classes</h1>
}

export default ClassesPage