import type { Block } from 'payload'

import { sizingFields } from '../../fields/sizing'
import { getEmbedUrl } from './embed'

export const videoBlock: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Video URL',
      admin: { description: 'Paste the Vimeo link (including unlisted links).' },
      validate: (value: string | null | undefined) =>
        getEmbedUrl(value) ? true : 'Enter a valid Vimeo link.',
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Short description of the video. Screen readers use it even when it is hidden.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showTitle',
          type: 'checkbox',
          label: 'Show title on the page',
          defaultValue: false,
          admin: {
            width: '50%',
            style: { alignSelf: 'flex-end' },
            condition: (_, siblingData) => Boolean(siblingData?.title),
          },
        },
        {
          name: 'titlePosition',
          type: 'radio',
          label: 'Title position',
          defaultValue: 'above',
          options: [
            { label: 'Above video', value: 'above' },
            { label: 'Below video', value: 'below' },
          ],
          admin: {
            width: '50%',
            layout: 'horizontal',
            condition: (_, siblingData) => Boolean(siblingData?.title && siblingData?.showTitle),
          },
        },
      ],
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: '16/9',
      options: [
        { label: '16:9 (widescreen)', value: '16/9' },
        { label: '4:3', value: '4/3' },
        { label: '1:1 (square)', value: '1/1' },
        { label: '9:16 (vertical)', value: '9/16' },
      ],
    },
    ...sizingFields,
  ],
}
