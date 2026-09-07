import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import authService from '@/shared/services/authService'
import { useAuth } from '@/shared/contexts/AuthContext'
import '../verification.css'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation('verification')
  const { user, updateUser } = useAuth()
  const token = searchParams.get('token')
  const hasCalledRef = useRef(false)

  useEffect(() => {
    if (hasCalledRef.current) return
    hasCalledRef.current = true

    let isMounted = true

    const verify = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (user?.emailVerified === true || storedUser?.emailVerified === true) {
        if (isMounted) navigate('/email-verified', { replace: true })
        return
      }

      if (!token) {
        if (isMounted) navigate('/email-verification-failed', { replace: true })
        return
      }

      try {
        await authService.verifyEmail(token)
        updateUser({ emailVerified: true })
        await new Promise((resolve) => setTimeout(resolve, 500))
        if (isMounted) {
          navigate('/email-verified', { replace: true })
        }
      } catch (err) {
        console.error('Email verification error:', err)
        const checkUser = JSON.parse(localStorage.getItem('user') || '{}')
        if (user?.emailVerified === true || checkUser?.emailVerified === true) {
          if (isMounted) navigate('/email-verified', { replace: true })
        } else {
          if (isMounted) navigate('/email-verification-failed', { replace: true })
        }
      }
    }

    verify()

    return () => {
      isMounted = false
    }
  }, [token, navigate, updateUser, user?.emailVerified])

  return (
    <div className="verification-page">
      <div className="verification-card">
        <div className="verification-spinner" />
        <h2 className="verification-title">{t('verifying')}</h2>
      </div>
    </div>
  )
}

export default VerifyEmailPage
