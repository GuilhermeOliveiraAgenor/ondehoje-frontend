import './globals.css'

import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import { Providers } from './providers'

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Onde Hoje',
  description: 'Sistema de eventos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
