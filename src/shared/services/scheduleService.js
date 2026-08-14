import axiosClient from '@/api/axiosClient'

const scheduleService = {
  createSchedule: async (classId, scheduleData) => {
    const response = await axiosClient.post(
      `/Schedule?idClass=${classId}`,
      scheduleData
    )
    return response.data
  },

  updateStatus: async (scheduleId, isActive) => {
    const response = await axiosClient.patch(
      `/Schedule/${scheduleId}/status`,
      { isActive }
    )

    return response.data
  },

  deleteSchedule: async (scheduleId) => {
    const response = await axiosClient.delete(
      `/Schedule/${scheduleId}`
    )

    return response.data
  },

  updateSchedule: async (scheduleId, schedule) => {
    const response = await axiosClient.patch(
      `/Schedule/${scheduleId}`,
      schedule
    )

    return response.data
  }
}

export default scheduleService