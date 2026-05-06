declare module '../redux/features/snackbarSlice/snackbarSlice' {
  export const showSnackbar: (payload: {
    message: string
    variant?: 'info' | 'success' | 'warning' | 'error'
    vertical?: string
    horizontal?: string
  }) => any
}

