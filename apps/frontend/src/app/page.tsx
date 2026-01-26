// apps/frontend/src/app/page.tsx - UPDATED CLEAN VERSION
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Hero from '@/components/home/Hero';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight, Truck, ShieldCheck, RefreshCcw, Headset, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { resolveProductImage } from '@/lib/image';

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
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAddToCart = async (product: any) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/`);
      return;
    }

    try {
      setAddingToCartId(product.id);
      await addToCart(product.id, 1);
      // Optional: you could add a toast here
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCartId(null);
    }
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        console.log('🔄 Fetching featured products...');

        // First, get all products to see what's in DB
        const allResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products`);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products/featured?limit=8`);

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
        setError('Cannot connect to backend. Make sure it\'s running on port 4000.');

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

      {/* Featured Products Section - ANIMATED & POLISHED */}
      <section className="py-24 bg-gray-50/50 relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-gray-200 pb-8">
            <div>
              <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Curated Collection</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black leading-none">Featured Products</h2>
            </div>

            <div className="mb-2">
              <Link href="/products" className="group flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-black hover:text-blue-600 transition-colors">
                View All Products <ArrowRight size={14} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-gray-200 rounded-[2.5rem] mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 mb-4 font-medium">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-2">No Featured Products</h3>
              <p className="text-gray-500 mb-6">Mark products as "Featured" in the admin panel.</p>
              <Link
                href="/products"
                className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800"
              >
                Browse Store <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
                  }}
                  className="group cursor-pointer h-full"
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="bg-white border border-gray-100/50 rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    {/* Image Container - Compact Scale */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gray-50 mb-5 shadow-inner">
                      <Link href={`/products/${product.id}`} className="block w-full h-full">
                        <img
                          src={resolveProductImage(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>

                      {/* Featured Badge - Compact Black Pill */}
                      {product.featured && (
                        <div className="absolute top-4 left-4 z-10">
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="px-3 py-1.5 bg-black/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg"
                          >
                            Featured
                          </motion.span>
                        </div>
                      )}

                      {/* Add to Cart Overlay */}
                      <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          disabled={addingToCartId === product.id || Number(product.stock) === 0}
                          className="w-full bg-white text-black py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 shadow-xl flex items-center justify-center gap-2"
                        >
                          {addingToCartId === product.id ? (
                            'Adding...'
                          ) : Number(product.stock) === 0 ? (
                            'Out of Stock'
                          ) : (
                            <>
                              Add <ShoppingCart size={12} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Product Info - Stacked & Clean */}
                    <div className="px-1 pb-1 flex flex-col flex-grow">
                      {/* Row 1: Title */}
                      <div className="mb-1">
                        <h3 className="font-bold text-black text-lg leading-tight group-hover:text-blue-600 transition-colors truncate" title={product.name}>
                          <Link href={`/products/${product.id}`}>
                            {product.name}
                          </Link>
                        </h3>
                      </div>

                      {/* Row 2: Price */}
                      <div className="mb-3">
                        <span className="font-black text-black text-xl tracking-tight block">
                          ${product.price}
                        </span>
                      </div>

                      {/* Row 3: Description */}
                      <p className="text-gray-500 text-xs font-medium line-clamp-2 mb-4 flex-grow leading-relaxed">
                        {product.description}
                      </p>

                      {/* Row 4: Category */}
                      {product.category && (
                        <div className="pt-3 border-t border-gray-50 mt-auto flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            {product.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
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