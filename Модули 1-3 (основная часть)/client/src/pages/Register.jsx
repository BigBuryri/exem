import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'

const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setServerError('')
    const result = await registerUser(data)
    setIsLoading(false)
    
    if (result.success) {
      navigate('/dashboard')
    } else if (result.error) {
      setServerError(result.error)
    }
  }

  return (
    <AuthLayout title="Банкетам.Нет" subtitle="Регистрация">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {serverError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{serverError}</p>
        )}
        <div>
          <label htmlFor="login" className="label">Логин</label>
          <input
            {...register('login', {
              required: 'Введите логин',
              minLength: { value: 6, message: 'Минимум 6 символов' },
              pattern: { value: /^[a-zA-Z0-9]+$/, message: 'Только латиница и цифры' }
            })}
            type="text"
            className={`input ${errors.login ? 'input-error' : ''}`}
            placeholder="latin123"
          />
          {errors.login && (
            <p className="mt-1 text-sm text-banquet-red">{errors.login.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="label">Пароль</label>
          <input
            {...register('password', {
              required: 'Введите пароль',
              minLength: { value: 8, message: 'Минимум 8 символов' }
            })}
            type="password"
            className={`input ${errors.password ? 'input-error' : ''}`}
            placeholder="Минимум 8 символов"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-banquet-red">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fullName" className="label">ФИО</label>
          <input
            {...register('fullName', {
              required: 'Введите ФИО',
              pattern: { value: /^[а-яА-ЯёЁ\s]+$/, message: 'Только кириллица' }
            })}
            type="text"
            className={`input ${errors.fullName ? 'input-error' : ''}`}
            placeholder="Иванов Иван Иванович"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-banquet-red">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="label">Телефон</label>
          <input
            {...register('phone', {
              required: 'Введите телефон',
              pattern: {
                value: phonePattern,
                message: 'Формат: +7 (999) 123-45-67'
              }
            })}
            type="tel"
            className={`input ${errors.phone ? 'input-error' : ''}`}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-banquet-red">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            {...register('email', {
              required: 'Введите email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный формат email'
              }
            })}
            type="email"
            className={`input ${errors.email ? 'input-error' : ''}`}
            placeholder="user@mail.ru"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-banquet-red">{errors.email.message}</p>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <div className="text-center">
          <span className="text-sm text-banquet-muted">
            Уже зарегистрированы?{' '}
            <Link to="/login" className="link-accent">
              Войти
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  )
}
