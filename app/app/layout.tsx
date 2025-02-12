import type { Metadata } from 'next';
import { Pixelify_Sans } from 'next/font/google';
import './globals.css';

const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'dhub',
  description:
    'A fully open source protocol for developers to create, connect and share machine learning modules',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={`${pixelifySans.className} antialiased`}>{children}</body>
    </html>
  );
}
