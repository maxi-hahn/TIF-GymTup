import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import planService from '@/shared/services/planService'
import userService from '@/shared/services/userService'
import PlanCard from '@/features/plans/components/PlanCard'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'
import { useAuth } from '@/shared/contexts/AuthContext'
import './PlansPage.css'

const faqs = [
  { q: 'faqQ1', a: 'faqA1' },
  { q: 'faqQ2', a: 'faqA2' },
  { q: 'faqQ3', a: 'faqA3' },
]

const PlansPage = () => {
  const { t } = useTranslation('plans')
  const { user, isAuthenticated } = useAuth()
  const [plans, setPlans] = useState([])
  const [myPlan, setMyPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const isClient = user?.rol === 'Client'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansData = await planService.getPlans()
        setPlans(plansData)
      } catch {
        toast.error(t('loadingError'))
        setLoadError(true)
        setLoading(false)
        return
      }

      // Solo intentar obtener plan si está autenticado
      if (isAuthenticated && isClient) {
        try {
          const myPlanData = await userService.getMyPlanStatus()
          setMyPlan(myPlanData)
        } catch {
          setMyPlan(null)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [t, isAuthenticated, isClient])

  if (loading) return <LoadingSpinner />
  if (loadError) return <EmptyState message={t('loadingError')} />

  return (
    <main className="plans-page">
      <section className="plans-hero">
        <div className="plans-hero-content">
          <span className="plans-hero-badge">{t('heroBadge')}</span>
          <h1 className="plans-hero-title">{t('heroTitle')}</h1>
          <p className="plans-hero-description">{t('heroDescription')}</p>
        </div>
      </section>

      {isClient && myPlan?.planId && (
        <section className="plan-change-info">
          <div className="plan-change-info-icon">💡</div>
          <div className="plan-change-info-content">
            <h3 className="plan-change-info-title">{t('planChangeInfoTitle')}</h3>
            <p className="plan-change-info-text">{t('planChangeInfoText')}</p>
          </div>
        </section>
      )}

      <section className="plans-grid-section">
        <div className="plans-grid-container">
          {plans.length === 0 ? (
            <EmptyState message={t('noPlansAvailable')} />
          ) : (
            <div className="plans-grid">
              {plans.map((plan) => (
                <PlanCard
                    key={plan.id}
                    plan={plan}
                    isMyActivePlan={myPlan?.isActive && myPlan?.planId === plan.id}
                    hasActivePlan={myPlan?.isActive ?? false}
                    currentPlanValue={myPlan?.planValue || 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="plans-faq-section">
        <div className="plans-faq-container">
          <h2 className="plans-faq-title">{t('faqTitle')}</h2>
          <div className="plans-faq-list">
            {faqs.map((faq) => (
              <div key={faq.q} className="plans-faq-item">
                <h3 className="plans-faq-question">{t(faq.q)}</h3>
                <p className="plans-faq-answer">{t(faq.a)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default PlansPage