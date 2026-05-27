import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

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
      toast.error(error.response?.data?.message || 'Ошибка входа')
      return { success: false, error: error.response?.data?.message }
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
      toast.error(error.response?.data?.message || 'Ошибка регистрации')
      return { success: false, error: error.response?.data?.message }
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
