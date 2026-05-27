import { useAuth } from '../contexts/AuthContext'
import { useConfig } from '../contexts/ConfigContext'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import ImageSlider from '../components/ImageSlider'
import QualityBlock from '../components/QualityBlock'
import ContactsBlock from '../components/ContactsBlock'

const rooms = [
  { img: '/assets/3505f015e0d26644e8e4c.jpg', label: 'Зал' },
  { img: '/assets/339037.jpeg', label: 'Ресторан' },
  { img: '/assets/1686676944_elles-top-p-letnyaya-ploshcha.jpg', label: 'Летняя веранда' },
  { img: '/assets/1671649122_idei-club-p-veranda-.jpg', label: 'Закрытая веранда' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { config } = useConfig()

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1>Добро пожаловать, {user.fullName.split(' ')[0]}!</h1>
        <p className="text-secondary mt-2 max-w-xl">{config.description}</p>
      </header>

      <ImageSlider />

      {user.role === 'admin' && (
        <div className="card-static flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-body">Вы вошли как администратор.</p>
          <Link to="/admin/dashboard" className="btn-primary shrink-0">Панель администратора</Link>
        </div>
      )}

      <section>
        <h2>Наши помещения</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {rooms.map((room) => (
            <div key={room.label} className="room-card group">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={room.img}
                  alt={room.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-sm font-medium text-center py-3 text-banquet-ink">{room.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <QualityBlock />
        <ContactsBlock />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card-static">
          <h3>Профиль</h3>
          <dl className="mt-4 space-y-2 text-body">
            <div>
              <dt className="text-secondary">Роль</dt>
              <dd className="font-medium">{user.role === 'admin' ? 'Администратор' : 'Пользователь'}</dd>
            </div>
            <div>
              <dt className="text-secondary">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-secondary">Регистрация</dt>
              <dd className="font-medium">
                {user.createdAt ? format(new Date(user.createdAt), 'd MMMM yyyy', { locale: ru }) : 'Сегодня'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card-static flex flex-col">
          <h3>Действия</h3>
          <div className="mt-4 flex flex-col gap-3 flex-1 justify-end">
            <Link to="/applications" className="btn-secondary text-center">
              {config.labels?.viewButton || 'Мои заявки'}
            </Link>
            <Link to="/applications/new" className="btn-primary text-center">
              {config.labels?.createButton || 'Оформить бронирование'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
