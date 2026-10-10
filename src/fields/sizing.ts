import type { Field } from 'payload'

export const sizeClasses = {
  small: 'max-w-[300px]',
  medium: 'max-w-[500px]',
  large: 'max-w-[800px]',
  full: '',
} as const

export const alignClasses = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
} as const

export type SizeKey = keyof typeof sizeClasses
export type AlignKey = keyof typeof alignClasses

export const sizingFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'full',
    admin: { description: 'Maximum width. Height scales automatically to keep the aspect ratio.' },
    options: [
      { label: 'Small (300px)', value: 'small' },
      { label: 'Medium (500px)', value: 'medium' },
      { label: 'Large (800px)', value: 'large' },
      { label: 'Full width', value: 'full' },
    ],
  },
  {
    name: 'align',
    type: 'select',
    defaultValue: 'center',
    admin: { condition: (_, siblingData) => siblingData?.size !== 'full' },
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ],
  },
]
