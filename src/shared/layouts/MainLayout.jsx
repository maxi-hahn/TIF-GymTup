import { Outlet } from 'react-router-dom'
import Navbar from '@/shared/components/Navbar'
import Footer from '@/shared/components/Footer'
import "./Layouts.css"
const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
