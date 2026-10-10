import React from 'react'

import { alignClasses, sizeClasses, type AlignKey, type SizeKey } from '../../fields/sizing'
import { cn } from '../../utilities/cn'
import { getEmbedUrl } from './embed'

type Props = {
  url?: string | null
  title?: string | null
  showTitle?: boolean | null
  titlePosition?: 'above' | 'below' | null
  aspectRatio?: string | null
  size?: SizeKey | null
  align?: AlignKey | null
  nested?: boolean
}

export const VideoBlock: React.FC<Props> = ({
  url,
  title,
  showTitle,
  titlePosition,
  aspectRatio,
  size,
  align,
  nested,
}) => {
  const src = getEmbedUrl(url)
  if (!src) return null

  const sizeKey = size ?? 'full'
  const visibleTitle = showTitle && title ? title : null
  const below = titlePosition === 'below'

  return (
    <div className={cn('pt-[1em]', !nested && 'container')}>
      <figure
        className={cn(
          'flex w-full gap-3',
          below ? 'flex-col-reverse' : 'flex-col',
          sizeClasses[sizeKey],
          sizeKey !== 'full' && alignClasses[align ?? 'center'],
        )}
      >
        {visibleTitle && <figcaption className="text-lg font-semibold">{visibleTitle}</figcaption>}
        <iframe
          src={src}
          title={title || 'Embedded video'}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full rounded-[0.8rem] border border-border"
          style={{ aspectRatio: (aspectRatio ?? '16/9').replace('/', ' / ') }}
        />
      </figure>
    </div>
  )
}
