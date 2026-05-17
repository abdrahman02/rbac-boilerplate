import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RBAC Dashboard',
  description: 'Role-based access control dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
