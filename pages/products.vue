<template>
  <div class="products-page">
    <h1>AI Marketplace Products</h1>
    
    <!-- Loading State -->
    <div v-if="pending" class="loading">
      <p>Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>Error loading products: {{ error.message }}</p>
    </div>

    <!-- Products Grid -->
    <div v-else class="products-grid">
      <div v-if="products.length === 0" class="empty">
        <p>No products found.</p>
        <button @click="seedData" class="btn-primary">Seed Sample Data</button>
      </div>

      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="product.imageUrl" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="description">{{ product.description }}</p>
          <div class="product-meta">
            <span class="category">{{ product.category }}</span>
            <span class="stock">Stock: {{ product.stock }}</span>
          </div>
          <div class="product-footer">
            <span class="price">${{ product.price.toFixed(2) }}</span>
            <button class="btn-primary">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="products.length > 0" class="stats">
      <p>Total Products: {{ products.length }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  imageUrl: string
}

// Fetch products from API
const { data, pending, error, refresh } = await useFetch<{
  success: boolean
  data: Product[]
  count: number
}>('/api/products')

// Computed property for products array
const products = computed(() => data.value?.data || [])

// Seed sample data
const seedData = async () => {
  try {
    await $fetch('/api/seed')
    // Refresh the products list
    await refresh()
  } catch (err) {
    console.error('Failed to seed data:', err)
  }
}
</script>

<style scoped>
.products-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #00DC82;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 2rem 0;
}

.error {
  background: #fee;
  color: #c00;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.25rem;
}

.description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.category {
  background: #e0f2f1;
  color: #00796b;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
}

.stock {
  color: #666;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00DC82;
}

.btn-primary {
  background: #00DC82;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #00c174;
}

.stats {
  text-align: center;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #666;
}
</style>
