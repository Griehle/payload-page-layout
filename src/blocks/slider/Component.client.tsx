'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useLayoutSlots } from '../../client/slots'
import { DefaultLink } from '../../defaults/link'
import { DefaultMedia } from '../../defaults/media'
import type { LayoutLinkProps } from '../../types'

export type SlideData = {
  id?: string | null
  image?: unknown
  heading?: string | null
  caption?: string | null
  link?: LayoutLinkProps | null
}

type Props = {
  slides: SlideData[]
  autoplay?: boolean | null
  intervalSeconds?: number | null
}

export const SliderClient: React.FC<Props> = ({ slides, autoplay, intervalSeconds }) => {
  const slots = useLayoutSlots()
  const Media = slots.media ?? DefaultMedia
  const LinkComponent = slots.link ?? DefaultLink
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])

  useEffect(() => {
    if (!autoplay || paused || count < 2) return
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), (intervalSeconds || 6) * 1000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [autoplay, paused, count, intervalSeconds])

  if (!count) return null

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id ?? i}
            className="relative h-[clamp(220px,40vw,475px)] min-w-full"
            aria-hidden={i !== index}
            aria-roledescription="slide"
          >
            <Media
              fill
              priority={i === 0}
              size="100vw"
              pictureClassName="absolute inset-0"
              imgClassName="object-cover object-center"
              resource={slide.image}
            />
            {(slide.heading || slide.caption || slide.link) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 px-14 text-center text-white">
                {slide.heading && <h3 className="text-2xl font-semibold md:text-4xl">{slide.heading}</h3>}
                {slide.caption && <p className="max-w-2xl md:text-lg">{slide.caption}</p>}
                {slide.link && <LinkComponent {...slide.link} className="mt-2 underline" />}
              </div>
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
