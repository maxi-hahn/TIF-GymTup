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
  },

  // Nuevo: Obtener próxima fecha para un horario
  getNextClassDate: async (scheduleId) => {
    const response = await axiosClient.get(`/Inscription/next-date/${scheduleId}`)
    return response.data
  }
}

export default inscriptionService