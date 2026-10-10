import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { RichTextProps } from '../types'

export const DefaultRichText: React.FC<RichTextProps> = ({ className, data }) => {
  if (!data) return null
  return <RichText className={className} data={data as never} />
}
