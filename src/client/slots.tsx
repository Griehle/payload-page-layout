'use client'

import React, { createContext, useContext } from 'react'

export type MediaSlotProps = {
  alt?: string
  className?: string
  fill?: boolean
  htmlElement?: React.ElementType | null
  pictureClassName?: string
  imgClassName?: string
  priority?: boolean
  resource?: unknown
  size?: string
}

export type LayoutClientSlots = {
  /** Host media component. Typed loosely so each app can pass its own. */
  media?: React.ComponentType<any>
  /** Host link component. Typed loosely so each app can pass its own link. */
  link?: React.ComponentType<any>
}

const LayoutClientContext = createContext<LayoutClientSlots>({})

export function LayoutClientProvider({
  children,
  link,
  media,
}: LayoutClientSlots & { children: React.ReactNode }) {
  return <LayoutClientContext.Provider value={{ link, media }}>{children}</LayoutClientContext.Provider>
}

export function useLayoutSlots(): LayoutClientSlots {
  return useContext(LayoutClientContext)
}
