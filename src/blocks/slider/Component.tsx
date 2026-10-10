import React from 'react'

import { getPayloadClient } from '../../getPayload'
import { getLayoutSlugs } from '../../runtime'
import { SliderClient, type SlideData } from './Component.client'

type SliderDoc = {
  slides?: SlideData[] | null
}

type Props = {
  slider?: number | SliderDoc | null
  autoplay?: boolean | null
  intervalSeconds?: number | null
}

export const SliderBlock: React.FC<Props> = async ({ slider, autoplay, intervalSeconds }) => {
  let resolved: SliderDoc | null = slider && typeof slider === 'object' ? slider : null

  if (!resolved && typeof slider === 'number') {
    const payload = await getPayloadClient()
    resolved = (await payload.findByID({
      collection: getLayoutSlugs().sliders as 'sliders',
      id: slider,
      depth: 2,
    })) as SliderDoc
  }

  if (!resolved?.slides?.length) return null

  return (
    <SliderClient slides={resolved.slides} autoplay={autoplay} intervalSeconds={intervalSeconds} />
  )
}
