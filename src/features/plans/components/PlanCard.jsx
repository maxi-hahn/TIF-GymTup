import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import userService from '@/shared/services/userService'
import ConfirmationModal from '@/shared/components/modals/ConfirmationModal'
import './PlanCard.css'

const PlanCard = ({ plan, isMyActivePlan, hasActivePlan }) => {
    const { t } = useTranslation('plans')
    const [loading, setLoading] = useState(false)
    const [showChangeModal, setShowChangeModal] = useState(false)

    const handleBuyClick = () => {
        if (hasActivePlan) {
            setShowChangeModal(true)
        } else {
            handleBuy()
        }
    }

    const handleBuy = async () => {
        setShowChangeModal(false)
        setLoading(true)
        try {
            const { paymentUrl } = await userService.buyPlan(plan.id)
            window.location.href = paymentUrl
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error(t('adminCannotBuy'))
            } else {
                toast.error(t('buyError'))
            }
            setLoading(false)
        }
    }

    const renderBenefits = () => {
        if (!plan.benefits || plan.benefits.trim() === '') return null
        
        const benefitsList = plan.benefits
            .split(',')
            .map(benefit => benefit.trim())
            .filter(benefit => benefit !== '')

        if (benefitsList.length === 0) return null

        return (
            <ul className="plan-card-benefits-list">
                {benefitsList.map((benefit, index) => (
                    <li key={index} className="plan-card-benefit-item">
                        <span className="plan-card-benefit-check">✓</span>
                        <span>{benefit}</span>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <>
            <article className={`plan-card ${isMyActivePlan ? 'plan-card-active' : ''}`}>
                {isMyActivePlan && (
                    <span className="plan-card-badge">
                        {t('activePlan')}
                    </span>
                )}

                <h3 className="plan-card-name">{plan.name}</h3>
                
                <p className="plan-card-classes">
                    {plan.isUnlimited
                        ? t('unlimitedClasses')
                        : t('classesPerMonth', { count: plan.max_Class })}
                </p>

                <div className="plan-card-price-row">
                    <span className="plan-card-price">
                        ${plan.value.toLocaleString('es-AR')}
                    </span>
                    <span className="plan-card-price-period">/ {t('month')}</span>
                </div>

                {renderBenefits()}

                {isMyActivePlan ? (
                    <p className="plan-card-active-indicator">
                        {t('planActiveIndicator')}
                    </p>
                ) : (
                    <button 
                        className="plan-card-button"
                        onClick={handleBuyClick} 
                        disabled={loading}
                    >
                        {loading 
                            ? t('redirecting')
                            : hasActivePlan 
                                ? t('changePlan')
                                : t('buyPlan')}
                    </button>
                )}
            </article>

            {/* Modal de confirmación de cambio */}
            <ConfirmationModal
                isOpen={showChangeModal}
                title={t('changePlanTitle')}
                message={t('changePlanMessage', { planName: plan.name })}
                confirmText={t('confirmChange')}
                cancelText={t('cancel')}
                onConfirm={handleBuy}
                onCancel={() => setShowChangeModal(false)}
            />
        </>
    )
}

export default PlanCard