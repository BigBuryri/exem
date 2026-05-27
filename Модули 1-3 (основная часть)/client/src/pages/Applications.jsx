import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useConfig } from '../contexts/ConfigContext'
import { applicationService } from '../services/applications'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { getFieldLabel, formatFieldValue, getStatusBadgeClass } from '../utils/applicationDisplay'

export default function Applications() {
  const { config } = useConfig()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const data = await applicationService.getAll()
      setApplications(data)
    } catch {
      toast.error('Ошибка при загрузке заявок')
    }
    setLoading(false)
  }

  const handleReview = async () => {
    try {
      await applicationService.update(selectedApp.id, { rating, review })
      toast.success('Отзыв добавлен')
      setShowReviewModal(false)
      setSelectedApp(null)
      setRating(5)
      setReview('')
      loadApplications()
    } catch {
      toast.error('Ошибка при добавлении отзыва')
    }
  }

  const getStatusColor = (status) => {
    const statusConfig = config.application.statuses[status]
    return getStatusBadgeClass(statusConfig?.color)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-banquet-muted">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <header className="page-header flex items-center justify-between gap-3">
        <h1>{config.labels?.viewButton || 'Мои заявки'}</h1>
        <Link to="/applications/new" className="btn-primary text-sm px-3 py-2 shrink-0">
          + Новая
        </Link>
      </header>

      {applications.length === 0 ? (
        <div className="card-static text-center py-12">
          <p className="text-banquet-ink">Заявок пока нет</p>
          <p className="text-secondary mt-1">Оформите первое бронирование</p>
          <Link to="/applications/new" className="btn-primary inline-flex mt-5">
            {config.labels?.createButton || 'Оформить бронирование'}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <article key={app.id} className="card-static">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-banquet-red">
                    {config.labels?.applicationName || 'Заявка'} №{app.id}
                  </p>
                  <p className="text-secondary mt-0.5">
                    {format(new Date(app.createdAt), 'd MMMM yyyy', { locale: ru })}
                  </p>
                </div>
                <span className={clsx('px-2.5 py-1 text-xs font-semibold rounded-full shrink-0', getStatusColor(app.status))}>
                  {config.application.statuses[app.status]?.label}
                </span>
              </div>

              <dl className="mt-3 space-y-1.5 text-sm">
                {Object.entries(app.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-3 border-b border-banquet-peach/50 pb-1.5 last:border-0">
                    <dt className="text-banquet-gold">{getFieldLabel(config, key)}</dt>
                    <dd className="text-right font-medium">{formatFieldValue(config, key, value)}</dd>
                  </div>
                ))}
              </dl>

              {app.adminComment && (
                <p className="mt-3 text-sm rounded-lg bg-banquet-peach/40 p-3">
                  <span className="font-medium text-banquet-red">Комментарий администратора: </span>
                  {app.adminComment}
                </p>
              )}

              {app.rating && (
                <div className="mt-3 rounded-lg bg-banquet-cream p-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Оценка:</span>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={clsx('h-4 w-4', i < app.rating ? 'text-banquet-gold' : 'text-banquet-peach')}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {app.review && <p className="mt-1 text-sm">{app.review}</p>}
                </div>
              )}

              {config.features.reviews && app.status !== 'new' && !app.rating && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApp(app)
                    setShowReviewModal(true)
                  }}
                  className="mt-3 text-sm font-medium text-banquet-red hover:underline"
                >
                  Оставить отзыв
                </button>
              )}
            </article>
          ))}
        </div>
      )}

      {showReviewModal && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl max-w-md w-full p-5 animate-in">
            <h3 className="!text-xl mb-4">Оставить отзыв</h3>

            <div className="mb-4">
              <span className="label">Оценка</span>
              <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setRating(value)} className="focus:outline-none">
                    <svg
                      className={clsx('h-8 w-8', value <= rating ? 'text-banquet-gold' : 'text-banquet-peach')}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="review" className="label">Комментарий</label>
              <textarea
                id="review"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="input"
                placeholder="Поделитесь впечатлениями..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false)
                  setSelectedApp(null)
                  setRating(5)
                  setReview('')
                }}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button type="button" onClick={handleReview} className="btn-primary">
                Отправить
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
