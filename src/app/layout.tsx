import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/Nav'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'

const montserrat = Montserrat({ subsets: ['latin'] })

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
			<body className={montserrat.className}>
				<Nav />
				<main>{children}</main>
				<Toaster />
				<Footer />
			</body>
		</html>
  );
}
