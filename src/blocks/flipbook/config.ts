import type { Block, CollectionSlug } from 'payload'

export function flipbookBlock(relationTo: string): Block {
  return {
    slug: 'flipbook',
    interfaceName: 'FlipbookBlock',
    labels: { singular: 'Flipbook', plural: 'Flipbooks' },
    fields: [
      {
        name: 'flipbook',
        type: 'relationship',
        relationTo: relationTo as CollectionSlug,
        required: true,
      },
    ],
  }
}
