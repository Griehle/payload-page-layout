import type { TextField } from 'payload'

const HEX = /^#[0-9a-f]{6}$/i

export const COLOR_PICKER_PATH = 'payload-page-layout/client#ColorPickerField'

export const colorField = (
  name: string,
  label: string,
  overrides: Pick<TextField, 'admin' | 'defaultValue' | 'required'> = {},
): TextField => ({
  name,
  label,
  type: 'text',
  validate: (value: string | null | undefined) =>
    !value || HEX.test(value) ? true : 'Use a 6-digit hex color, like #1e3a5f.',
  defaultValue: overrides.defaultValue,
  required: overrides.required,
  admin: {
    ...overrides.admin,
    components: {
      Field: COLOR_PICKER_PATH,
    },
  },
})
