import 'react-redux'

declare module 'react-redux' {
  // This codebase mixes TS and legacy JS slices without a unified RootState type.
  // For build stability, treat the store state as an open object.
  interface DefaultRootState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

export {}
