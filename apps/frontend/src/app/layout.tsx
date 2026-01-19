import type { Metadata } from 'next';
import { Inter, Jost } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { WishlistProvider } from '@/lib/WishlistContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jost = Jost({ subsets: ['latin'], variable: '--font-jost' });

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
      <body className={`${jost.className} ${jost.variable} ${inter.variable}`}>
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