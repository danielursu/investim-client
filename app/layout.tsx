import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Investim',
  description: 'Your personal investment assistant',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
