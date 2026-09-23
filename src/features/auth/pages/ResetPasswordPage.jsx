import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import authService from '@/shared/services/authService'
import SubmitButton from '@/shared/components/SubmitButton'
import '@/shared/layouts/AuthLayout.css'

const ResetPasswordPage = () => {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const resetPasswordSchema = z
    .object({
      password: z.string().min(8, t('passwordMin')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordsDontMatch'),
      path: ['confirmPassword'],
    })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  })

  const onSubmit = async (formData) => {
    try {
      await authService.resetPassword(token, formData.password)
      toast.success(t('resetPasswordSuccess'))
      navigate('/login')
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(t('resetTokenInvalid'))
      } else {
        toast.error(t('resetPasswordError'))
      }
    }
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">{t('resetTokenMissing')}</h1>
          <p className="auth-subtitle">{t('resetTokenMissingMessage')}</p>
          <p className="auth-footer">
            <Link to="/forgot-password">{t('requestNewLink')}</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{t('resetPasswordTitle')}</h1>
        <p className="auth-subtitle">{t('resetPasswordSubtitle')}</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-field">
            <label htmlFor="password">{t('newPassword')}</label>
            <input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">{t('confirmNewPassword')}</label>
            <input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} />
            {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword.message}</span>}
          </div>

          <SubmitButton className="auth-submit" loading={isSubmitting} loadingText={t('resetting')}>
            {t('resetPasswordButton')}
          </SubmitButton>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage