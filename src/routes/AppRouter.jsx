import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/shared/layouts/MainLayout'
import AuthLayout from '@/shared/layouts/AuthLayout'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '@/features/home/pages/HomePage'
import LoginPage from '@/features/auth/pages/LoginPage'
import ClassesPage from '@/features/classes/pages/ClassesPage'
import PlansPage from '@/features/plans/pages/PlansPage'

function AppRouter() {
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
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRouter
