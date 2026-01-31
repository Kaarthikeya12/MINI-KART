import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Mini Kart - Your Shopping Destination',
  description: 'Shop the best products at amazing prices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
