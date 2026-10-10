import type { Block, CollectionSlug } from 'payload'

export function sliderBlock(relationTo: string): Block {
  return {
    slug: 'slider',
    interfaceName: 'SliderBlock',
    labels: { singular: 'Slider', plural: 'Sliders' },
    fields: [
      {
        name: 'slider',
        type: 'relationship',
        relationTo: relationTo as CollectionSlug,
        required: true,
      },
      {
        name: 'autoplay',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        name: 'intervalSeconds',
        type: 'number',
        defaultValue: 6,
        min: 2,
        admin: { condition: (_, siblingData) => Boolean(siblingData?.autoplay) },
      },
    ],
  }
}
