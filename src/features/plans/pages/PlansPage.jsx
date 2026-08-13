import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import planService from '@/shared/services/planService'
import userService from '@/shared/services/userService'
import PlanCard from '@/features/plans/components/PlanCard'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

const PlansPage = () => {
  const [plans, setPlans] = useState([])
  const [myPlan, setMyPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansData = await planService.getPlans()
        setPlans(plansData)
      } catch (err) {
        console.log('error real:', err)
        toast.error('No se pudieron cargar los planes.')
        setLoadError(true)
        setLoading(false)
        return
      }

      try {
        const myPlanData = await userService.getMyPlanStatus()
        setMyPlan(myPlanData)
      } catch {
        // Si falla (ej: un Admin viendo esta página, sin rol Client), no mostramos "plan activo"
        setMyPlan(null)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (loadError) return <EmptyState message="No se pudieron cargar los planes. Intentá recargar la página." />

  return (
      <div>
          {plans.length === 0 ? (
              <EmptyState message="Todavía no hay planes disponibles." />
          ) : (
              plans.map((plan) => (
                  <PlanCard
                      key={plan.id}
                      plan={plan}
                      isMyActivePlan={myPlan?.isActive && myPlan?.planId === plan.id}
                      hasActivePlan={myPlan?.isActive ?? false}
                  />
              ))
          )}
      </div>
  )
}

export default PlansPage