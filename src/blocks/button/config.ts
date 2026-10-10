import type { Block } from 'payload'

import { colorField } from '../../fields/color'
import { link } from '../../fields/link'

export function buttonBlock(relationTo: string[]): Block {
  return {
    slug: 'button',
    interfaceName: 'ButtonBlock',
    labels: { singular: 'Button', plural: 'Buttons' },
    fields: [
      link({ appearances: ['default', 'outline'], relationTo }),
      {
        type: 'row',
        fields: [
          {
            name: 'size',
            type: 'select',
            defaultValue: 'default',
            admin: { width: '33%' },
            options: [
              { label: 'Small', value: 'sm' },
              { label: 'Medium', value: 'default' },
              { label: 'Large', value: 'lg' },
            ],
          },
          {
            name: 'align',
            type: 'select',
            defaultValue: 'left',
            admin: {
              width: '33%',
              condition: (_, siblingData) => !siblingData?.fullWidth,
            },
            options: [
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ],
          },
          {
            name: 'fullWidth',
            type: 'checkbox',
            label: 'Stretch to full width',
            admin: { width: '33%', style: { alignSelf: 'flex-end' } },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          colorField('backgroundColor', 'Background color', {
            admin: { width: '50%', description: 'Leave empty to use the site default.' },
          }),
          colorField('textColor', 'Text color', {
            admin: { width: '50%', description: 'Leave empty to use the site default.' },
          }),
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'fontSize',
            type: 'number',
            label: 'Font size (px)',
            min: 8,
            max: 96,
            admin: {
              width: '33%',
              placeholder: 'e.g. 18',
              description: 'Leave empty to use the size above.',
            },
          },
          {
            name: 'paddingY',
            type: 'number',
            label: 'Padding top & bottom (px)',
            min: 0,
            max: 120,
            admin: { width: '33%', placeholder: 'e.g. 12' },
          },
          {
            name: 'paddingX',
            type: 'number',
            label: 'Padding left & right (px)',
            min: 0,
            max: 200,
            admin: { width: '33%', placeholder: 'e.g. 24' },
          },
        ],
      },
    ],
  }
}
