'use client'

import React, { createContext, useState, ReactNode } from 'react'
import { LibrarySpotContextType } from '../types/library-spots'

export const LibrarySpotContext = createContext<
  LibrarySpotContextType | undefined
>(undefined)

export function LibrarySpotProvider({ children }: { children: ReactNode }) {
  const [dateTime, setDateTime] = useState<string>('')

  return (
    <LibrarySpotContext.Provider value={{ dateTime, setDateTime }}>
      {children}
    </LibrarySpotContext.Provider>
  )
}

export function useLibrarySpot() {
  const context = React.useContext(LibrarySpotContext)
  if (context === undefined) {
    throw new Error('useLibrarySpot must be used within a LibrarySpotProvider')
  }
  return context
}
