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
import PaymentSuccessPage from '@/features/payments/pages/PaymentSuccessPage'
import NotFoundPage from '@/features/notFound/pages/NotFoundPage'
import ForbiddenPage from '@/features/notFound/pages/ForbiddenPage'
import ScrollToTop from '@/shared/components/ScrollToTop'

const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes - Login */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* PUBLIC routes - Visible for everyone */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/failure" element={<PaymentSuccessPage />} />
          <Route path="/payment/pending" element={<PaymentSuccessPage />} />
          <Route path="/403" element={<ForbiddenPage />} />
        </Route>

        {/* PROTECTED routes - Only authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
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

        {/* 404 - Not Found */}
        <Route element={<MainLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default AppRouter