/**
 * Resolves a product image source to a format usable by Next.js <Image /> or standard <img /> tags.
 * Handles nulls, absolute URLs, and missing leading slashes for local assets.
 */
export const resolveProductImage = (src: string | null | undefined): string => {
    if (!src) return '/images/placeholder-product.png';
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    if (src.startsWith('/')) return src;

    // If it's a raw filename without a leading slash, assume it's a local asset or needs normalization
    // In Next.js, local public assets MUST start with /
    return `/${src}`;
};
