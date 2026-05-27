import PageLogo from './PageLogo'
import SocialLinks from './SocialLinks'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="max-w-md mx-auto w-full px-4 py-10 flex-1">
        <div className="text-center mb-6">
          <PageLogo className="h-10 w-10 mx-auto mb-3" />
          <h1 className="text-2xl">{title}</h1>
          {subtitle && <p className="text-secondary mt-1">{subtitle}</p>}
        </div>

        <div className="card">{children}</div>
      </div>

      <footer className="pb-8 text-center">
        <SocialLinks />
        <p className="text-secondary text-xs mt-2">Банкетам.Нет</p>
      </footer>
    </div>
  )
}
