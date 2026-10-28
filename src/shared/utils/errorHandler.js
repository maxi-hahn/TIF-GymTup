import toast from 'react-hot-toast'

export const handleBackendError = (error, navigate, t) => {
    const data = error.response?.data
    const code = data?.code
    const status = data?.status
    const errorMessage = data?.ErrorMessage || data?.errorMessage || data?.message || data?.error

    // 1. Errores de negocio sin "code" (usando status 409)
    if (status === 409) {
        const msg = (data?.error || data?.ErrorMessage || data?.message || '').toLowerCase()

        // Eliminar plan con clientes
        if (msg.includes('plan assigned to clients') || msg.includes('clientes suscriptos')) {
            toast.error(t('plans:errors.PLAN_HAS_CLIENTS', { defaultValue: 'No se puede eliminar el plan porque tiene clientes.' }))
            return
        }

        // Eliminar clase con inscripciones
        if (msg.includes('class with registered users') || msg.includes('class with active inscriptions') || msg.includes('usuarios inscriptos')) {
            toast.error(t('classes:errors.CLASS_HAS_INSCRIPTIONS', { defaultValue: 'No se puede eliminar la clase porque tiene inscriptos.' }))
            return
        }

        // Eliminar horario con inscripciones activas
        if (msg.includes('horario con inscripciones activas') || msg.includes('schedule with active enrollments')) {
            toast.error(t('classes:errors.SCHEDULE_HAS_ACTIVE_INSCRIPTIONS', { defaultValue: 'No se puede eliminar el horario porque tiene inscriptos.' }))
            return
        }
    }

    // 2. Para SCHEDULE_OVERLAP, usar el mensaje completo del backend
    if (code === 'SCHEDULE_OVERLAP' && errorMessage) {
        toast.error(errorMessage)
        return
    }

    // 3. Si el backend manda un mensaje y no hay código específico
    if (!code && errorMessage) {
        toast.error(errorMessage)
        return
    }

    // 4. Para otros errores, usar el namespace "classes" por defecto (o common)
    toast.error(
        t(`classes:errors.${code}`, {
            defaultValue: t('unknownError')
        })
    )

    // 5. Redirecciones
    switch (code) {
        case 'PLAN_REQUIRED':
        case 'PLAN_INACTIVE':
            navigate('/plans')
            break

        case 'EMAIL_NOT_VERIFIED':
            navigate('/verify-email')
            break
    }
}