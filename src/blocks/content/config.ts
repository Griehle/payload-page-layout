import type { Block, Field } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '../../fields/link'

function columnFields(blocks: Block[], relationTo: string[]): Field[] {
  return [
    {
      name: 'size',
      type: 'select',
      defaultValue: 'oneThird',
      admin: {
        description:
          'Four 1/4 columns fill one row. Six 1/6 columns fill one row. Mix widths as long as they add up to a full row.',
      },
      options: [
        { label: '1/6', value: 'oneSixth' },
        { label: '1/4', value: 'oneQuarter' },
        { label: '1/3', value: 'oneThird' },
        { label: '1/2', value: 'half' },
        { label: '2/3', value: 'twoThirds' },
        { label: '3/4', value: 'threeQuarters' },
        { label: '5/6', value: 'fiveSixths' },
        { label: 'Full', value: 'full' },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: false,
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Column content',
      admin: {
        initCollapsed: true,
        description: 'Optional. Add an image, video, slider, form, or a row. Text above still shows.',
      },
      blocks,
    },
    {
      name: 'enableLink',
      type: 'checkbox',
    },
    link({
      relationTo,
      overrides: {
        admin: {
          condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
        },
      },
    }),
  ]
}

export function contentBlock(args: {
  slug: 'content' | 'contentRow'
  interfaceName: string
  labels: { singular: string; plural: string }
  blocks: Block[]
  relationTo: string[]
}): Block {
  return {
    slug: args.slug,
    interfaceName: args.interfaceName,
    labels: args.labels,
    fields: [
      {
        name: 'columns',
        type: 'array',
        admin: { initCollapsed: true },
        fields: columnFields(args.blocks, args.relationTo),
      },
    ],
  }
}
