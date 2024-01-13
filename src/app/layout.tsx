import type { Metadata } from 'next'
import { Inter, Lora, Montserrat, Roboto_Condensed } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/Nav'
import Footer from '@/components/Footer'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Calmversation',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
