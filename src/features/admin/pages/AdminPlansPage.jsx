import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import planService from '@/shared/services/planService'
import PlanTable from '@/features/admin/components/PlanTable'
import PlanFormModal from '@/features/admin/components/PlanFormModal'
import ConfirmationModal from '@/shared/components/modals/ConfirmationModal'
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
    const [deletingPlan, setDeletingPlan] = useState(null)

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

    const handleDeleteClick = (plan) => {
        setDeletingPlan(plan)
    }

    const handleConfirmDelete = async () => {
        if (!deletingPlan) return
        try {
            await planService.deletePlan(deletingPlan.id)
            toast.success(t('table.deleteSuccess'))
            fetchPlans()
        } catch {
            toast.error(t('table.deleteError'))
        } finally {
            setDeletingPlan(null)
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
                    <PlanTable plans={plans} onEdit={handleEdit} onDelete={handleDeleteClick} />
                )}

                {modalOpen && (
                    <PlanFormModal
                        plan={editingPlan}
                        onClose={handleModalClose}
                        onSaved={handleSaved}
                    />
                )}

                <ConfirmationModal
                    isOpen={!!deletingPlan}
                    title={deletingPlan ? `${t('table.delete')} "${deletingPlan.name}"` : ''}
                    message={t('table.deleteConfirm', { name: deletingPlan?.name ?? '' })}
                    confirmText={t('table.delete')}
                    cancelText={t('form.cancel')}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeletingPlan(null)}
                />
            </div>
        </div>
    )
}

export default AdminPlansPage