import React from 'react'

import { DefaultLink } from '../../defaults/link'
import type { LayoutLinkProps } from '../../types'
import { cn } from '../../utilities/cn'

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
} as const

type Props = {
  link?: LayoutLinkProps | null
  size?: 'sm' | 'default' | 'lg' | null
  align?: keyof typeof alignClasses | null
  fullWidth?: boolean | null
  backgroundColor?: string | null
  textColor?: string | null
  fontSize?: number | null
  paddingX?: number | null
  paddingY?: number | null
  nested?: boolean
  renderLink?: React.ComponentType<LayoutLinkProps>
}

export const ButtonBlock: React.FC<Props> = ({
  link,
  size,
  align,
  fullWidth,
  backgroundColor,
  textColor,
  fontSize,
  paddingX,
  paddingY,
  nested,
  renderLink: LinkComponent = DefaultLink,
}) => {
  if (!link) return null

  const customColors = Boolean(backgroundColor || textColor)
  const px = (n?: number | null) => (typeof n === 'number' ? `${n}px` : undefined)

  return (
    <div className={cn(!nested && 'container')}>
      <div
        className={cn('flex', alignClasses[align ?? 'left'])}
        style={
          {
            '--btn-bg': backgroundColor || undefined,
            '--btn-fg': textColor || undefined,
            '--btn-fs': px(fontSize),
            '--btn-px': px(paddingX),
            '--btn-py': px(paddingY) ?? (typeof fontSize === 'number' ? '0.5em' : undefined),
          } as React.CSSProperties
        }
      >
        <LinkComponent
          {...link}
          appearance={link.appearance ?? 'default'}
          size={size ?? 'default'}
          className={cn(
            fullWidth && 'w-full',
            backgroundColor && 'bg-(--btn-bg) hover:bg-(--btn-bg) border-(--btn-bg)',
            textColor && 'text-(--btn-fg) hover:text-(--btn-fg)',
            customColors && 'hover:opacity-90',
            typeof fontSize === 'number' && 'text-(length:--btn-fs)',
            typeof paddingX === 'number' && 'px-(--btn-px) has-[>svg]:px-(--btn-px)',
            (typeof paddingY === 'number' || typeof fontSize === 'number') && 'h-auto py-(--btn-py)',
          )}
        />
      </div>
    </div>
  )
}
