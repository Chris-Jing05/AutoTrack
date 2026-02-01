'use client'

import { useEffect } from 'react'

export default function GlobalErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)

      // Prevent the default browser behavior
      event.preventDefault()

      // Handle undefined or null errors gracefully
      let errorMessage = 'An unexpected error occurred'

      if (event.reason) {
        if (event.reason instanceof Error) {
          errorMessage = event.reason.message || errorMessage
        } else if (typeof event.reason === 'string') {
          errorMessage = event.reason
        } else if (event.reason.message) {
          errorMessage = event.reason.message
        }
      }

      // Only show alert for non-development environments or significant errors
      // In development, errors are already visible in the console and error overlay
      if (process.env.NODE_ENV === 'production') {
        console.log('Error caught by global handler:', errorMessage)
        // Could send to error tracking service here
      }
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
    }

    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return null
}
