import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext'

const RoleRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth()

    if (loading) return null

    if (!isAuthenticated) return <Navigate to="/login" replace />

    if (!allowedRoles.includes(user.rol)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default RoleRoute