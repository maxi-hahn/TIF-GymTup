import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import userService from '@/shared/services/userService'
import ConfirmationModal from '@/shared/components/modals/ConfirmationModal'
import { useAuth } from '@/shared/contexts/AuthContext'
import './PlanCard.css'

const PlanCard = ({ plan, isMyActivePlan, hasActivePlan, currentPlanValue = 0 }) => {
    const { t } = useTranslation('plans')
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [loading, setLoading] = useState(false)
    const [showChangeModal, setShowChangeModal] = useState(false)

    const isUpgrade = hasActivePlan && plan.value > currentPlanValue
    const isDowngrade = hasActivePlan && !isMyActivePlan && plan.value <= currentPlanValue

    const handleBuyClick = () => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        if (isDowngrade) return
        if (hasActivePlan && isUpgrade) {
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
            } else if (err.response?.status === 400) {
                toast.error(t('downgradeNotAllowed'))
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
                ) : isDowngrade ? (
                    <button 
                        className="plan-card-button plan-card-button-disabled"
                        disabled
                    >
                        {t('downgradeNotAllowed')}
                    </button>
                ) : (
                    <button 
                        className="plan-card-button"
                        onClick={handleBuyClick} 
                        disabled={loading}
                    >
                        {loading 
                            ? t('redirecting')
                            : isUpgrade
                                ? t('upgradePlan')
                                : t('buyPlan')}
                    </button>
                )}
            </article>

            <ConfirmationModal
                isOpen={showChangeModal}
                title={t('upgradeModalTitle')}
                message={t('upgradeModalMessage')}
                confirmText={t('confirmChange')}
                cancelText={t('cancel')}
                onConfirm={handleBuy}
                onCancel={() => setShowChangeModal(false)}
            />
        </>
    )
}

export default PlanCard