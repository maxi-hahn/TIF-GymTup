import toast from 'react-hot-toast'


export const handleBackendError = (error, navigate, t) => {
    const code = error.response?.data?.code

    toast.error(
        t(`errors.${code}`, {
            defaultValue: t("unknownError")
        })
    )

    switch (code) {
        case "PLAN_REQUIRED":
        case "PLAN_INACTIVE":
            navigate("/plans")
            break

        case "EMAIL_NOT_VERIFIED":
            navigate("/verify-email")
            break
    }
}