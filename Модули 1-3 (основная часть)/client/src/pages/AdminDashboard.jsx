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
    return <p className="text-center py-10 text-banquet-muted">Загрузка...</p>
  }

  const statCards = [
    { name: 'Всего заявок', value: stats?.totalApplications || 0 },
    { name: 'Новые', value: stats?.newApplications || 0 },
    { name: 'Банкет назначен', value: stats?.assignedApplications || 0 },
    { name: 'Завершено', value: stats?.completedApplications || 0 },
    { name: 'Пользователей', value: stats?.totalUsers || 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1>Панель администратора</h1>
        <p className="text-secondary">{config.title}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <p className="text-secondary text-sm">{stat.name}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <Link to="/admin/applications" className="btn-primary">Все заявки</Link>
      </div>
    </div>
  )
}
