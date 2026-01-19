// apps/frontend/src/app/page.tsx - UPDATED CLEAN VERSION
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Hero from '@/components/home/Hero';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight, Truck, ShieldCheck, RefreshCcw, Headset, Star } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "anticipate" } as any
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
  try {
    console.log('🔄 Fetching featured products...');
    
    // First, get all products to see what's in DB
    const allResponse = await fetch('http://localhost:3001/products');
    const allProducts = await allResponse.json();
    
    console.log('📊 All products from API:', allProducts.length);
    console.log('🔍 Featured status of all products:');
    allProducts.forEach((p: any) => {
      console.log(`  ID ${p.id}: "${p.name}" - Featured: ${p.featured}`);
    });
    
    const featuredCount = allProducts.filter((p: any) => p.featured === true).length;
    console.log(`⭐ Products with featured=true: ${featuredCount}`);
    
    // Now try the featured endpoint
    console.log('🔗 Calling /products/featured endpoint...');
    const response = await fetch('http://localhost:3001/products/featured?limit=8');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Featured endpoint returned:', data.length, 'products');
      console.log('Featured data:', data);
      
      setFeaturedProducts(data);
      
      if (data.length === 0 && featuredCount > 0) {
        console.error('⚠️ BUG DETECTED: Products have featured=true but endpoint returns empty!');
        setError('BUG: Products marked as featured but not showing. Check backend logs.');
      }
    } else {
      console.error('❌ Featured endpoint failed:', response.status);
      setError('Featured endpoint error: ' + response.status);
    }
    
  } catch (err: any) {
    console.error('❌ Error fetching products:', err);
    setError('Cannot connect to backend. Make sure it\'s running on port 3001.');
    
    // Show fallback data for testing
    setFeaturedProducts([
      {
        id: 999,
        name: "Test Featured Product",
        description: "This is a test featured product",
        price: 99.99,
        stock: 10,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000",
        featured: true,
        category: "Electronics",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  } finally {
    setIsLoading(false);
  }
};

    fetchFeaturedProducts();
  }, []);

  // Add debug logging
  useEffect(() => {
    console.log('📦 Current featured products:', featuredProducts);
    console.log('📊 Count:', featuredProducts.length);
  }, [featuredProducts]);

  const categories = [
    { name: 'Electronic Devices', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop', link: '/products?category=electronic-devices' },
    { name: 'Electronic Accessories', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop', link: '/products?category=electronic-accessories' },
    { name: 'TV & Home Appliances', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000&auto=format&fit=crop', link: '/products?category=tv-appliances' },
    { name: 'Health & Beauty', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&auto=format&fit=crop', link: '/products?category=health-beauty' },
    { name: 'Babies & Toys', image: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?q=80&w=1000&auto=format&fit=crop', link: '/products?category=babies-toys' },
  ];

  return (
    <div className="min-h-screen bg-white font-jost overflow-x-hidden">
      {/* Hero Slider */}
      <Hero />

      {/* Feature Icons Section */}
      <motion.section
        {...fadeInUp}
        className="py-20 border-b border-gray-100"
      >
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {[
            { icon: <Truck size={36} />, title: 'Free Shipping', desc: 'On all orders over $150' },
            { icon: <ShieldCheck size={36} />, title: 'Secure Payment', desc: '100% secure payment processing' },
            { icon: <RefreshCcw size={36} />, title: 'Easy Returns', desc: '30-day money back guarantee' },
            { icon: <Headset size={36} />, title: '24/7 Support', desc: 'Dedicated support team' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 group">
              <div className="text-black group-hover:scale-110 group-hover:text-blue-600 transition-all duration-500 transform">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-black uppercase tracking-[0.2em] text-[14px]">{item.title}</h4>
                <p className="text-gray-400 text-sm font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Shop by Category */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-2 block">Premium Marketplace</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black">Shop by Category</h2>
            </div>
            <div className="flex items-center">
              <Link href="/products" className="group flex items-center text-[11px] font-black uppercase tracking-[0.3em] text-black border-b-2 border-black/10 pb-1 hover:border-black transition-all">
                View All Collections <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          <div
            id="category-slider"
            className="flex space-x-6 overflow-x-auto pb-10 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex-none w-[220px] md:w-[260px] lg:w-[300px] snap-start"
              >
                <Link href={category.link} className="group block relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity"></div>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-[1.1]">
                      {category.name}
                    </h3>
                    <div className="mt-3 overflow-hidden h-0 group-hover:h-5 transition-all duration-500">
                      <span className="flex items-center text-[9px] font-black uppercase tracking-[0.3em] text-white/80">
                        View Products <ArrowRight size={12} className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-32 bg-[#fafafa]">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            {...fadeInUp}
            className="text-center mb-20"
          >
            <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[11px] mb-4 block">Bestselling Electronics</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-black">Featured Products</h2>
            
            {/* Debug info - visible only in development */}
            <div className="mt-4 text-sm">
              <div className="inline-block bg-gray-100 px-3 py-1 rounded-lg">
                Status: {isLoading ? '🔄 Loading...' : error ? `❌ ${error}` : `✅ ${featuredProducts.length} featured products`}
              </div>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-[2.5rem] mb-6 shadow-sm"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-2/3 mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-1/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Featured Products Yet</h3>
              <p className="text-gray-600 mb-6">Mark products as "Featured" in the admin panel to see them here</p>
              <div className="space-y-4">
                <Link
                  href="/admin/products/create"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-4"
                >
                  <Star className="mr-2" size={20} />
                  Create Featured Product
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  Browse All Products <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative group">
                    {/* Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="flex items-center space-x-1 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          <Star className="w-3 h-3" />
                          <span>FEATURED</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-300">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-gray-900">${product.price}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        <button className="w-full mt-4 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {featuredProducts.length > 0 && (
            <motion.div
              {...fadeInUp}
              className="mt-24 text-center"
            >
              <Link
                href="/products"
                className="group relative inline-block px-16 py-7 bg-white border-2 border-black text-black font-black uppercase tracking-[0.3em] text-[13px] overflow-hidden transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl rounded-full"
              >
                <span className="relative z-10 flex items-center">
                  Explore The Full Collection <ArrowRight className="ml-4 group-hover:translate-x-3 transition-transform duration-500" size={20} />
                </span>
                <div className="absolute inset-0 bg-blue-50 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <motion.section
        {...fadeInUp}
        className="py-32 bg-white relative overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[11px] mb-6 block">Need Assistance?</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-black">Get in Touch</h2>
            <p className="text-gray-500 text-xl mb-14 font-medium leading-relaxed">Have questions about our products or need technical support? Our team is here to help you find the perfect tech solution.</p>

            <div className="flex justify-center group">
              <Link
                href="/contact"
                className="relative inline-flex items-center px-16 py-7 bg-black text-white rounded-full font-black uppercase tracking-[0.3em] text-[13px] overflow-hidden transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl group/btn"
              >
                <span className="relative z-10 flex items-center">
                  Contact Us <ArrowRight className="ml-4 group-hover/btn:translate-x-3 transition-transform duration-500" size={20} />
                </span>
                <div className="absolute inset-0 bg-blue-600 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-in-out"></div>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-50/30 rounded-full blur-[120px]"></div>
      </motion.section>
    </div>
  );
}