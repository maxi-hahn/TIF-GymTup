import axiosClient from '@/api/axiosClient'

const inscriptionService = {
  getMyInscriptions: async () => {
    const response = await axiosClient.get('/Inscription/me')
    return response.data
  },

  enroll: async (scheduleId) => {
    const response = await axiosClient.post(`/Inscription`, { scheduleId })
    return response.data
  },

  cancel: async (scheduleId) => {
    const response = await axiosClient.delete(`/Inscription/${scheduleId}`)
    return response.data
  }
}

export default inscriptionService
