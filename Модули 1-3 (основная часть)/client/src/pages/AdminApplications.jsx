import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useConfig } from '../contexts/ConfigContext'
import { applicationService } from '../services/applications'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { getFieldLabel, formatFieldValue, getStatusBadgeClass } from '../utils/applicationDisplay'

export default function AdminApplications() {
  const { config } = useConfig()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('DESC')
  const [selectedApp, setSelectedApp] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [adminComment, setAdminComment] = useState('')

  useEffect(() => {
    loadApplications()
  }, [page, statusFilter, searchQuery, sortBy, sortOrder])

  const loadApplications = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      }
      const data = await applicationService.getAllAdmin(params)
      setApplications(data.applications)
      setTotalPages(data.pages)
    } catch {
      toast.error('Ошибка при загрузке заявок')
    }
    setLoading(false)
  }

  const handleStatusUpdate = async () => {
    try {
      await applicationService.updateStatus(selectedApp.id, {
        status: newStatus,
        adminComment
      })
      toast.success('Статус обновлён')
      setShowStatusModal(false)
      setSelectedApp(null)
      setNewStatus('')
      setAdminComment('')
      loadApplications()
    } catch {
      toast.error('Ошибка при обновлении статуса')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Удалить эту заявку?')) {
      try {
        await applicationService.deleteAdmin(id)
        toast.success('Заявка удалена')
        loadApplications()
      } catch {
        toast.error('Ошибка при удалении')
      }
    }
  }

  const getStatusColor = (status) => {
    const statusConfig = config.application.statuses[status]
    return getStatusBadgeClass(statusConfig?.color)
  }

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-banquet-muted">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-in">
      <div>
        <h1 className="!text-[28px]">Управление заявками</h1>
        <p className="text-secondary">Все заявки пользователей</p>
      </div>

      <div className="card !p-4 space-y-3">
        <div>
          <label htmlFor="status" className="label">Статус</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="input"
          >
            <option value="">Все статусы</option>
            {Object.entries(config.application.statuses).map(([value, status]) => (
              <option key={value} value={value}>{status.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search" className="label">Поиск</label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="input"
            placeholder="ФИО, email или телефон..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="sortBy" className="label">Сортировка</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setPage(1)
              }}
              className="input"
            >
              <option value="createdAt">По дате</option>
              <option value="status">По статусу</option>
              <option value="id">По номеру</option>
            </select>
          </div>
          <div>
            <label htmlFor="sortOrder" className="label">Порядок</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value)
                setPage(1)
              }}
              className="input"
            >
              <option value="DESC">Сначала новые</option>
              <option value="ASC">Сначала старые</option>
            </select>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-banquet-ink">Заявки не найдены</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <article key={app.id} className="card !p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-banquet-red">Заявка №{app.id}</p>
                  <p className="text-sm mt-0.5">{app.user.fullName}</p>
                  <p className="text-secondary">{app.user.email} · {app.user.phone}</p>
                  <p className="text-secondary mt-0.5">
                    {format(new Date(app.createdAt), 'd MMM yyyy, HH:mm', { locale: ru })}
                  </p>
                </div>
                <span className={clsx('px-2.5 py-1 text-xs font-semibold rounded-full shrink-0', getStatusColor(app.status))}>
                  {config.application.statuses[app.status]?.label}
                </span>
              </div>

              <dl className="mt-3 rounded-lg bg-banquet-cream p-3 space-y-1.5 text-sm">
                {Object.entries(app.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-3">
                    <dt className="text-banquet-gold">{getFieldLabel(config, key)}</dt>
                    <dd className="font-medium text-right">{formatFieldValue(config, key, value)}</dd>
                  </div>
                ))}
              </dl>

              {app.adminComment && (
                <p className="mt-2 text-sm rounded-lg bg-banquet-peach/40 p-2">
                  <span className="font-medium">Комментарий: </span>{app.adminComment}
                </p>
              )}

              {app.rating && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Отзыв: </span>
                  {'★'.repeat(app.rating)}{'☆'.repeat(5 - app.rating)}
                  {app.review && <p className="mt-1">{app.review}</p>}
                </div>
              )}

              <div className="mt-3 flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApp(app)
                    setNewStatus(app.status)
                    setAdminComment(app.adminComment || '')
                    setShowStatusModal(true)
                  }}
                  className="text-sm font-medium text-banquet-red hover:underline"
                >
                  Изменить статус
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(app.id)}
                  className="text-sm font-medium text-banquet-green hover:underline"
                >
                  Удалить
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="card !p-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn-secondary text-sm py-2"
          >
            Назад
          </button>
          <span className="text-sm text-banquet-gold">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="btn-secondary text-sm py-2"
          >
            Вперёд
          </button>
        </div>
      )}

      {showStatusModal && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl max-w-md w-full p-5 animate-in">
            <h3 className="!text-xl mb-4">Изменить статус</h3>

            <div className="mb-4">
              <label htmlFor="newStatus" className="label">Статус</label>
              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input"
              >
                {Object.entries(config.application.statuses).map(([value, status]) => (
                  <option key={value} value={value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="label">Комментарий администратора</label>
              <textarea
                id="comment"
                rows={3}
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="input"
                placeholder="Комментарий для пользователя..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedApp(null)
                }}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button type="button" onClick={handleStatusUpdate} className="btn-primary">
                Сохранить
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
