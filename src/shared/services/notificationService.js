import axiosClient from '@/api/axiosClient'

const notificationService = {
  getNotifications: async () => {
    const response = await axiosClient.get('/notification')
    return response.data
  },

  getUnreadCount: async () => {
    const response = await axiosClient.get('/notification/unread-count')
    return response.data.unreadCount  // ← Extraer el número del objeto
  },

  markAsRead: async (notificationId) => {
    const response = await axiosClient.put(`/notification/${notificationId}/read`)
    return response.data
  },

  markAllAsRead: async () => {
    const response = await axiosClient.put('/notification/read-all')
    return response.data
  }
}

export default notificationService