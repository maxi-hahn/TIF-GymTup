import axiosClient from '@/api/axiosClient'

const userService = {
    getProfile: () => { },
    updateProfile: (_data) => { },
    getUsers: (_params) => { },
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
}

export default userService