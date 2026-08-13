import axiosClient from '@/api/axiosClient'

const classService = {
  getClasses: async () => {
    const response = await axiosClient.get('/Class')
    return response.data
  },

  createClass: async (classData) => {
    const response = await axiosClient.post('/Class', classData)
    return response.data
  },

  updateStatus: async (classId, isActive) => {
    const response = await axiosClient.patch(
      `/Class/${classId}/status`,
      { isActive }
    )

    return response.data
  },

  updateCapacity: async (classId, maxUsers) => {
    const response = await axiosClient.patch(
      `/Class/${classId}`,
      { max_Users: maxUsers }
    )

    return response.data
  },

  deleteClass: async (classId) => {
    const response = await axiosClient.delete(`/Class/${classId}`)
    return response.data
  },
}

export default classService