import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useConfig } from '../contexts/ConfigContext'
import PageLogo from './PageLogo'
import SocialLinks from './SocialLinks'
import clsx from 'clsx'

export default function Layout() {
  const { user, logout } = useAuth()
  const { config } = useConfig()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = (active) =>
    clsx('text-sm', active ? 'font-semibold text-banquet-wine' : 'text-banquet-muted hover:text-banquet-ink')

  const path = location.pathname

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2">
              <PageLogo className="h-8 w-8" />
              <span className="font-bold text-banquet-ink">{config.title}</span>
            </Link>

            <nav className="hidden sm:flex gap-5">
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin/dashboard" className={linkClass(path.startsWith('/admin/dashboard'))}>Панель</Link>
                  <Link to="/admin/applications" className={linkClass(path.startsWith('/admin/applications'))}>Заявки</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={linkClass(path === '/dashboard')}>Главная</Link>
                  <Link to="/applications" className={linkClass(path === '/applications')}>
                    {config.labels?.viewButton || 'Мои заявки'}
                  </Link>
                  <Link to="/applications/new" className={linkClass(path.startsWith('/applications/new'))}>Бронирование</Link>
                </>
              )}
            </nav>

            <div className="flex items-center gap-3 text-sm">
              <span className="hidden md:inline text-banquet-muted">{user.fullName}</span>
              <button type="button" onClick={handleLogout} className="text-banquet-wine hover:underline">
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="sm:hidden bg-white border-b border-gray-200 px-4 py-2 flex gap-4">
        {user.role === 'admin' ? (
          <>
            <Link to="/admin/dashboard" className={linkClass(path.startsWith('/admin/dashboard'))}>Панель</Link>
            <Link to="/admin/applications" className={linkClass(path.startsWith('/admin/applications'))}>Заявки</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={linkClass(path === '/dashboard')}>Главная</Link>
            <Link to="/applications" className={linkClass(path === '/applications')}>Заявки</Link>
            <Link to="/applications/new" className={linkClass(path.startsWith('/applications/new'))}>Бронь</Link>
          </>
        )}
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-banquet-muted">
        <SocialLinks className="mb-2" />
        <p>{config.contacts?.address}</p>
        <p>{config.contacts?.phone}</p>
      </footer>
    </div>
  )
}
