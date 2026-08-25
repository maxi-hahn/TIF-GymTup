import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/shared/contexts/AuthContext'
import userService from '@/shared/services/userService'
import inscriptionService from '@/shared/services/inscriptionService'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import ProfileInfoCard from '../components/ProfileInfoCard'
import PlanCard from '../components/PlanCard'
import MyClassesCard from '../components/MyClassesCard'
import '../profile.css'

const ProfilePage = () => {
  const { t } = useTranslation('profile')
  const { user, updateUser } = useAuth()
  const [planInfo, setPlanInfo] = useState(null)
  const [inscriptions, setInscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProfileData = useCallback(async () => {
    setLoading(true)
    try {
      if (user?.rol === 'Client') {
        const [planData, inscriptionsData] = await Promise.allSettled([
          userService.getMyPlanStatus(),
          inscriptionService.getMyInscriptions()
        ])

        if (planData.status === 'fulfilled') {
          setPlanInfo(planData.value)
        }
        if (inscriptionsData.status === 'fulfilled') {
          setInscriptions(Array.isArray(inscriptionsData.value) ? inscriptionsData.value : [])
        }
      }
    } catch (err) {
      console.error('Error loading profile data:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.rol])

  useEffect(() => {
    loadProfileData()
  }, [loadProfileData])

  if (loading) {
    return (
      <div className="profile-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <h1 className="profile-header-title">{t('title')}</h1>
          <p className="profile-header-subtitle">{t('subtitle')}</p>
        </header>

        <div className="profile-grid-top">
          <ProfileInfoCard user={user} updateUser={updateUser} />
          <PlanCard
            planInfo={planInfo}
            userId={user?.id}
            onPlanUpdated={loadProfileData}
          />
        </div>

        <MyClassesCard
          inscriptions={inscriptions}
          onClassesUpdated={loadProfileData}
        />
      </div>
    </main>
  )
}

export default ProfilePage