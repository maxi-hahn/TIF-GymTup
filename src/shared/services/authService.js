import axiosClient from '@/api/axiosClient'

const authService = {
    login: async (email, password) => {
        const { data } = await axiosClient.post('/Auth/singin', { email, password })
        return data // { token, rol, id, email }
    },
    register: async (userData) => {
        const { data } = await axiosClient.post('/Auth/signup', userData)
        return data
    },
    logout: () => { },
}

export default authService