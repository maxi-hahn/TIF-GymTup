import toast from 'react-hot-toast'

export const handleBackendError = (error, navigate, t) => {
    const data = error.response?.data
    const code = data?.code
    const status = data?.status

    // Errores de negocio que todavía no tienen un "code"
    if (
        status === 409 &&
        data?.error === 'Cannot delete a class with registered users.'
    ) {
        toast.error(t('errors.CLASS_HAS_INSCRIPTIONS'))
        return
    }

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