import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import userService from '@/shared/services/userService'
import { useAuth } from '@/shared/contexts/AuthContext'

const profileSchema = z
  .object({
    name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
    email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
    password: z.string().min(0).refine((val) => val === '' || val.length >= 8, {
      message: 'La contraseña debe tener al menos 8 caracteres',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (formData) => {
    setMessage('')
    setError('')

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password || null,
    }

    try {
      await userService.updateProfile(payload)
      updateUser({ name: formData.name, email: formData.email })
      setMessage('Perfil actualizado correctamente.')
    } catch (err) {
        const backendError = err.response?.data?.error
        const errorMessages = {
            'Email is already in use': 'Ese email ya está en uso por otro usuario.',
        }
        setError(errorMessages[backendError] ?? 'No se pudo actualizar el perfil.')
    }
  }

  return (
    <div>
      <h1>Mi perfil</h1>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', minWidth: '220px' }}>
          <h2>Datos actuales</h2>
          <p><strong>Nombre:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {(user?.rol === 'Admin' || user?.rol === 'SysAdmin') && (
            <p><strong>Rol:</strong> {user?.rol}</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ flex: 1, minWidth: '260px' }}>
          <div>
            <label htmlFor="name">Nombre</label>
            <input id="name" {...register('name')} />
            {errors.name && <span>{errors.name.message}</span>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register('email')} />
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div>
            <label htmlFor="password">Nueva contraseña</label>
            <input id="password" type="password" autoComplete="new-password" placeholder="Campo opcional" {...register('password')} />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
            <input id="confirmPassword" type="password" autoComplete="new-password" placeholder="Campo opcional" {...register('confirmPassword')} />
            {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
          </div>

          {message && <p>{message}</p>}
          {error && <p>{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage