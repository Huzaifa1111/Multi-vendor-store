// apps/frontend/next.config.js - TEMPORARY FIX
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Disable image optimization completely
  },
  transpilePackages: ['react-quill-new'],
};

module.exports = nextConfig;