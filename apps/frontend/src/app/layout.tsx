import type { Metadata } from 'next';
import { Inter, Jost, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { WishlistProvider } from '@/lib/WishlistContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jost = Jost({ subsets: ['latin'], variable: '--font-jost' });
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: 'Store App - Your Modern E-commerce Platform',
  description: 'A modern e-commerce platform with seamless shopping experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} ${plusJakartaSans.variable} ${jost.variable} ${inter.variable}`}>
        <AuthProvider>
          <WishlistProvider>
            <Header />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <Footer />
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}