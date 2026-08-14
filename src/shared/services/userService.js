import axiosClient from '@/api/axiosClient'

const userService = {
    getProfile: () => { },
    updateProfile: async (data) => {
        const { data: result } = await axiosClient.put('/Client/UpdateMe', data)
        return result
    },
    getUsers: async () => {
        const { data } = await axiosClient.get('/Client')
        return data
    },
    updateUserRole: (_id, _role) => { },
    getUserById: (_id) => { },
    deleteUser: (_id) => { },
    buyPlan: async (planId) => {
        const { data } = await axiosClient.post('/Client/BuyPlan', null, {
            params: { planId },
        })
        return data // { paymentUrl }
    },
    getMyPlanStatus: async () => {
        const { data } = await axiosClient.get('/Client/me')
        return data
    },
    changeRole: async (email, rol) => {
        const { data } = await axiosClient.post('/SysAdmin/UpgradeUsersRol', { email, rol })
        return data
    },
    toggleUserStatus: async (userId) => {
        const { data } = await axiosClient.patch('/SysAdmin/ToggleUserStatus', null, {
            params: { userId },
        })
        return data
    },
    // Nuevos métodos para gestión de usuarios
    getUserPlan: async (userId) => {
        const { data } = await axiosClient.get(`/Client/${userId}/plan`)
        return data
    },
    removeUserPlan: async (userId) => {
        const { data } = await axiosClient.delete(`/Client/${userId}/plan`)
        return data
    },
    getUserInscriptions: async (userId) => {
        const { data } = await axiosClient.get(`/Inscription/user/${userId}`)
        return data
    },
    removeUserInscription: async (userId, scheduleId) => {
        const { data } = await axiosClient.delete(`/Inscription/user/${userId}/${scheduleId}`)
        return data
    },
}

export default userService