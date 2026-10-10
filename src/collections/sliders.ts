import type { CollectionConfig, CollectionSlug } from 'payload'

import { link } from '../fields/link'
import { anyone, authenticated } from './access'

export function slidersCollection(args: {
  slug: string
  mediaSlug: string
  relationTo: string[]
}): CollectionConfig {
  return {
    slug: args.slug,
    access: {
      create: authenticated,
      delete: authenticated,
      read: anyone,
      update: authenticated,
    },
    admin: {
      defaultColumns: ['title', 'updatedAt'],
      useAsTitle: 'title',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        admin: { description: 'Internal name, used to pick this slider in a page.' },
      },
      {
        name: 'slides',
        type: 'array',
        minRows: 1,
        admin: { initCollapsed: true },
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: args.mediaSlug as CollectionSlug,
            filterOptions: {
              mimeType: { contains: 'image/' },
            },
            required: true,
          },
          { name: 'heading', type: 'text' },
          { name: 'caption', type: 'textarea' },
          link({
            appearances: false,
            optional: true,
            relationTo: args.relationTo,
            overrides: { name: 'link' },
          }),
        ],
      },
    ],
  }
}
