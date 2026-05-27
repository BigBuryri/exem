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
    <div className="card-static overflow-hidden !p-0">
      <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-banquet-peach/30">
        <img
          src={SLIDES[index].src}
          alt={SLIDES[index].alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-banquet-gold/25">
        <button
          type="button"
          onClick={prev}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-banquet-peach/80 text-banquet-red hover:bg-banquet-gold/40 transition-colors"
          aria-label="Предыдущий слайд"
        >
          ←
        </button>

        <div className="flex flex-col items-center gap-1 min-w-0">
          <span className="text-sm font-medium text-banquet-ink truncate">{SLIDES[index].alt}</span>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={clsx(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-banquet-red' : 'w-1.5 bg-banquet-gold/50 hover:bg-banquet-gold'
                )}
                aria-label={`Слайд ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-banquet-peach/80 text-banquet-red hover:bg-banquet-gold/40 transition-colors"
          aria-label="Следующий слайд"
        >
          →
        </button>
      </div>
    </div>
  )
}
