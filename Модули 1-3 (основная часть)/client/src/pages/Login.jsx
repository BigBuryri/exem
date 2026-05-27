import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setAuthError('')
    const result = await login(data)
    setIsLoading(false)
    
    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    } else if (result.error) {
      setAuthError(result.error)
    }
  }

  return (
    <AuthLayout title="Банкетам.Нет" subtitle="Вход в систему">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {authError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{authError}</p>
        )}
        <div>
          <label htmlFor="login" className="label">Логин</label>
          <input
            {...register('login', { required: 'Введите логин' })}
            type="text"
            className={`input ${errors.login ? 'input-error' : ''}`}
            placeholder="Введите логин"
          />
          {errors.login && (
            <p className="mt-1 text-sm text-banquet-red">{errors.login.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="label">Пароль</label>
          <input
            {...register('password', { required: 'Введите пароль' })}
            type="password"
            className={`input ${errors.password ? 'input-error' : ''}`}
            placeholder="Введите пароль"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-banquet-red">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading ? 'Вход...' : 'Войти'}
        </button>

        <div className="text-center">
          <span className="text-sm text-banquet-muted">
            Еще не зарегистрированы?{' '}
            <Link to="/register" className="link-accent">
              Регистрация
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  )
}
