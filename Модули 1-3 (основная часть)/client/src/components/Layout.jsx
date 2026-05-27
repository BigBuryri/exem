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

  const linkClass = (active) => clsx(active ? 'nav-link-active' : 'nav-link')

  const path = location.pathname

  const navLinks = user.role === 'admin' ? (
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
  )

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-banquet-cream/85 backdrop-blur-md border-b border-banquet-gold/30 shadow-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
              className="flex items-center gap-3 group"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-banquet-peach/60 border border-banquet-gold/40 transition-transform group-hover:scale-105">
                <PageLogo className="h-7 w-7" />
              </span>
              <span className="font-bold text-banquet-red text-lg leading-tight">{config.title}</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              {navLinks}
            </nav>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-aux text-banquet-green max-w-[140px] truncate">
                {user.fullName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="sm:hidden bg-white/60 backdrop-blur-sm border-b border-banquet-gold/25 px-4 py-2.5 flex gap-1 overflow-x-auto">
        {navLinks}
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-banquet-gold/30 bg-white/50 backdrop-blur-sm py-6 text-center">
        <SocialLinks className="mb-3 justify-center" />
        <p className="text-aux text-banquet-green">{config.contacts?.address}</p>
        <p className="text-aux text-banquet-green mt-0.5">{config.contacts?.phone}</p>
      </footer>
    </div>
  )
}
