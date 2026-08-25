import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '@/shared/components/Button'
import userService from '@/shared/services/userService'
import RemovePlanModal from './RemovePlanModal'

const PlanCard = ({ planInfo, userId, onPlanUpdated }) => {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [removing, setRemoving] = useState(false)

  const hasPlan = Boolean(planInfo?.planId || planInfo?.planName)

  const handleRemovePlan = async () => {
    setRemoving(true)
    try {
      if (userId) {
        await userService.removeUserPlan(userId)
      }
      toast.success(t('toasts.planRemoved'))
      setShowRemoveModal(false)
      if (onPlanUpdated) onPlanUpdated()
    } catch (err) {
      toast.error(t('toasts.planRemoveError'))
    } finally {
      setRemoving(false)
    }
  }

  if (!hasPlan) {
    return (
      <article className="profile-card">
        <h2 className="profile-section-title">
          <span className="profile-section-icon">💳</span>
          {t('sections.currentPlan')}
        </h2>
        <div className="profile-empty-state">
          <span className="profile-empty-icon">🎟️</span>
          <h3 className="profile-empty-title">{t('plan.noActivePlan')}</h3>
          <p className="profile-empty-desc">{t('plan.noActivePlanDesc')}</p>
          <Button size="sm" onClick={() => navigate('/plans')}>
            {t('plan.explorePlans')} →
          </Button>
        </div>
      </article>
    )
  }

  const isUnlimited = planInfo?.planIsUnlimited
  const classesRemaining = planInfo?.classesRemaining ?? planInfo?.planMaxClass ?? 0

  return (
    <>
      <article className="profile-card">
        <div className="profile-plan-header">
          <h2 className="profile-section-title" style={{ margin: 0 }}>
            <span className="profile-section-icon">💳</span>
            {t('sections.currentPlan')}
          </h2>
          <span className="profile-badge profile-badge-active">
            ● {t('plan.activeStatus')}
          </span>
        </div>

        <h3 className="profile-plan-name">{planInfo.planName}</h3>

        {planInfo.planPrice && (
          <div className="profile-plan-price-row">
            <span className="profile-plan-price">${planInfo.planPrice.toLocaleString('es-AR')}</span>
            <span className="profile-plan-period">{t('plan.perMonth')}</span>
          </div>
        )}

        <div className="profile-plan-details-grid">
          <div className="profile-plan-detail-item">
            <span className="profile-info-label">{t('plan.classesRemaining')}</span>
            <span className="profile-info-value" style={{ color: '#24d1a7', fontWeight: 700 }}>
              {isUnlimited ? t('plan.unlimited') : classesRemaining}
            </span>
          </div>

          {planInfo.startDate && (
            <div className="profile-plan-detail-item">
              <span className="profile-info-label">{t('plan.startDate')}</span>
              <span className="profile-info-value">{new Date(planInfo.startDate).toLocaleDateString()}</span>
            </div>
          )}

          {planInfo.endDate && (
            <div className="profile-plan-detail-item">
              <span className="profile-info-label">{t('plan.endDate')}</span>
              <span className="profile-info-value">{new Date(planInfo.endDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {planInfo.benefits && planInfo.benefits.length > 0 && (
          <ul className="profile-plan-benefits-list">
            {planInfo.benefits.map((benefit, idx) => (
              <li key={idx}>✓ {benefit}</li>
            ))}
          </ul>
        )}

        <div className="profile-plan-actions">
          <Button size="sm" onClick={() => navigate('/plans')}>
            {t('plan.changePlan')}
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setShowRemoveModal(true)}>
            {t('plan.removePlan')}
          </Button>
        </div>
      </article>

      <RemovePlanModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={handleRemovePlan}
        loading={removing}
      />
    </>
  )
}

export default PlanCard
