import api from './api'

export const applicationService = {
  getAll: async () => {
    const response = await api.get('/applications')
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/applications', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/applications/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/applications/${id}`)
    return response.data
  },

  getAllAdmin: async (params) => {
    const response = await api.get('/admin/applications', { params })
    return response.data
  },

  updateStatus: async (id, data) => {
    const response = await api.put(`/admin/applications/${id}/status`, data)
    return response.data
  },

  deleteAdmin: async (id) => {
    const response = await api.delete(`/admin/applications/${id}`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  }
}
