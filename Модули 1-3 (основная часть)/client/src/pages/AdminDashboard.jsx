import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useConfig } from '../contexts/ConfigContext'
import { applicationService } from '../services/applications'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { config } = useConfig()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await applicationService.getStats()
      setStats(data)
    } catch {
      toast.error('Ошибка при загрузке статистики')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-secondary">Загрузка...</p>
      </div>
    )
  }

  const statCards = [
    { name: 'Всего заявок', value: stats?.totalApplications || 0 },
    { name: 'Новые', value: stats?.newApplications || 0 },
    { name: 'Банкет назначен', value: stats?.assignedApplications || 0 },
    { name: 'Завершено', value: stats?.completedApplications || 0 },
    { name: 'Пользователей', value: stats?.totalUsers || 0 },
  ]

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1>Панель администратора</h1>
        <p className="text-secondary mt-2">{config.title}</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="stat-card">
            <p className="text-secondary">{stat.name}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="card-static">
        <Link to="/admin/applications" className="btn-primary">Все заявки</Link>
      </div>
    </div>
  )
}
