import type { Block, Config, Field, Plugin } from 'payload'

import { createLayout } from './create'
import type { LayoutPluginOptions } from './types'

const preferredOrder = [
  'cta',
  'content',
  'mediaBlock',
  'slider',
  'flipbook',
  'video',
  'archive',
  'formBlock',
  'html',
  'button',
]

type BlocksField = Extract<Field, { type: 'blocks' }>

function blockSlug(block: Block): string {
  return block.slug
}

function sortBlocks(blocks: Block[]): Block[] {
  return blocks
    .map((block, index) => ({ block, index }))
    .sort((a, b) => {
      const aRank = preferredOrder.indexOf(blockSlug(a.block))
      const bRank = preferredOrder.indexOf(blockSlug(b.block))
      const aKey = aRank === -1 ? preferredOrder.length + a.index : aRank
      const bKey = bRank === -1 ? preferredOrder.length + b.index : bRank
      return aKey - bKey
    })
    .map(({ block }) => block)
}

function mergeBlocks(existing: Block[], additions: Block[]): Block[] {
  const replacements = new Map(additions.map((block) => [block.slug, block]))
  const seen = new Set<string>()
  const merged: Block[] = []

  for (const block of existing) {
    const slug = blockSlug(block)
    seen.add(slug)
    merged.push(replacements.get(slug) ?? block)
  }

  for (const block of additions) {
    if (seen.has(block.slug)) continue
    seen.add(block.slug)
    merged.push(block)
  }

  return sortBlocks(merged)
}

function mapFields(
  fields: Field[] | undefined,
  fieldName: string,
  additions: Block[],
): Field[] {
  if (!fields) return []

  return fields.map((field) => {
    let next = field

    if (next.type === 'blocks' && next.name === fieldName) {
      next = {
        ...next,
        blocks: mergeBlocks(next.blocks ?? [], additions),
      }
    }

    if (next.type === 'tabs') {
      return {
        ...next,
        tabs: next.tabs.map((tab) => ({
          ...tab,
          fields: mapFields(tab.fields, fieldName, additions),
        })),
      }
    }

    if ('fields' in next && Array.isArray(next.fields)) {
      next = { ...next, fields: mapFields(next.fields, fieldName, additions) }
    }

    if (next.type === 'blocks') {
      return {
        ...next,
        blocks: (next.blocks ?? []).map((block) => {
          if (!block.fields) return block
          return { ...block, fields: mapFields(block.fields, fieldName, additions) }
        }),
      }
    }

    return next
  })
}

function hasBlocksField(fields: Field[] | undefined, fieldName: string): boolean {
  if (!fields) return false

  return fields.some((field) => {
    if (field.type === 'blocks' && field.name === fieldName) return true
    if (field.type === 'tabs') return field.tabs.some((tab) => hasBlocksField(tab.fields, fieldName))
    if ('fields' in field && Array.isArray(field.fields)) return hasBlocksField(field.fields, fieldName)
    return false
  })
}

export const layoutPlugin =
  (options: LayoutPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    if (options.disabled) return config

    const layout = createLayout(options)
    const fieldName = options.fieldName ?? 'layout'
    const targets = new Set(options.collections ?? ['pages'])
    const additions = [...(options.extraBlocks ?? []), ...layout.blocks]
    const collections = [...(config.collections ?? [])]

    for (const collection of layout.collections) {
      if (!collections.some((existing) => existing.slug === collection.slug)) {
        collections.push(collection)
      }
    }

    return {
      ...config,
      collections: collections.map((collection) => {
        if (!targets.has(collection.slug)) return collection

        const fields = mapFields(collection.fields, fieldName, additions)
        if (hasBlocksField(collection.fields, fieldName)) {
          return { ...collection, fields }
        }

        const layoutField: BlocksField = {
          name: fieldName,
          type: 'blocks',
          blocks: sortBlocks(additions),
          required: true,
          admin: { initCollapsed: true },
        }

        return { ...collection, fields: [...fields, layoutField] }
      }),
    }
  }
