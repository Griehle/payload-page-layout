import React from 'react'

import { cn } from '../../utilities/cn'

export const HtmlBlock: React.FC<{ html?: string | null; nested?: boolean }> = ({ html, nested }) => {
  if (!html?.trim()) return null

  return <div className={cn(!nested && 'container')} dangerouslySetInnerHTML={{ __html: html }} />
}
