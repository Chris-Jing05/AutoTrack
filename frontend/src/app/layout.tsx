import type { Metadata } from 'next'
import './globals.css'
import GlobalErrorHandler from '@/components/GlobalErrorHandler'

export const metadata: Metadata = {
  title: 'AutoTrack - AI-Powered Expense Tracker',
  description: 'Automatically extract and categorize expenses from receipts using AI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GlobalErrorHandler />
        {children}
      </body>
    </html>
  )
}
