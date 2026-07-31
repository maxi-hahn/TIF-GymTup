import { useState, useEffect } from 'react'
import planService from '@/shared/services/planService'
import PlanTable from '@/features/admin/components/PlanTable'
import PlanFormModal from '@/features/admin/components/PlanFormModal'

const AdminPlansPage = () => {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingPlan, setEditingPlan] = useState(null)

    const fetchPlans = async () => {
        try {
            const data = await planService.getPlans()
            setPlans(data)
        } catch {
            setError('No se pudieron cargar los planes.')
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
            fetchPlans()
        } catch {
            setError('No se pudo eliminar el plan.')
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

    if (loading) return <p>Cargando planes...</p>
    if (error) return <p>{error}</p>

    return (
        <div>
            <h1>Gestión de Planes</h1>
            <button onClick={handleNew}>Nuevo plan</button>

            <PlanTable plans={plans} onEdit={handleEdit} onDelete={handleDelete} />

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