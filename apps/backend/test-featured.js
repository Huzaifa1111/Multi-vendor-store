// apps/backend/test-featured.js
const axios = require('axios');

async function testFeaturedProducts() {
  try {
    console.log('Testing featured products endpoint...');
    
    // Test 1: Check if server is running
    const health = await axios.get('http://localhost:3001/products/test');
    console.log('✅ Server health:', health.data);
    
    // Test 2: Get all products
    const allProducts = await axios.get('http://localhost:3001/products');
    console.log('📦 Total products:', allProducts.data.length);
    
    // Test 3: Get featured products
    const featured = await axios.get('http://localhost:3001/products/featured');
    console.log('⭐ Featured products:', featured.data.length);
    console.log('Featured data:', JSON.stringify(featured.data, null, 2));
    
    // Test 4: Check if any products have featured=true
    const featuredCheck = allProducts.data.filter(p => p.featured === true);
    console.log('🔍 Products with featured=true:', featuredCheck.length);
    console.log('Featured product IDs:', featuredCheck.map(p => p.id));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testFeaturedProducts();