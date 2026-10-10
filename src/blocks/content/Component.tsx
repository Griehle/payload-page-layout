import React from 'react'

import { DefaultLink } from '../../defaults/link'
import { DefaultRichText } from '../../defaults/rich-text'
import type { LayoutLinkProps, RichTextProps } from '../../types'
import { cn } from '../../utilities/cn'
import { RenderBlocks, type BlockComponents, type LayoutBlock } from '../RenderBlocks'

const columnClasses = {
  oneSixth: 'col-span-4 md:col-span-2 lg:col-span-2',
  oneQuarter: 'col-span-4 md:col-span-2 lg:col-span-3',
  oneThird: 'col-span-4 md:col-span-2 lg:col-span-4',
  half: 'col-span-4 md:col-span-2 lg:col-span-6',
  twoThirds: 'col-span-4 lg:col-span-8',
  threeQuarters: 'col-span-4 lg:col-span-9',
  fiveSixths: 'col-span-4 lg:col-span-10',
  full: 'col-span-4 lg:col-span-12',
} as const

type ColumnSize = keyof typeof columnClasses

type Column = {
  size?: ColumnSize | null
  richText?: unknown
  blocks?: LayoutBlock[] | null
  enableLink?: boolean | null
  link?: LayoutLinkProps | null
}

type Props = {
  columns?: Column[] | null
  nested?: boolean
  renderLink?: React.ComponentType<LayoutLinkProps>
  renderRichText?: React.ComponentType<RichTextProps>
  blockComponents?: BlockComponents
}

export const ContentBlock: React.FC<Props> = ({
  columns,
  nested,
  renderLink: LinkComponent = DefaultLink,
  renderRichText: RichTextComponent = DefaultRichText,
  blockComponents,
}) => {
  return (
    <div className={cn(!nested && 'container my-16')}>
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-8 lg:gap-x-16">
        {columns?.map((col, index) => {
          const span = columnClasses[col.size || 'oneThird'] ?? columnClasses.oneThird

          return (
            <div className={span} key={index}>
              {col.richText ? (
                <RichTextComponent data={col.richText} enableGutter={false} />
              ) : null}
              {col.blocks && col.blocks.length > 0 && (
                <RenderBlocks
                  blocks={col.blocks}
                  nested
                  renderLink={LinkComponent}
                  renderRichText={RichTextComponent}
                  blockComponents={blockComponents}
                />
              )}
              {col.enableLink && col.link ? <LinkComponent {...col.link} /> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
