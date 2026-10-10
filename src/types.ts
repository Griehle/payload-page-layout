import type { ReactNode } from 'react'
import type { Block, CollectionConfig } from 'payload'

export type LayoutPluginOptions = {
  /** Collections whose `layout` blocks field receives these blocks. Defaults to `['pages']`. */
  collections?: string[]
  /** Blocks-field name to fill. Defaults to `layout`. */
  fieldName?: string
  /** Collections an internal link can point at. Defaults to `['pages']`. */
  linkRelationTo?: string[]
  /** Host-app blocks to include in the layout and inside content columns. */
  extraBlocks?: Block[]
  /** Upload collection used for slider images. Defaults to `media`. */
  mediaSlug?: string
  slidersSlug?: string
  flipbooksSlug?: string
  /** Directory for uploaded flipbook PDFs. Defaults to `public/flipbooks`. */
  flipbooksDir?: string
  disabled?: boolean
}

export type LayoutParts = {
  /** Blocks to place in a page layout field. Includes the content (columns) block. */
  blocks: Block[]
  collections: CollectionConfig[]
  slidersSlug: string
  flipbooksSlug: string
}

export type LayoutLinkProps = {
  type?: 'custom' | 'reference' | null
  newTab?: boolean | null
  url?: string | null
  label?: string | null
  appearance?: 'default' | 'outline' | 'inline' | null
  size?: 'sm' | 'default' | 'lg' | 'clear' | null
  className?: string
  children?: ReactNode
  reference?: {
    relationTo: string
    value: { slug?: string | null } | string | number
  } | null
}

export type RichTextProps = {
  data?: unknown
  enableGutter?: boolean
  className?: string
}
