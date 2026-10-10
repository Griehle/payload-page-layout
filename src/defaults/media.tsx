import React from 'react'

import type { MediaSlotProps } from '../client/slots'
import { cn } from '../utilities/cn'

export const DefaultMedia: React.FC<MediaSlotProps> = ({
  alt,
  className,
  imgClassName,
  pictureClassName,
  resource,
}) => {
  if (!resource || typeof resource !== 'object') return null
  const media = resource as { url?: string | null; alt?: string | null }
  if (!media.url) return null

  return (
    <picture className={pictureClassName}>
      {/* Fallback when the host app does not pass its own media component. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media.url} alt={alt || media.alt || ''} className={cn(className, imgClassName)} />
    </picture>
  )
}
