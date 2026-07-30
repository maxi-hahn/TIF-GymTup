import axiosClient from '@/api/axiosClient'

const planService = {
    getPlans: async () => {
        const { data } = await axiosClient.get('/Plan/GetPlan')
        return data
    },
    getPlanById: (_id) => { },
    createPlan: (_data) => { },
    updatePlan: (_id, _data) => { },
    deletePlan: (_id) => { },
}

export default planService