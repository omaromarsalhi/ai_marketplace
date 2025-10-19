<template>
  <div class="container">
    <section class="hero">
      <h1>Welcome to Fresh Market</h1>
      <p class="tagline">Your source for fresh vegetables and fruits</p>
      <div class="cta-buttons">
        <NuxtLink to="/products/manage" class="btn-primary">Manage Products</NuxtLink>
        <NuxtLink to="/about" class="btn-secondary">About Us</NuxtLink>
      </div>
    </section>

    <!-- Category Filter -->
    <section class="filters">
      <div class="filter-buttons">
        <button 
          @click="selectedCategory = 'All'" 
          :class="['filter-btn', { active: selectedCategory === 'All' }]">
          All Products
        </button>
        <button 
          v-for="category in categories" 
          :key="category"
          @click="selectedCategory = category" 
          :class="['filter-btn', { active: selectedCategory === category }]">
          {{ category }}
        </button>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="products-section">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading products...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchProducts" class="btn-primary">Retry</button>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="empty">
        <p>No products found in this category.</p>
      </div>

      <div v-else class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="product-card">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name" />
            <span class="category-badge">{{ product.category }}</span>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.description }}</p>
            <div class="product-footer">
              <div class="price">${{ product.price.toFixed(2) }}</div>
              <div class="stock" :class="{ 'low-stock': product.stock < 50 }">
                {{ product.stock }} in stock
              </div>
            </div>
            <button class="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useProducts, type Product } from '~/composables/useProducts'

const { products, loading, error, fetchProducts } = useProducts()

// Fetch products on mount
onMounted(() => {
  fetchProducts()
})

// Category filter
const selectedCategory = ref('All')

// Get unique categories from products
const categories = computed(() => {
  const uniqueCategories = [...new Set(products.value.map(p => p.category))].sort()
  return uniqueCategories
})

// Filter products by category
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'All') {
    return products.value
  }
  return products.value.filter(p => p.category === selectedCategory.value)
})
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
  background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
  border-radius: 16px;
  color: white;
  margin-bottom: 3rem;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
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
  flex-wrap: wrap;
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
  display: inline-block;
}

.btn-primary {
  background: white;
  color: #16a34a;
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Category Filters */
.filters {
  margin: 2rem 0;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  border: 2px solid #22c55e;
  background: white;
  color: #16a34a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: #f0fdf4;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #22c55e;
  color: white;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* Products Section */
.products-section {
  margin-top: 3rem;
  min-height: 400px;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #22c55e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #dc2626;
}

.empty {
  color: #666;
  font-size: 1.2rem;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(34, 197, 94, 0.2);
}

.product-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.category-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(34, 197, 94, 0.95);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  color: #1f2937;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.description {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  min-height: 3rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.price {
  font-size: 1.75rem;
  font-weight: 700;
  color: #22c55e;
}

.stock {
  font-size: 0.9rem;
  color: #16a34a;
  font-weight: 600;
}

.stock.low-stock {
  color: #dc2626;
}

.add-to-cart-btn {
  width: 100%;
  padding: 0.875rem;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.add-to-cart-btn:hover {
  background: #16a34a;
  transform: translateY(-2px);
}

.add-to-cart-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }

  .tagline {
    font-size: 1.2rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
