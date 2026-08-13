import { useState } from 'react'
import toast from 'react-hot-toast'
import userService from '@/shared/services/userService'

const PlanCard = ({ plan, isMyActivePlan, hasActivePlan }) => {
    const [loading, setLoading] = useState(false)

    const handleBuy = async () => {
        if (hasActivePlan) {
            const confirmChange = window.confirm(
                `¿Seguro que querés cambiar tu plan actual por "${plan.name}"?`
            )
            if (!confirmChange) return
        }

        setLoading(true)
        try {
            const { paymentUrl } = await userService.buyPlan(plan.id)
            window.location.href = paymentUrl
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error('Los administradores no pueden comprar planes. Iniciá sesión con una cuenta de cliente.')
            } else {
                toast.error('No se pudo iniciar la compra. Intentá de nuevo.')
            }
            setLoading(false)
        }
    }

    return (
        <div>
            <h3>{plan.name}</h3>
            <p>${plan.value}</p>
            <p>
                {plan.isUnlimited
                    ? 'Clases ilimitadas'
                    : `Hasta ${plan.max_Class} clases por mes`}
            </p>

            {isMyActivePlan ? (
                <p>Plan activo</p>
            ) : (
                <button onClick={handleBuy} disabled={loading}>
                    {loading ? 'Redirigiendo...' : hasActivePlan ? 'Cambiar a este plan' : 'Comprar'}
                </button>
            )}
        </div>
    )
}

export default PlanCard