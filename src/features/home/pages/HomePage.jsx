import { HeroSection } from '../components/HeroSection'
import { FacilitiesSection } from '../components/FacilitiesSection'
import { ClassesSection } from '../components/ClassesSection'
import { MachinesSection } from '../components/MachinesSection'
import { CtaSection } from '../components/CtaSection'
import '../home.css'

const HomePage = () => {
  return (
    <div className="home-page-container">
      <HeroSection />
      <FacilitiesSection />
      <ClassesSection />
      <MachinesSection />
      <CtaSection />
    </div>
  )
}

export default HomePage
