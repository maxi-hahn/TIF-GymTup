import { useState, useEffect } from 'react'
import planService from '@/shared/services/planService'
import userService from '@/shared/services/userService'
import PlanCard from '@/features/plans/components/PlanCard'

const PlansPage = () => {
    const [plans, setPlans] = useState([])
    const [myPlan, setMyPlan] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [plansData, myPlanData] = await Promise.all([
                    planService.getPlans(),
                    userService.getMyPlanStatus(),
                ])
                setPlans(plansData)
                setMyPlan(myPlanData)
            } catch (err) {
                console.log('error real:', err)
                setError('No se pudieron cargar los planes.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <p>Cargando planes...</p>
    if (error) return <p>{error}</p>

    return (
        <div>
            <h1>Plans Page</h1>
            <p>Choose the best membership plan for you.</p>

            <div>
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        isMyActivePlan={myPlan?.isActive && myPlan?.planId === plan.id}
                        hasActivePlan={myPlan?.isActive ?? false}
                    />
                ))}
            </div>
        </div>
    )
}

export default PlansPage