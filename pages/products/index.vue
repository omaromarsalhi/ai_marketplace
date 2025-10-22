<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Fresh Market</h1>
        <p class="text-gray-600 mt-2">Browse our fresh vegetables and fruits collection</p>
      </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <NuxtLink 
            to="/products/manage"
            class="btn btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Icon name="mdi:cog" class="w-5 h-5" />
            Manage Products
          </NuxtLink>
        </div>
    </div>

      <!-- AI Search -->
      <div class="mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <input
            v-model="aiPrompt"
            type="text"
            placeholder="Ex: je veux des fruits exotiques pas chers"
            class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
            :disabled="aiLoading"
          />

          <div class="flex items-center gap-2 mt-3 sm:mt-0">
            <button
              @click="searchWithAI"
              :disabled="aiLoading || !aiPrompt.trim()"
              class="btn btn-primary inline-flex items-center gap-2"
            >
              <Icon name="mdi:magnify" class="w-4 h-4" />
              <span v-if="!aiLoading">🔍 Rechercher avec IA</span>
              <span v-else class="flex items-center gap-2">
                <Icon name="mdi:loading" class="w-4 h-4 animate-spin" />
                Recherche en cours...
              </span>
            </button>

            <button
              @click="resetAI"
              :disabled="aiLoading"
              class="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg"
            >
              🔄 Réinitialiser
            </button>
          </div>
        </div>
        <p v-if="aiError" class="text-sm text-red-600 mt-2">{{ aiError }}</p>
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

    <!-- Empty State (no products at all) -->
    <div v-else-if="products.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <Icon name="mdi:package-variant" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 mb-4">No products found.</p>
      <button @click="seedData" class="btn btn-primary inline-flex items-center gap-2">
        <Icon name="mdi:database-plus" class="w-5 h-5" />
        Seed Sample Data
      </button>
    </div>

    <!-- AI-filtered No Results -->
    <div v-else-if="filteredProducts !== null && filteredProducts.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <Icon name="mdi:alert-circle-outline" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 mb-4">Aucun produit ne correspond à votre recherche IA.</p>
      <button @click="resetAI" class="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg">
        🔄 Réinitialiser
      </button>
    </div>

    <!-- Products Grid -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div 
          v-for="product in (filteredProducts !== null ? filteredProducts : products)"
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

// AI search state
const aiPrompt = ref('')
const aiLoading = ref(false)
const aiError = ref('')
const filteredProducts = ref<Product[] | null>(null)

// Configurable AI endpoint
const aiEndpoint = ref('http://127.0.0.1:8000/api/ai-filter')

const seedData = async () => {
  try {
    await $fetch('/api/seed')
    await refresh()
  } catch (err) {
    console.error('Failed to seed data:', err)
  }
}

// Search with AI backend
async function searchWithAI() {
  const prompt = aiPrompt.value?.trim()
  if (!prompt) return

  aiLoading.value = true
  aiError.value = ''
  
  try {
    const response = await $fetch<{ items: Product[] }>(aiEndpoint.value, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { 
        prompt: prompt,
        limit: 10 
      }
    })

    // Extract products from response
    if (response && Array.isArray(response.items)) {
      filteredProducts.value = response.items
    } else if (Array.isArray(response)) {
      filteredProducts.value = response
    } else {
      aiError.value = 'Format de réponse inattendu du serveur IA.'
      filteredProducts.value = []
    }
  } catch (err: any) {
    console.error('AI search failed:', err)
    aiError.value = err?.message || 'Erreur lors de la recherche IA. Vérifiez que le serveur est démarré.'
    filteredProducts.value = []
  } finally {
    aiLoading.value = false
  }
}

function resetAI() {
  aiPrompt.value = ''
  aiError.value = ''
  filteredProducts.value = null
}
</script>
