export default function SocialLinks({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/social/social.png"
        alt="ВКонтакте и Одноклассники"
        className="h-8 w-auto object-contain opacity-90"
      />
    </div>
  )
}
