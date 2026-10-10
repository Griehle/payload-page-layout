import Link from 'next/link'
import React from 'react'

import type { LayoutLinkProps } from '../types'
import { cn } from '../utilities/cn'

function hrefFromLink(link: LayoutLinkProps): string | null {
  if (link.type === 'reference' && typeof link.reference?.value === 'object' && link.reference.value.slug) {
    const prefix = link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''
    return `${prefix}/${link.reference.value.slug}`
  }
  return link.url || null
}

export const DefaultLink: React.FC<LayoutLinkProps> = ({
  appearance = 'inline',
  children,
  className,
  label,
  newTab,
  size,
  ...link
}) => {
  const href = hrefFromLink({ ...link, appearance })
  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  const classes = cn(
    appearance === 'default' &&
      'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground',
    appearance === 'outline' && 'inline-flex items-center justify-center rounded-md border px-4 py-2',
    size === 'sm' && appearance !== 'inline' && 'px-3 py-1.5 text-sm',
    size === 'lg' && appearance !== 'inline' && 'px-8 py-3',
    className,
  )

  return (
    <Link className={classes} href={href} {...newTabProps}>
      {label}
      {children}
    </Link>
  )
}
