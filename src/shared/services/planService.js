import axiosClient from '@/api/axiosClient'

const planService = {
    getPlans: async () => {
        const { data } = await axiosClient.get('/Plan/GetPlan')
        return data
    },
    getPlanById: (_id) => { },
    createPlan: async (data) => {
        const { data: result } = await axiosClient.post('/Plan/CreatePlan', data)
        return result
    },
    updatePlan: async (id, data) => {
        const { data: result } = await axiosClient.put('/Plan/UpdatePlan', data, {
            params: { id },
        })
        return result
    },
    deletePlan: async (id) => {
        const { data } = await axiosClient.delete('/Plan/DeletePlan', {
            params: { id },
        })
        return data
    },
}

export default planService