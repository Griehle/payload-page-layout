import React, { Fragment } from 'react'

import { ButtonBlock } from './button/Component'
import { ContentBlock } from './content/Component'
import { FlipbookBlock } from './flipbook/Component'
import { HtmlBlock } from './html/Component'
import { SliderBlock } from './slider/Component'
import { VideoBlock } from './video/Component'

export type LayoutBlock = { blockType?: string | null } & Record<string, unknown>

export type BlockComponents = Record<string, React.ComponentType<any>>

export type RenderBlocksProps = {
  blocks?: LayoutBlock[] | null
  /** Inside a content column: drop the page container and the large outer margin. */
  nested?: boolean
  renderLink?: React.ComponentType<any>
  renderRichText?: React.ComponentType<any>
  /** Host-app block components, keyed by block slug (`cta`, `mediaBlock`, `archive`, `formBlock`, …). */
  blockComponents?: BlockComponents
}

const packageBlocks = {
  button: ButtonBlock,
  content: ContentBlock,
  contentRow: ContentBlock,
  html: HtmlBlock,
  slider: SliderBlock,
  flipbook: FlipbookBlock,
  video: VideoBlock,
}

export const RenderBlocks: React.FC<RenderBlocksProps> = (props) => {
  const { blocks, nested = false, renderLink, renderRichText, blockComponents } = props
  const registry: BlockComponents = { ...blockComponents, ...packageBlocks }
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (!hasBlocks) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block
        if (!blockType || !(blockType in registry)) return null

        const Block = registry[blockType]
        if (!Block) return null

        return (
          <div className={nested ? 'my-4 first:mt-0 last:mb-0' : 'my-16'} key={index}>
            <Block
              {...block}
              disableInnerContainer
              enableGutter={!nested}
              nested={nested}
              renderLink={renderLink}
              renderRichText={renderRichText}
              blockComponents={blockComponents}
            />
          </div>
        )
      })}
    </Fragment>
  )
}
