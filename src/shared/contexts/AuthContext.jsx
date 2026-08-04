import { createContext, useContext, useState, useEffect } from 'react'
import authService from '@/shared/services/authService'
import { isTokenExpired } from '@/utils/decodeJwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (token && storedUser && !isTokenExpired(token)) {
            setUser(JSON.parse(storedUser))
        } else {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const {
            token,
            id,
            name,
            email: userEmail,
            rol,
            emailVerified,
            planName,
            hasPlan,
        } = await authService.login(email, password)
        
        const userData = {
            id,
            name,
            email,
            rol,
            planName,
            hasPlan,
            emailVerified
        }

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)

        return userData
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider')
    }
    return context
}