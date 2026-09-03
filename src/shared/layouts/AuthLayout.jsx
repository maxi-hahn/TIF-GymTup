import { Outlet } from 'react-router-dom'
import './AuthLayout.css'

const AuthLayout = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
