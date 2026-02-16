'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/auth/');

    return (
        <>
            {!isAuthPage && <Header />}
            <main className={`min-h-screen ${isAuthPage ? 'pt-0' : 'pt-20'}`}>
                {children}
            </main>
            {!isAuthPage && <Footer />}
        </>
    );
}
