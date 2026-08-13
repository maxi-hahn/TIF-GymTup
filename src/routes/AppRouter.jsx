import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/shared/layouts/MainLayout'
import AuthLayout from '@/shared/layouts/AuthLayout'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import HomePage from '@/features/home/pages/HomePage'
import LoginPage from '@/features/auth/pages/LoginPage'
import ClassesPage from '@/features/classes/pages/ClassesPage'
import PlansPage from '@/features/plans/pages/PlansPage'
import ProfilePage from '@/features/profile/pages/ProfilePage'
import AdminPlansPage from '@/features/admin/pages/AdminPlansPage'
import UserRolesPage from '@/features/admin/pages/UserRolesPage'

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin-only routes */}
      <Route element={<RoleRoute allowedRoles={['Admin', 'SysAdmin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin/plans" element={<AdminPlansPage />} />
        </Route>
      </Route>

      {/* SysAdmin-only routes */}
      <Route element={<RoleRoute allowedRoles={['SysAdmin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin/roles" element={<UserRolesPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRouter
