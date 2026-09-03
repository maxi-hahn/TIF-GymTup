import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuth } from '@/shared/contexts/AuthContext'
import SubmitButton from '@/shared/components/SubmitButton'

const loginSchema = z.object({
    email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
})

const LoginPage = () => {
    const { login } = useAuth()
    const navigate = useNavigate()

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
                toast.error('Email o contraseña incorrectos.')
            } else {
                toast.error('Ocurrió un error. Intentá de nuevo.')
            }
        }
    }

    return (
        <>
            <h1 className="auth-title">Iniciar sesión</h1>
            <p className="auth-subtitle">Ingresá tus datos para continuar entrenando.</p>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="auth-field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" {...register('email')} />
                    {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
                </div>

                <div className="auth-field">
                    <label htmlFor="password">Contraseña</label>
                    <input id="password" type="password" {...register('password')} />
                    {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
                </div>

                <SubmitButton className="auth-submit" loading={isSubmitting} loadingText="Ingresando...">
                    Ingresar
                </SubmitButton>
            </form>

            <p className="auth-footer">
                ¿Aún no tenés cuenta? <Link to="/register">Registrate</Link>
            </p>
        </>
    )
}

export default LoginPage