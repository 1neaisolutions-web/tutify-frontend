/**
 * Type declarations for better-react-mathjax
 * This package may not have built-in TypeScript definitions
 */
declare module 'better-react-mathjax' {
  import { ReactNode } from 'react'

  export interface MathJaxContextProps {
    config?: any
    children: ReactNode
  }

  export interface MathJaxProps {
    inline?: boolean
    dynamic?: boolean
    children: ReactNode
  }

  export const MathJaxContext: React.FC<MathJaxContextProps>
  export const MathJax: React.FC<MathJaxProps>
}
