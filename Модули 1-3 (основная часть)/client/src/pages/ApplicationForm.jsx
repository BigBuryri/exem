import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useConfig } from '../contexts/ConfigContext'
import { applicationService } from '../services/applications'
import { validateRussianDate } from '../utils/dateValidation'
import toast from 'react-hot-toast'

export default function ApplicationForm() {
  const { config } = useConfig()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await applicationService.create({
        type: config.application.type,
        data
      })
      toast.success('Заявка успешно создана!')
      navigate('/applications')
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка при создании заявки'
      toast.error(message)
    }
    setIsLoading(false)
  }

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              type="text"
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'number':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              type="number"
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <textarea
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              rows={3}
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'dateText':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              {...register(field.name, {
                ...(field.required ? { required: `${field.label} обязательно` } : {}),
                validate: validateRussianDate
              })}
              type="text"
              inputMode="numeric"
              maxLength={10}
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              placeholder={field.placeholder || 'ДД.ММ.ГГГГ'}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-banquet-red">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'date':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              type="date"
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'time':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              type="time"
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <select
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
            >
              <option value="">Выберите...</option>
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'radio':
        return (
          <div key={field.name}>
            <label className="label">{field.label}</label>
            <div className="space-y-2">
              {field.options.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
                    type="radio"
                    value={option.value}
                    className="mr-2 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-banquet-ink">{option.label}</span>
                </label>
              ))}
            </div>
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="page-shell max-w-xl mx-auto">
      <header className="page-header">
        <h1>{config.labels?.createButton || 'Оформить бронирование'}</h1>
        <p className="text-secondary mt-2">Заполните все обязательные поля</p>
      </header>
      <div className="card-static">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {config.application.fields.map(field => renderField(field))}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/applications')}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

