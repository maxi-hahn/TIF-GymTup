export function decodeJwt(token) {
    try {
        const payload = token.split('.')[1]
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(atob(base64))
    } catch {
        return null
    }
}

export function isTokenExpired(token) {
    const decoded = decodeJwt(token)
    if (!decoded?.exp) return true
    return decoded.exp * 1000 < Date.now()
}