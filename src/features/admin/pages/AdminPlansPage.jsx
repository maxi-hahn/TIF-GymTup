import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import planService from '@/shared/services/planService'
import PlanTable from '@/features/admin/components/PlanTable'
import PlanFormModal from '@/features/admin/components/PlanFormModal'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

const AdminPlansPage = () => {
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
            toast.error('No se pudieron cargar los planes.')
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
        const confirmDelete = window.confirm(
            `¿Seguro que querés eliminar el plan "${plan.name}"? Esta acción no se puede deshacer.`
        )
        if (!confirmDelete) return

        try {
            await planService.deletePlan(plan.id)
            toast.success('Plan eliminado correctamente.')
            fetchPlans()
        } catch {
            toast.error('No se pudo eliminar el plan.')
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
    if (loadError) return <EmptyState message="No se pudieron cargar los planes. Intentá recargar la página." />

    return (
        <div>
            <h1>Gestión de Planes</h1>
            <button onClick={handleNew}>Nuevo plan</button>

            {plans.length === 0 ? (
                <EmptyState message="Todavía no hay planes cargados." />
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
    )
}

export default AdminPlansPage