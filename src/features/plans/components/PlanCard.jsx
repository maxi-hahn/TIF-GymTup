import { useState } from 'react'
import toast from 'react-hot-toast'
import userService from '@/shared/services/userService'
// import './PlanCard.css'  // Si tienes CSS para PlanCard

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

    // Función para mostrar beneficios
    const renderBenefits = () => {
        if (!plan.benefits || plan.benefits.trim() === '') return null
        
        const benefitsList = plan.benefits
            .split(',')
            .map(benefit => benefit.trim())
            .filter(benefit => benefit !== '')

        if (benefitsList.length === 0) return null

        return (
            <div className="plan-benefits">
                <h4>Beneficios incluidos:</h4>
                <ul>
                    {benefitsList.map((benefit, index) => (
                        <li key={index}>✓ {benefit}</li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className="plan-card">
            <h3 className="plan-name">{plan.name}</h3>
            <p className="plan-price">${plan.value}</p>
            
            <p className="plan-classes">
                {plan.isUnlimited
                    ? 'Clases ilimitadas'
                    : `Hasta ${plan.max_Class} clases por mes`}
            </p>

            {/* Mostrar beneficios */}
            {renderBenefits()}

            {isMyActivePlan ? (
                <p className="plan-active-badge">Plan activo</p>
            ) : (
                <button 
                    className="plan-buy-button"
                    onClick={handleBuy} 
                    disabled={loading}
                >
                    {loading 
                        ? 'Redirigiendo...' 
                        : hasActivePlan 
                            ? 'Cambiar a este plan' 
                            : 'Comprar'}
                </button>
            )}
        </div>
    )
}

export default PlanCard