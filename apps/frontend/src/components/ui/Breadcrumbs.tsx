// apps/frontend/src/components/ui/Breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useMemo } from 'react';

interface BreadcrumbItem {
    label: string;
    href: string;
    isLast: boolean;
}

interface BreadcrumbsProps {
    customLabels?: Record<string, string>;
}

export default function Breadcrumbs({ customLabels = {} }: BreadcrumbsProps) {
    const pathname = usePathname();

    const breadcrumbs = useMemo(() => {
        const segments = pathname.split('/').filter((v) => v.length > 0);

        const items: BreadcrumbItem[] = segments.map((segment, index) => {
            const href = '/' + segments.slice(0, index + 1).join('/');

            // Use custom label if provided, otherwise capitalize segment
            let label = customLabels[segment] || segment;

            // Basic formatting if not in customLabels
            if (!customLabels[segment]) {
                label = label.charAt(0).toUpperCase() + label.slice(1).replace(/-/g, ' ');
            }

            return {
                label,
                href,
                isLast: index === segments.length - 1,
            };
        });

        return items;
    }, [pathname, customLabels]);

    if (pathname === '/') return null;

    return (
        <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 md:space-x-4">
                <li className="flex items-center">
                    <Link
                        href="/"
                        className="text-gray-400 hover:text-emerald-600 transition-colors flex items-center gap-2 group"
                    >
                        <Home size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Home</span>
                    </Link>
                </li>

                {breadcrumbs.map((item, index) => (
                    <li key={item.href} className="flex items-center">
                        <ChevronRight size={12} className="text-gray-300 mx-1 md:mx-2" />
                        {item.isLast ? (
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 truncate max-w-[150px] md:max-w-none">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-gray-400 hover:text-emerald-600 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
