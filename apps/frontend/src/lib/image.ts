// apps/frontend/src/lib/image.ts - UPDATED
export const resolveProductImage = (imageUrl: string | string[] | null): string => {
  if (Array.isArray(imageUrl)) {
    imageUrl = imageUrl.length > 0 ? imageUrl[0] : null;
  }
  if (!imageUrl || imageUrl.trim() === '') {
    // Use a reliable placeholder from a public service
    return 'https://placehold.co/600x600/3b82f6/ffffff?text=No+Image';
  }

  // Check if it's already a full URL
  if (imageUrl.startsWith('http') || imageUrl.startsWith('https')) {
    // If it's a Cloudinary URL, make sure it's correct
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl;
    }
    return imageUrl;
  }

  // If it's a Cloudinary public_id without domain, construct full URL
  if (!imageUrl.includes('http') && imageUrl.includes('upload')) {
    return `https://res.cloudinary.com/den4kqcoh/${imageUrl}`;
  }

  // For relative paths from your API
  if (imageUrl.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${imageUrl}`;
  }

  // Default placeholder
  return 'https://placehold.co/600x600/3b82f6/ffffff?text=No+Image';
};

// Simple version without Cloudinary construction (if Cloudinary isn't working)
export const simpleImageResolver = (imageUrl: string | null): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return 'https://placehold.co/600x600/3b82f6/ffffff?text=No+Image';
  }

  // If it's already a full URL, use it
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Otherwise, use placeholder
  return 'https://placehold.co/600x600/3b82f6/ffffff?text=No+Image';
};