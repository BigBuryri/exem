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
    <div className="space-y-6">
      <div>
        <h1>Добро пожаловать, {user.fullName.split(' ')[0]}!</h1>
        <p className="text-secondary mt-1">{config.description}</p>
      </div>

      <ImageSlider />

      {user.role === 'admin' && (
        <div className="card">
          <p className="text-sm mb-3">Вы вошли как администратор.</p>
          <Link to="/admin/dashboard" className="btn-primary">Панель администратора</Link>
        </div>
      )}

      <div>
        <h2>Наши помещения</h2>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {rooms.map((room) => (
            <div key={room.label} className="border border-gray-200 rounded bg-white overflow-hidden">
              <img src={room.img} alt={room.label} className="h-24 w-full object-cover" />
              <p className="text-sm text-center py-2">{room.label}</p>
            </div>
          ))}
        </div>
      </div>

      <QualityBlock />
      <ContactsBlock />

      <div className="card">
        <h3>Профиль</h3>
        <p className="text-sm mt-2">{user.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
        <p className="text-sm">{user.email}</p>
        <p className="text-secondary text-sm mt-1">
          Регистрация: {user.createdAt ? format(new Date(user.createdAt), 'd MMMM yyyy', { locale: ru }) : 'Сегодня'}
        </p>
      </div>

      <div className="card">
        <h3>Действия</h3>
        <div className="mt-3 flex flex-col gap-2">
          <Link to="/applications" className="btn-secondary text-center">
            {config.labels?.viewButton || 'Мои заявки'}
          </Link>
          <Link to="/applications/new" className="btn-primary text-center">
            {config.labels?.createButton || 'Оформить бронирование'}
          </Link>
        </div>
      </div>
    </div>
  )
}
