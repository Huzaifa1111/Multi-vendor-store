// apps/backend/test-featured-simple.js
async function testFeaturedProducts() {
  console.log('🧪 Testing featured products endpoint...\n');

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    const healthResponse = await fetch('http://localhost:3001/products/test');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ Server is running:', healthData);
    } else {
      console.log('   ❌ Server is not responding');
      return;
    }

    // Test 2: Get all products
    console.log('\n2️⃣ Fetching all products...');
    const allResponse = await fetch('http://localhost:3001/products');
    if (allResponse.ok) {
      const allProducts = await allResponse.json();
      console.log(`   📊 Total products in database: ${allProducts.length}`);
      
      // Check featured status
      const featuredProducts = allProducts.filter(p => p.featured === true);
      console.log(`   ⭐ Products marked as featured: ${featuredProducts.length}`);
      
      if (featuredProducts.length > 0) {
        console.log('   Featured product details:');
        featuredProducts.forEach(p => {
          console.log(`   • ID: ${p.id}, Name: "${p.name}", Price: $${p.price}, Featured: ${p.featured}`);
        });
      } else {
        console.log('   ℹ️ No products are marked as featured in the database');
      }
    }

    // Test 3: Test the featured endpoint
    console.log('\n3️⃣ Testing /products/featured endpoint...');
    const featuredResponse = await fetch('http://localhost:3001/products/featured');
    if (featuredResponse.ok) {
      const featuredData = await featuredResponse.json();
      console.log(`   ✅ Featured endpoint returned: ${featuredData.length} products`);
      console.log('   Featured endpoint data:', JSON.stringify(featuredData, null, 2));
    } else {
      console.log(`   ❌ Featured endpoint failed: ${featuredResponse.status} ${featuredResponse.statusText}`);
    }

    // Test 4: Test with query parameter
    console.log('\n4️⃣ Testing /products?featured=true endpoint...');
    const queryResponse = await fetch('http://localhost:3001/products?featured=true');
    if (queryResponse.ok) {
      const queryData = await queryResponse.json();
      console.log(`   ✅ Query parameter returned: ${queryData.length} products`);
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.log('\n🔍 Troubleshooting steps:');
    console.log('1. Is the backend server running? Run: npm run start:dev');
    console.log('2. Check if port 3001 is available');
    console.log('3. Check backend console for errors');
    console.log('4. Try accessing http://localhost:3001/products/test in your browser');
  }
}

// Run the test
testFeaturedProducts();