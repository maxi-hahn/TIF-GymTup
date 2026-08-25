import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Button from '@/shared/components/Button'
import userService from '@/shared/services/userService'

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

const ProfileInfoCard = ({ user, updateUser }) => {
  const { t } = useTranslation('profile')
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
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
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password || null,
    }

    try {
      await userService.updateProfile(payload)
      updateUser({ name: formData.name, email: formData.email })
      toast.success(t('info.profileUpdated'))
      setIsEditing(false)
    } catch (err) {
      toast.error(t('info.updateError'))
    }
  }

  const handleCancel = () => {
    reset({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      confirmPassword: '',
    })
    setIsEditing(false)
  }

  return (
    <article className="profile-card">
      <h2 className="profile-section-title">
        <span className="profile-section-icon">👤</span>
        {t('sections.profileInfo')}
      </h2>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="profile-edit-form" noValidate>
          <div className="profile-form-group">
            <label htmlFor="name">{t('info.name')}</label>
            <input id="name" {...register('name')} />
            {errors.name && <span className="profile-field-error">{errors.name.message}</span>}
          </div>

          <div className="profile-form-group">
            <label htmlFor="email">{t('info.email')}</label>
            <input id="email" type="email" {...register('email')} />
            {errors.email && <span className="profile-field-error">{errors.email.message}</span>}
          </div>

          <div className="profile-form-group">
            <label htmlFor="password">{t('info.newPassword')}</label>
            <input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password && <span className="profile-field-error">{errors.password.message}</span>}
          </div>

          <div className="profile-form-group">
            <label htmlFor="confirmPassword">{t('info.confirmPassword')}</label>
            <input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} />
            {errors.confirmPassword && <span className="profile-field-error">{errors.confirmPassword.message}</span>}
          </div>

          <div className="profile-info-actions">
            <Button size="sm" type="submit" disabled={isSubmitting}>
              {isSubmitting ? '...' : t('info.saveChanges')}
            </Button>
            <Button size="sm" variant="secondary" type="button" onClick={handleCancel}>
              {t('info.cancelEdit')}
            </Button>
          </div>
        </form>
      ) : (
        <div className="profile-info-fields">
          <div className="profile-info-field">
            <span className="profile-info-label">{t('info.name')}</span>
            <div className="profile-info-value">{user?.name || '-'}</div>
          </div>

          <div className="profile-info-field">
            <span className="profile-info-label">{t('info.email')}</span>
            <div className="profile-info-value">
              {user?.email || '-'}
              {user?.emailVerified ? (
                <span className="profile-badge profile-badge-verified">✓ {t('info.verified')}</span>
              ) : (
                <span className="profile-badge profile-badge-unverified">! {t('info.notVerified')}</span>
              )}
            </div>
          </div>

          {user?.dni && (
            <div className="profile-info-field">
              <span className="profile-info-label">{t('info.dni')}</span>
              <div className="profile-info-value">{user.dni}</div>
            </div>
          )}

          <div className="profile-info-field">
            <span className="profile-info-label">{t('info.role')}</span>
            <div className="profile-info-value">
              <span className="profile-badge profile-badge-role">{user?.rol || 'Client'}</span>
            </div>
          </div>

          <div className="profile-info-actions">
            <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
              ✏️ {t('info.editProfile')}
            </Button>
          </div>
        </div>
      )}
    </article>
  )
}

export default ProfileInfoCard
