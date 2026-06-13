import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'HomeNest LK — Sri Lanka\'s Premium Home Store',
    template: '%s | HomeNest LK',
  },
  description: 'Elevate your living space with premium home essentials from Sri Lanka\'s trusted online store. Kitchen, Bedroom, Bathroom, Living Room & more.',
  keywords: ['HomeNest', 'Sri Lanka', 'home store', 'home decor', 'kitchen', 'bedroom', 'furniture', 'online shopping'],
  openGraph: {
    title: 'HomeNest LK — Sri Lanka\'s Premium Home Store',
    description: 'Elevate your living space with premium home essentials.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
