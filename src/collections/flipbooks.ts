import path from 'path'
import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from './access'

export function flipbooksCollection(args: { slug: string; staticDir?: string }): CollectionConfig {
  return {
    slug: args.slug,
    labels: { singular: 'Flipbook', plural: 'Flipbooks' },
    access: {
      create: authenticated,
      delete: authenticated,
      read: anyone,
      update: authenticated,
    },
    admin: {
      defaultColumns: ['title', 'filename', 'updatedAt'],
      useAsTitle: 'title',
      description: 'Upload a PDF here, then add it to a page with the Flipbook block.',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
    ],
    upload: {
      staticDir: args.staticDir ?? path.resolve(process.cwd(), 'public/flipbooks'),
      mimeTypes: ['application/pdf'],
    },
  }
}
