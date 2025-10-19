<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Fresh Market</h1>
        <p class="text-gray-600 mt-2">Browse our fresh vegetables and fruits collection</p>
      </div>
      <NuxtLink 
        to="/products/manage"
        class="btn btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
      >
        <Icon name="mdi:cog" class="w-5 h-5" />
        Manage Products
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-16">
      <Icon name="mdi:loading" class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600">Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <Icon name="mdi:alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-3" />
      <p class="text-red-700">Error loading products: {{ error.message }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <Icon name="mdi:package-variant" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 mb-4">No products found.</p>
      <button @click="seedData" class="btn btn-primary inline-flex items-center gap-2">
        <Icon name="mdi:database-plus" class="w-5 h-5" />
        Seed Sample Data
      </button>
    </div>

    <!-- Products Grid -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div 
          v-for="product in products"
          :key="product.id"
          class="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Product Image -->
          <div class="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
            <img 
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <Icon v-else name="mdi:image" class="w-16 h-16 text-primary-400" />
          </div>

          <!-- Product Info -->
          <div class="p-5">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {{ product.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
              {{ product.description }}
            </p>

            <!-- Meta Info -->
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                {{ product.category }}
              </span>
              <span class="text-xs text-gray-500">
                Stock: <strong :class="product.stock < 20 ? 'text-red-600' : 'text-green-600'">{{ product.stock }}</strong>
              </span>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <span class="text-2xl font-bold text-primary-600">
                ${{ product.price.toFixed(2) }}
              </span>
              <button class="btn btn-primary text-sm py-2 flex items-center gap-1">
                <Icon name="mdi:cart-plus" class="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="bg-gray-100 rounded-xl p-6 text-center">
        <p class="text-gray-700">
          Total Products: <strong class="text-primary-600 text-xl">{{ products.length }}</strong>
        </p>
      </div>
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

useHead({
  title: 'Fresh Products - Fresh Market',
  meta: [
    { name: 'description', content: 'Browse our fresh vegetables and fruits collection' }
  ]
})

const { data, pending, error, refresh } = await useFetch<{
  success: boolean
  data: Product[]
  count: number
}>('/api/products')

const products = computed(() => data.value?.data || [])

const seedData = async () => {
  try {
    await $fetch('/api/seed')
    await refresh()
  } catch (err) {
    console.error('Failed to seed data:', err)
  }
}
</script>
