import axiosClient from '@/api/axiosClient'

const userService = {
    getProfile: () => { },
    updateProfile: (_data) => { },
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
        return data // { planId, planName, isActive, subscriptionStartDate, subscriptionEndDate }
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
}

export default userService