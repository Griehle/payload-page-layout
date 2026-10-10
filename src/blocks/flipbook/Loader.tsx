'use client'

import dynamic from 'next/dynamic'
import React from 'react'

export const FlipbookLoader = dynamic(() => import('./Flipbook.client'), {
  ssr: false,
  loading: () => <div className="h-[420px] w-full animate-pulse rounded bg-muted" />,
})
