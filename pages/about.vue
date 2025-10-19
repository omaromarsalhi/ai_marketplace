<template>
  <div class="container">
    <h1>About AI Marketplace</h1>
    
    <section class="content">
      <h2>JSON Storage System</h2>
      <p>
        This project uses a simple JSON file-based storage system instead of a traditional database. 
        Perfect for prototyping, small applications, and scenarios where you don't need database complexity.
      </p>

      <h2>How It Works</h2>
      <div class="info-box">
        <h3>📁 Storage Location</h3>
        <p>All data is stored in <code>server/data/</code> directory as JSON files.</p>
        
        <h3>🔧 Utility Functions</h3>
        <p>Located in <code>server/utils/storage.ts</code> with full CRUD operations:</p>
        <ul>
          <li><strong>readData</strong> - Read all items from a JSON file</li>
          <li><strong>writeData</strong> - Write items to a JSON file</li>
          <li><strong>createItem</strong> - Create a new item with auto-generated ID</li>
          <li><strong>updateItem</strong> - Update an existing item</li>
          <li><strong>deleteItem</strong> - Delete an item by ID</li>
          <li><strong>queryItems</strong> - Filter items with custom logic</li>
        </ul>

        <h3>🚀 API Endpoints</h3>
        <p>RESTful APIs are available for:</p>
        <ul>
          <li><code>GET/POST /api/products</code> - List and create products</li>
          <li><code>GET/PUT/DELETE /api/products/:id</code> - Single product operations</li>
          <li><code>GET/POST /api/users</code> - List and create users</li>
          <li><code>GET /api/seed</code> - Populate with sample data</li>
        </ul>
      </div>

      <h2>Advantages</h2>
      <div class="pros-cons">
        <div class="pros">
          <h3>✅ Pros</h3>
          <ul>
            <li>No database setup required</li>
            <li>Easy to understand and debug</li>
            <li>Version control friendly</li>
            <li>Perfect for prototyping</li>
            <li>No connection overhead</li>
            <li>Human-readable data format</li>
          </ul>
        </div>
        <div class="cons">
          <h3>⚠️ Considerations</h3>
          <ul>
            <li>Not suitable for large datasets</li>
            <li>No concurrent write protection</li>
            <li>Limited query capabilities</li>
            <li>No built-in relationships</li>
            <li>Entire file loaded into memory</li>
          </ul>
        </div>
      </div>

      <h2>When to Use This Approach</h2>
      <ul class="use-cases">
        <li>🎨 Rapid prototyping</li>
        <li>📚 Small-scale applications</li>
        <li>🧪 Testing and development</li>
        <li>📖 Static or semi-static content</li>
        <li>🎓 Learning projects</li>
        <li>🔧 Configuration management</li>
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
  color: #00DC82;
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
  border-bottom: 2px solid #00DC82;
}

h3 {
  color: #667eea;
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
  color: #00DC82;
}

.info-box {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin: 1rem 0;
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
  background: #e8f5e9;
}

.cons {
  background: #fff3e0;
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
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  color: #333;
}
</style>
