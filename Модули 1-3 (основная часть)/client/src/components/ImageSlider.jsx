import { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'

const SLIDES = [
  { src: '/assets/3505f015e0d26644e8e4c.jpg', alt: 'Зал' },
  { src: '/assets/339037.jpeg', alt: 'Ресторан' },
  { src: '/assets/1686676944_elles-top-p-letnyaya-ploshcha.jpg', alt: 'Летняя веранда' },
  { src: '/assets/1671649122_idei-club-p-veranda-.jpg', alt: 'Закрытая веранда' },
]

export default function ImageSlider() {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDES.length)
  }, [])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="border border-gray-200 rounded overflow-hidden bg-white">
      <div className="relative aspect-video bg-gray-200">
        <img
          src={SLIDES[index].src}
          alt={SLIDES[index].alt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center justify-between px-3 py-2 text-sm border-t border-gray-200">
        <button type="button" onClick={prev} className="text-banquet-wine hover:underline">←</button>
        <span className="text-banquet-muted">{SLIDES[index].alt}</span>
        <button type="button" onClick={next} className="text-banquet-wine hover:underline">→</button>
      </div>
    </div>
  )
}
