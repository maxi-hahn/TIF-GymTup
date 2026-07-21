import axiosClient from '@/api/axiosClient'
const classService = {
  getClasses: async () => {
    const response = await axiosClient.get('/Class')
    return response.data
  },
}

export default classService
