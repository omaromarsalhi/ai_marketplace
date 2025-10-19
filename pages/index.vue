<template>
  <div class="container">
    <section class="hero">
      <h1>Welcome to AI Marketplace</h1>
      <p class="tagline">Your one-stop shop for AI tools and services</p>
      <div class="cta-buttons">
        <NuxtLink to="/products" class="btn-primary">Browse Products</NuxtLink>
        <button @click="checkApi" class="btn-secondary">Test API</button>
      </div>
    </section>

    <section class="features">
      <h2>Features</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="icon">📦</div>
          <h3>JSON Storage</h3>
          <p>Simple file-based storage without database complexity</p>
        </div>
        <div class="feature-card">
          <div class="icon">⚡</div>
          <h3>Fast & Light</h3>
          <p>No database overhead, perfect for prototyping</p>
        </div>
        <div class="feature-card">
          <div class="icon">🔄</div>
          <h3>Full CRUD</h3>
          <p>Complete Create, Read, Update, Delete operations</p>
        </div>
        <div class="feature-card">
          <div class="icon">🛠️</div>
          <h3>Easy to Use</h3>
          <p>Utility functions for common data operations</p>
        </div>
      </div>
    </section>
    
    <section v-if="apiResponse" class="api-section">
      <h2>API Response</h2>
      <div class="api-response">
        <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const apiResponse = ref(null)

const checkApi = async () => {
  try {
    const data = await $fetch('/api/hello')
    apiResponse.value = data
  } catch (error) {
    apiResponse.value = { error: 'Failed to fetch API' }
  }
}
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  margin-bottom: 4rem;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.tagline {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.1rem;
  border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary {
  background: #00DC82;
  color: white;
}

.btn-secondary {
  background: white;
  color: #667eea;
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.features {
  margin: 4rem 0;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #00DC82;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.api-section {
  margin-top: 4rem;
}

.api-section h2 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.api-response {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

pre {
  background-color: #1e1e1e;
  color: #00DC82;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
