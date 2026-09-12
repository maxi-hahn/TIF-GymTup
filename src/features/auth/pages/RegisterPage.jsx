import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import authService from '@/shared/services/authService'
import SubmitButton from '@/shared/components/SubmitButton'
import '@/shared/layouts/AuthLayout.css'

const RegisterPage = () => {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()

  const registerSchema = z.object({
    name: z.string().min(1, t('nameRequired')).max(50, t('nameMax')),
    email: z.string().min(1, t('emailRequired')).email(t('emailInvalid')),
    dni: z.coerce.number().int().min(1000000, t('dniMin')),
    password: z.string().min(8, t('passwordMin')),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (formData) => {
    try {
      await authService.register(formData)
      toast.success(t('registerSuccess'))
      navigate('/login')
    } catch {
      toast.error(t('registerError'))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{t('registerTitle')}</h1>
        <p className="auth-subtitle">{t('registerSubtitle')}</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-field">
            <label htmlFor="name">{t('name')}</label>
            <input id="name" {...register('name')} />
            {errors.name && <span className="auth-field-error">{errors.name.message}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="email">{t('email')}</label>
            <input id="email" type="email" {...register('email')} />
            {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="dni">{t('dni')}</label>
            <input id="dni" type="number" {...register('dni')} />
            {errors.dni && <span className="auth-field-error">{errors.dni.message}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="password">{t('password')}</label>
            <input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
          </div>

          <SubmitButton className="auth-submit" loading={isSubmitting} loadingText={t('registering')}>
            {t('registerButton')}
          </SubmitButton>
        </form>

        <p className="auth-footer">
          {t('haveAccount')} <Link to="/login">{t('loginLink')}</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage