// apps/frontend/src/lib/debug-image.ts - NEW FILE
export const debugImageUrl = (imageUrl: string | null) => {
  console.group('Image URL Debug');
  console.log('Original URL:', imageUrl);
  
  if (!imageUrl) {
    console.log('Status: No image URL provided');
    console.groupEnd();
    return null;
  }
  
  // Check URL format
  if (imageUrl.startsWith('http')) {
    console.log('Format: Full HTTP URL');
    console.log('Domain:', new URL(imageUrl).hostname);
  } else if (imageUrl.startsWith('/')) {
    console.log('Format: Relative path');
  } else {
    console.log('Format: Unknown format');
  }
  
  // Check if it's Cloudinary
  if (imageUrl.includes('cloudinary')) {
    console.log('Provider: Cloudinary');
    console.log('Full URL:', imageUrl);
  }
  
  console.groupEnd();
  return imageUrl;
};