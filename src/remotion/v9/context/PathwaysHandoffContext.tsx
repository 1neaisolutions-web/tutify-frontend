/**
 * Enables V9-only bracket-close → zoom-in handoff on Scene07 pathways finale.
 */
import React, { createContext, useContext } from 'react'

const PathwaysHandoffContext = createContext(false)

export const PathwaysHandoffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PathwaysHandoffContext.Provider value={true}>{children}</PathwaysHandoffContext.Provider>
)

export const usePathwaysHandoff = (): boolean => useContext(PathwaysHandoffContext)
