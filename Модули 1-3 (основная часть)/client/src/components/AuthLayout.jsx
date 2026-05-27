import PageLogo from './PageLogo'
import SocialLinks from './SocialLinks'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="auth-blob -top-24 -right-24 h-72 w-72 bg-banquet-peach" aria-hidden />
      <div className="auth-blob -bottom-32 -left-20 h-80 w-80 bg-banquet-gold/30" aria-hidden />

      <div className="relative max-w-md mx-auto w-full px-4 py-12 sm:py-16 flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 border border-banquet-gold/40 shadow-card mb-4">
            <PageLogo className="h-9 w-9" />
          </span>
          <h1>{title}</h1>
          {subtitle && <p className="text-secondary mt-2">{subtitle}</p>}
        </div>

        <div className="card-static">{children}</div>
      </div>

      <footer className="relative pb-10 text-center">
        <SocialLinks />
        <p className="text-secondary mt-3">Банкетам.Нет</p>
      </footer>
    </div>
  )
}
