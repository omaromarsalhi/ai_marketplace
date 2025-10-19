<template>
  <div class="container">
    <h1>About Fresh Market</h1>
    
    <section class="content">
      <h2>Our Fresh Market System</h2>
      <p>
        Welcome to Fresh Market - your trusted source for fresh vegetables and fruits! We use a simple and efficient 
        JSON-based system to manage our products, ensuring quick access to our fresh produce inventory.
      </p>

      <h2>How Our System Works</h2>
      <div class="info-box">
        <h3>🥬 Fresh Inventory</h3>
        <p>Our produce catalog is efficiently managed and updated daily to ensure freshness.</p>
        
        <h3>🔧 Management Features</h3>
        <p>Our system provides comprehensive product management with:</p>
        <ul>
          <li><strong>Browse</strong> - View all fresh vegetables and fruits</li>
          <li><strong>Add</strong> - Add new produce to our catalog</li>
          <li><strong>Update</strong> - Modify product details and pricing</li>
          <li><strong>Remove</strong> - Remove out-of-season items</li>
          <li><strong>Search</strong> - Find specific products quickly</li>
          <li><strong>Filter</strong> - Browse by category (Fruits, Vegetables, Organic, etc.)</li>
        </ul>

        <h3>🌱 Product Categories</h3>
        <p>We organize our fresh produce into categories:</p>
        <ul>
          <li><code>Fruits</code> - Fresh seasonal fruits</li>
          <li><code>Vegetables</code> - Farm-fresh vegetables</li>
          <li><code>Organic</code> - Certified organic produce</li>
          <li><code>Seasonal</code> - Limited-time seasonal items</li>
          <li><code>Exotic</code> - Unique and specialty produce</li>
        </ul>
      </div>

      <h2>Why Choose Fresh Market</h2>
      <div class="pros-cons">
        <div class="pros">
          <h3>✅ Benefits</h3>
          <ul>
            <li>Daily fresh produce delivery</li>
            <li>Easy online ordering system</li>
            <li>Quality guaranteed products</li>
            <li>Farm-to-table freshness</li>
            <li>Competitive pricing</li>
            <li>Wide variety of options</li>
          </ul>
        </div>
        <div class="cons">
          <h3>🌱 Our Commitment</h3>
          <ul>
            <li>Supporting local farmers</li>
            <li>Sustainable farming practices</li>
            <li>Organic certification</li>
            <li>Seasonal variety rotation</li>
            <li>Minimal environmental impact</li>
          </ul>
        </div>
      </div>

      <h2>Perfect for</h2>
      <ul class="use-cases">
        <li>� Home cooking enthusiasts</li>
        <li>🍽️ Restaurant and café owners</li>
        <li>� Health-conscious individuals</li>
        <li>👨‍👩‍👧‍� Families seeking fresh nutrition</li>
        <li>� Organic lifestyle advocates</li>
        <li>🍳 Professional chefs and caterers</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #22c55e;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
}

.content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #22c55e;
}

h3 {
  color: #16a34a;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

p {
  line-height: 1.8;
  color: #666;
  margin-bottom: 1rem;
}

code {
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #16a34a;
}

.info-box {
  background: #f0fdf4;
  padding: 2rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid #22c55e;
}

ul {
  margin-left: 2rem;
  line-height: 2;
  color: #666;
}

li {
  margin-bottom: 0.5rem;
}

.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
}

.pros,
.cons {
  padding: 1.5rem;
  border-radius: 8px;
}

.pros {
  background: #dcfce7;
  border-left: 4px solid #22c55e;
}

.cons {
  background: #f0fdf4;
  border-left: 4px solid #84cc16;
}

.use-cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  list-style: none;
  margin: 2rem 0;
  margin-left: 0;
}

.use-cases li {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  color: #166534;
  border: 1px solid #22c55e;
}
</style>
