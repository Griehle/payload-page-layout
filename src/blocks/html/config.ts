import type { Block } from 'payload'

export const htmlBlock: Block = {
  slug: 'html',
  interfaceName: 'HtmlBlock',
  labels: { singular: 'HTML', plural: 'HTML' },
  fields: [
    {
      name: 'html',
      type: 'code',
      label: 'HTML',
      required: true,
      admin: {
        language: 'html',
        description:
          'Pasted as-is onto the page. Script tags do not run; use an iframe embed code when a service offers one.',
      },
    },
  ],
}
