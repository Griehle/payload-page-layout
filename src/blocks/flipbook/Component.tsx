import React from 'react'

import { getPayloadClient } from '../../getPayload'
import { getLayoutSlugs } from '../../runtime'
import { FlipbookLoader } from './Loader'

type FlipbookDoc = {
  url?: string | null
  title?: string | null
}

type Props = {
  flipbook?: number | FlipbookDoc | null
  nested?: boolean
}

export const FlipbookBlock: React.FC<Props> = async ({ flipbook, nested }) => {
  let resolved: FlipbookDoc | null = flipbook && typeof flipbook === 'object' ? flipbook : null

  if (!resolved && typeof flipbook === 'number') {
    const payload = await getPayloadClient()
    resolved = (await payload.findByID({
      collection: getLayoutSlugs().flipbooks as 'flipbooks',
      id: flipbook,
      depth: 0,
    })) as FlipbookDoc
  }

  if (!resolved?.url) return null

  return (
    <div className={nested ? undefined : 'container'}>
      <FlipbookLoader url={resolved.url} title={resolved.title} />
    </div>
  )
}
