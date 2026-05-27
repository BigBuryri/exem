import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

const extractApiErrorMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data
  if (responseData?.message) {
    return responseData.message
  }
  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors[0]?.msg || fallbackMessage
  }
  return fallbackMessage
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.getProfile()
        .then(userData => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      toast.success('Вход выполнен успешно!')
      return { success: true, user: response.user }
    } catch (error) {
      const message = extractApiErrorMessage(error, 'Ошибка входа')
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      toast.success('Регистрация успешна!')
      return { success: true, user: response.user }
    } catch (error) {
      const message = extractApiErrorMessage(error, 'Ошибка регистрации')
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Вы вышли из системы')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
