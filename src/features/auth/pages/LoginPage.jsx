import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAuth } from '@/shared/contexts/AuthContext'
import SubmitButton from '@/shared/components/SubmitButton'
import '@/shared/layouts/AuthLayout.css'

const LoginPage = () => {
    const { t } = useTranslation('auth')
    const { login } = useAuth()
    const navigate = useNavigate()

    const loginSchema = z.object({
        email: z.string().min(1, t('emailRequired')).email(t('emailInvalid')),
        password: z.string().min(1, t('passwordRequired')),
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (formData) => {
        try {
            await login(formData.email, formData.password)
            navigate('/')
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error(t('invalidCredentials'))
            } else {
                toast.error(t('genericError'))
            }
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">{t('loginTitle')}</h1>
                <p className="auth-subtitle">{t('loginSubtitle')}</p>

                <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="auth-field">
                        <label htmlFor="email">{t('email')}</label>
                        <input id="email" type="email" {...register('email')} />
                        {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">{t('password')}</label>
                        <input id="password" type="password" {...register('password')} />
                        {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
                    </div>

                    <SubmitButton className="auth-submit" loading={isSubmitting} loadingText={t('loggingIn')}>
                        {t('loginButton')}
                    </SubmitButton>
                </form>

                <p className="auth-footer">
                    {t('noAccount')} <Link to="/register">{t('registerLink')}</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage