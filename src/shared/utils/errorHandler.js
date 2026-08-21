import toast from 'react-hot-toast'
export const handleBackendError = (error, navigate, t) => {
    const data = error.response?.data
    const code = data?.code
    const status = data?.status
    const errorMessage = data?.ErrorMessage || data?.errorMessage || data?.message

    // Errores de negocio que todavía no tienen un "code"
    if (
        status === 409 &&
        data?.error === 'Cannot delete a class with registered users.'
    ) {
        toast.error(t('errors.CLASS_HAS_INSCRIPTIONS'))
        return
    }

    // Para SCHEDULE_OVERLAP, usar el mensaje completo del backend
    if (code === 'SCHEDULE_OVERLAP' && errorMessage) {
        toast.error(errorMessage)
        return
    }

    // Para otros errores, usar traducciones
    toast.error(
        t(`errors.${code}`, {
            defaultValue: t('unknownError')
        })
    )

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