import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import Header from '@/components/layout/Header'; // Add Header back

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <AuthProvider>
          <Header /> {/* Add Header back */}
          <main className="min-h-screen pt-16"> {/* Add padding top for fixed header */}
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}