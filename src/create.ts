import path from 'path'
import type { Block } from 'payload'

import { buttonBlock } from './blocks/button/config'
import { contentBlock } from './blocks/content/config'
import { flipbookBlock } from './blocks/flipbook/config'
import { htmlBlock } from './blocks/html/config'
import { sliderBlock } from './blocks/slider/config'
import { videoBlock } from './blocks/video/config'
import { flipbooksCollection } from './collections/flipbooks'
import { slidersCollection } from './collections/sliders'
import { setLayoutSlugs } from './runtime'
import type { LayoutParts, LayoutPluginOptions } from './types'

export function createLayout(options: LayoutPluginOptions = {}): LayoutParts {
  const relationTo = options.linkRelationTo ?? ['pages']
  const mediaSlug = options.mediaSlug ?? 'media'
  const slidersSlug = options.slidersSlug ?? 'sliders'
  const flipbooksSlug = options.flipbooksSlug ?? 'flipbooks'
  const extraBlocks = options.extraBlocks ?? []

  setLayoutSlugs({ sliders: slidersSlug, flipbooks: flipbooksSlug })

  const button = buttonBlock(relationTo)
  const slider = sliderBlock(slidersSlug)
  const flipbook = flipbookBlock(flipbooksSlug)
  const leafBlocks: Block[] = [...extraBlocks, slider, flipbook, videoBlock, htmlBlock, button]

  const row = contentBlock({
    slug: 'contentRow',
    interfaceName: 'ContentRowBlock',
    labels: { singular: 'Row', plural: 'Rows' },
    blocks: leafBlocks,
    relationTo,
  })

  const content = contentBlock({
    slug: 'content',
    interfaceName: 'ContentBlock',
    labels: { singular: 'Content', plural: 'Content' },
    blocks: [...leafBlocks, row],
    relationTo,
  })

  return {
    blocks: [content, slider, flipbook, videoBlock, htmlBlock, button],
    collections: [
      slidersCollection({ slug: slidersSlug, mediaSlug, relationTo }),
      flipbooksCollection({
        slug: flipbooksSlug,
        staticDir: options.flipbooksDir ?? path.resolve(process.cwd(), 'public/flipbooks'),
      }),
    ],
    slidersSlug,
    flipbooksSlug,
  }
}
