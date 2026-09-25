import type { Metadata, Viewport } from 'next'
import { Caveat, Cormorant_Garamond, Manrope } from 'next/font/google'
import './globals.css'

const display = Cormorant_Garamond({ subsets:['latin'], weight:['500','600','700'], variable:'--font-display' })
const body = Manrope({ subsets:['latin'], variable:'--font-body' })
const hand = Caveat({ subsets:['latin'], variable:'--font-hand' })

const title = 'For Somya — October 6, 2026'
const description = 'Something made only for you.'

export const metadata: Metadata = {
  metadataBase: new URL('https://somya-birthday-2026.vivid-mango-4570.chatgpt.site'),
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description,
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'An elegant mandala card reading Something made only for you' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og.jpg'] },
}

export const viewport: Viewport = { themeColor: '#591c2d', colorScheme: 'light' }

export default function RootLayout({ children }:{ children:React.ReactNode }) {
  return <html lang="en"><body className={`${display.variable} ${body.variable} ${hand.variable} paper-texture`}>{children}</body></html>
}
