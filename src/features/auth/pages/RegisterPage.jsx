import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import authService from '@/shared/services/authService'
import SubmitButton from '@/shared/components/SubmitButton'

const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  dni: z.coerce.number().int().positive('DNI inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

const RegisterPage = () => {
  const navigate = useNavigate()

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
      toast.success('Cuenta creada correctamente. Ya podés iniciar sesión.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error ?? 'No se pudo crear la cuenta. Intentá de nuevo.')
    }
  }

  return (
    <>
      <h1 className="auth-title">Crear cuenta</h1>
      <p className="auth-subtitle">Sumate a GymTup y empezá a entrenar con propósito.</p>

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="auth-field">
          <label htmlFor="name">Nombre</label>
          <input id="name" {...register('name')} />
          {errors.name && <span className="auth-field-error">{errors.name.message}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="dni">DNI</label>
          <input id="dni" type="number" {...register('dni')} />
          {errors.dni && <span className="auth-field-error">{errors.dni.message}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" autoComplete="new-password" {...register('password')} />
          {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
        </div>

        <SubmitButton className="auth-submit" loading={isSubmitting} loadingText="Creando cuenta...">
          Registrarse
        </SubmitButton>
      </form>

      <p className="auth-footer">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </>
  )
}

export default RegisterPage