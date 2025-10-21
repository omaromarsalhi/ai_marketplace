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
          v-for="product in paginatedProducts"
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

      <!-- Pagination -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Page Info -->
          <div class="text-sm text-gray-600">
            Showing 
            <strong class="text-gray-900">{{ startIndex + 1 }}</strong> to 
            <strong class="text-gray-900">{{ Math.min(endIndex, products.length) }}</strong> of 
            <strong class="text-gray-900">{{ products.length }}</strong> products
          </div>

          <!-- Page Controls -->
          <div class="flex items-center gap-2">
            <button
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              :class="currentPage === 1 ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700'"
            >
              First
            </button>
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              :class="currentPage === 1 ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700'"
            >
              <Icon name="mdi:chevron-left" class="w-5 h-5" />
            </button>

            <span class="px-4 py-2 text-sm font-medium text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>

            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              :class="currentPage === totalPages ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700'"
            >
              <Icon name="mdi:chevron-right" class="w-5 h-5" />
            </button>
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              :class="currentPage === totalPages ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700'"
            >
              Last
            </button>
          </div>

          <!-- Items per page -->
          <div class="flex items-center gap-2">
            <label for="itemsPerPage" class="text-sm text-gray-600">Per page:</label>
            <select
              id="itemsPerPage"
              v-model="itemsPerPage"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option :value="8">8</option>
              <option :value="12">12</option>
              <option :value="16">16</option>
              <option :value="24">24</option>
              <option :value="32">32</option>
            </select>
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

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(12)

const totalPages = computed(() => 
  Math.ceil(products.value.length / itemsPerPage.value)
)

const startIndex = computed(() => 
  (currentPage.value - 1) * itemsPerPage.value
)

const endIndex = computed(() => 
  startIndex.value + itemsPerPage.value
)

const paginatedProducts = computed(() => 
  products.value.slice(startIndex.value, endIndex.value)
)

// Reset to page 1 when items per page changes
watch(itemsPerPage, () => {
  currentPage.value = 1
})

const seedData = async () => {
  try {
    await $fetch('/api/seed')
    await refresh()
  } catch (err) {
    console.error('Failed to seed data:', err)
  }
}
</script>
