import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import authService from '@/shared/services/authService'
import SubmitButton from '@/shared/components/SubmitButton'
import '@/shared/layouts/AuthLayout.css'

const ForgotPasswordPage = () => {
  const { t } = useTranslation('auth')
  const [emailSent, setEmailSent] = useState(false)

  const forgotPasswordSchema = z.object({
    email: z.string().min(1, t('emailRequired')).email(t('emailInvalid')),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (formData) => {
    try {
      await authService.forgotPassword(formData.email)
      setEmailSent(true)
    } catch {
      toast.error(t('forgotPasswordError'))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {emailSent ? (
          <>
            <h1 className="auth-title">{t('checkYourEmail')}</h1>
            <p className="auth-subtitle">{t('forgotPasswordSentMessage')}</p>

            <p className="auth-footer">
              <Link to="/login">{t('backToLogin')}</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="auth-title">{t('forgotPasswordTitle')}</h1>
            <p className="auth-subtitle">{t('forgotPasswordSubtitle')}</p>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="auth-field">
                <label htmlFor="email">{t('email')}</label>
                <input id="email" type="email" {...register('email')} />
                {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
              </div>

              <SubmitButton className="auth-submit" loading={isSubmitting} loadingText={t('sending')}>
                {t('sendResetLink')}
              </SubmitButton>
            </form>

            <p className="auth-footer">
              <Link to="/login">{t('backToLogin')}</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage