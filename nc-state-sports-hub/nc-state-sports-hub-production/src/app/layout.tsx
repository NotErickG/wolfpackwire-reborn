import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NC State Sports Hub',
  description: 'The ultimate destination for NC State sports fans - live scores, news, and more!',
  keywords: ['NC State', 'Wolfpack', 'sports', 'basketball', 'football', 'news'],
  authors: [{ name: 'NC State Sports Hub Team' }],
  openGraph: {
    title: 'NC State Sports Hub',
    description: 'The ultimate destination for NC State sports fans',
    url: 'https://ncstatesportshub.com',
    siteName: 'NC State Sports Hub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NC State Sports Hub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NC State Sports Hub',
    description: 'The ultimate destination for NC State sports fans',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  themeColor: '#CC0000', // NC State red
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}