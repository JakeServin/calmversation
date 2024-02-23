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
			<head>
				<meta content="Let's talk about it" property="og:title" key="og:title" />
				<meta
					content={'A mental health platform that helps you talk through your feelings and emotions.'}
					property="og:description"
					key="og:description"
				/>
				<meta property="og:image" content={"/images/logo_2.png"} />
			</head>
			<body className={montserrat.className}>
				<Nav />
				<main>{children}</main>
				<Toaster />
				<Footer />
			</body>
		</html>
  );
}
