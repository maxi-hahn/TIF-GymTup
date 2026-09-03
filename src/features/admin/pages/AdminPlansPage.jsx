import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import planService from '@/shared/services/planService'
import PlanTable from '@/features/admin/components/PlanTable'
import PlanFormModal from '@/features/admin/components/PlanFormModal'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'
import './AdminPlansPage.css'

const AdminPlansPage = () => {
    const { t } = useTranslation('admin')
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingPlan, setEditingPlan] = useState(null)

    const fetchPlans = async () => {
        try {
            const data = await planService.getPlans()
            setPlans(data)
        } catch {
            toast.error(t('loadErrorToast'))
            setLoadError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPlans()
    }, [])

    const handleNew = () => {
        setEditingPlan(null)
        setModalOpen(true)
    }

    const handleEdit = (plan) => {
        setEditingPlan(plan)
        setModalOpen(true)
    }

    const handleDelete = async (plan) => {
        const confirmDelete = window.confirm(t('table.deleteConfirm', { name: plan.name }))
        if (!confirmDelete) return

        try {
            await planService.deletePlan(plan.id)
            toast.success(t('table.deleteSuccess'))
            fetchPlans()
        } catch {
            toast.error(t('table.deleteError'))
        }
    }

    const handleModalClose = () => {
        setModalOpen(false)
        setEditingPlan(null)
    }

    const handleSaved = () => {
        setModalOpen(false)
        setEditingPlan(null)
        fetchPlans()
    }

    if (loading) return <LoadingSpinner />
    if (loadError) return <EmptyState message={t('loadError')} />

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header">
                    <h1 className="admin-title">{t('plansTitle')}</h1>
                    <button className="admin-new-button" onClick={handleNew}>{t('newPlan')}</button>
                </div>

                {plans.length === 0 ? (
                    <EmptyState message={t('emptyPlans')} />
                ) : (
                    <PlanTable plans={plans} onEdit={handleEdit} onDelete={handleDelete} />
                )}

                {modalOpen && (
                    <PlanFormModal
                        plan={editingPlan}
                        onClose={handleModalClose}
                        onSaved={handleSaved}
                    />
                )}
            </div>
        </div>
    )
}

export default AdminPlansPage