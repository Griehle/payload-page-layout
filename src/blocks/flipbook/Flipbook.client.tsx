'use client'
import HTMLFlipBook from 'react-pageflip'
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist'

type Props = { url: string; title?: string | null }

const RENDER_WIDTH = 1200 // px; source resolution of each rendered page
const PRELOAD_AHEAD = 4
const FLIP_MS = 700

/** Closed cover sits on the right half of the two-page stage; the back cover sits on the left. */
function centerShift(
  pageIndex: number,
  pageWidth: number,
  orientation: string,
  pageCount: number,
): number {
  if (orientation !== 'landscape') return 0
  if (pageIndex <= 0) return -pageWidth / 2
  if (pageCount % 2 === 0 && pageIndex >= pageCount - 1) return pageWidth / 2
  return 0
}

const FlipPage = forwardRef<HTMLDivElement, { src: string | null; label: string }>(
  function FlipPage({ src, label }, ref) {
    return (
      <div ref={ref} className="bg-white">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={label} className="h-full w-full select-none" draggable={false} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            Loading…
          </div>
        )}
      </div>
    )
  },
)

const Flipbook: React.FC<Props> = ({ url, title }) => {
  const [pageCount, setPageCount] = useState(0)
  const [aspect, setAspect] = useState(1.3) // height / width
  const [images, setImages] = useState<(string | null)[]>([])
  const [current, setCurrent] = useState(0)
  const [error, setError] = useState(false)

  const pdfRef = useRef<PDFDocumentProxy | null>(null)
  const taskRef = useRef<PDFDocumentLoadingTask | null>(null)
  const inFlight = useRef(new Set<number>())
  const bookRef = useRef<{ pageFlip: () => any } | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [placed, setPlaced] = useState(false)

  const placeBook = useCallback((pageIndex: number, animate: boolean) => {
    const stage = stageRef.current
    const flip = bookRef.current?.pageFlip()
    if (!stage || !flip) return
    const shift = centerShift(
      pageIndex,
      flip.getBoundsRect().pageWidth,
      flip.getOrientation(),
      flip.getPageCount(),
    )
    stage.style.transition = animate ? `transform ${FLIP_MS}ms ease-in-out` : 'none'
    stage.style.transform = `translateX(${shift}px)`
  }, [])

  useEffect(() => {
    const onResize = () => {
      const flip = bookRef.current?.pageFlip()
      if (!flip) return
      placeBook(flip.getCurrentPageIndex(), false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [placeBook])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString()
        taskRef.current = pdfjs.getDocument({
          url,
          wasmUrl: '/pdfjs/wasm/',
          cMapUrl: '/pdfjs/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: '/pdfjs/standard_fonts/',
          iccUrl: '/pdfjs/iccs/',
        })
        const pdf = await taskRef.current.promise
        if (cancelled) return
        pdfRef.current = pdf
        const first = await pdf.getPage(1)
        const vp = first.getViewport({ scale: 1 })
        if (cancelled) return
        setAspect(vp.height / vp.width)
        setImages(new Array(pdf.numPages).fill(null))
        setPageCount(pdf.numPages)
      } catch {
        if (!cancelled) setError(true)
      }
    })()
    return () => {
      cancelled = true
      void taskRef.current?.destroy()
      taskRef.current = null
      pdfRef.current = null
    }
  }, [url])

  const loadPage = useCallback(async (index: number) => {
    const pdf = pdfRef.current
    if (!pdf || index < 0 || index >= pdf.numPages || inFlight.current.has(index)) return
    inFlight.current.add(index)
    try {
      const page = await pdf.getPage(index + 1)
      const base = page.getViewport({ scale: 1 })
      const viewport = page.getViewport({ scale: RENDER_WIDTH / base.width })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({ canvas, viewport }).promise
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      setImages((prev) => {
        const next = [...prev]
        next[index] = dataUrl
        return next
      })
    } catch (err) {
      console.error('Flipbook: failed to render page', index + 1, err)
      inFlight.current.delete(index)
    }
  }, [])

  useEffect(() => {
    if (!pageCount) return
    for (let i = current - 2; i <= current + PRELOAD_AHEAD; i++) void loadPage(i)
  }, [current, pageCount, loadPage])

  if (error) {
    return (
      <p className="text-center">
        This document could not be displayed.{' '}
        <a href={url} className="underline" target="_blank" rel="noopener noreferrer">
          Open the PDF
        </a>
      </p>
    )
  }

  if (!pageCount) return <div className="h-[420px] w-full animate-pulse rounded bg-muted" />

  const baseWidth = 500
  const baseHeight = Math.round(baseWidth * aspect)

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-4">
      <div ref={stageRef} className="w-full" style={{ opacity: placed ? 1 : 0 }}>
      <HTMLFlipBook
        ref={bookRef as any}
        width={baseWidth}
        height={baseHeight}
        size="stretch"
        minWidth={260}
        maxWidth={700}
        minHeight={Math.round(260 * aspect)}
        maxHeight={Math.round(700 * aspect)}
        showCover
        drawShadow
        maxShadowOpacity={0.5}
        mobileScrollSupport={false}
        usePortrait
        startPage={0}
        flippingTime={700}
        autoSize
        className="shadow-xl"
        style={{}}
        startZIndex={0}
        clickEventForward
        useMouseEvents
        swipeDistance={30}
        showPageCorners
        disableFlipByClick={false}
        onFlip={(e: { data: number }) => setCurrent(e.data)}
        onInit={(e: { data: { page: number } }) => {
          placeBook(e.data?.page ?? 0, false)
          setPlaced(true)
        }}
        onChangeOrientation={() => {
          const flip = bookRef.current?.pageFlip()
          if (flip) placeBook(flip.getCurrentPageIndex(), false)
        }}
        onChangeState={(e: { data: string }) => {
          const flip = bookRef.current?.pageFlip()
          if (!flip) return
          if (e.data === 'flipping') {
            const current = flip.getCurrentPageIndex()
            const count = flip.getPageCount()
            const forward = flip.getRender().getDirection() === 0
            const destination = forward
              ? Math.min(current === 0 ? 1 : current + 2, count - 1)
              : Math.max(current <= 1 ? 0 : current - 2, 0)
            placeBook(destination, true)
            return
          }
          if (e.data === 'read') placeBook(flip.getCurrentPageIndex(), true)
        }}
      >
        {images.map((src, i) => (
          <FlipPage key={i} src={src} label={`${title ?? 'Document'} – page ${i + 1}`} />
        ))}
      </HTMLFlipBook>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <button
          type="button"
          className="rounded border px-3 py-1"
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          aria-label="Previous page"
        >
          ‹ Prev
        </button>
        <span>
          Page {Math.min(current + 1, pageCount)} of {pageCount}
        </span>
        <button
          type="button"
          className="rounded border px-3 py-1"
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          aria-label="Next page"
        >
          Next ›
        </button>
        <a href={url} className="underline" target="_blank" rel="noopener noreferrer" download>
          Download PDF
        </a>
      </div>
    </div>
  )
}

export default Flipbook
