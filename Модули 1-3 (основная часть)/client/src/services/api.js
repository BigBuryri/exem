import axios from 'axios'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register')
    const isOnAuthPage = ['/login', '/register'].includes(window.location.pathname)

    if (status === 401 && !isAuthRequest) {
      const requestToken = (error.config?.headers?.Authorization || '').replace('Bearer ', '')
      const currentToken = localStorage.getItem('token') || ''

      // Не сбрасываем токен, если 401 пришёл от устаревшего запроса
      if (!requestToken || requestToken === currentToken) {
        localStorage.removeItem('token')
        if (!isOnAuthPage) {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api
