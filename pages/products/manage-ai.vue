<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header with AI Status -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Product Management</h1>
        <p class="text-gray-600 mt-2">AI automatically validates and approves/rejects products</p>
      </div>
      <button 
        @click="showForm = true"
        class="btn btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
      >
        <Icon name="mdi:plus" class="w-5 h-5" />
        Add New Product
      </button>
    </div>

    <!-- AI Health Status -->
    <div v-if="aiHealth" class="mb-6">
      <div 
        :class="[
          'rounded-lg p-4 flex items-center gap-3',
          aiHealth.available && aiHealth.models?.vision && aiHealth.models?.text 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        ]"
      >
        <Icon 
          :name="aiHealth.available && aiHealth.models?.vision && aiHealth.models?.text ? 'mdi:check-circle' : 'mdi:alert'" 
          :class="[
            'w-6 h-6 flex-shrink-0',
            aiHealth.available && aiHealth.models?.vision && aiHealth.models?.text ? 'text-green-600' : 'text-yellow-600'
          ]"
        />
        <div class="flex-1">
          <p :class="[
            'text-sm font-medium',
            aiHealth.available && aiHealth.models?.vision && aiHealth.models?.text ? 'text-green-900' : 'text-yellow-900'
          ]">
            {{ aiHealth.message }}
          </p>
          <div v-if="aiHealth.models && (!aiHealth.models.vision || !aiHealth.models.text)" class="mt-2 space-y-1">
            <p v-if="!aiHealth.models.vision" class="text-xs text-yellow-700 flex items-center gap-2">
              <Icon name="mdi:alert-circle" class="w-4 h-4" />
              Missing Gemini API key. Get yours from: <a href="https://aistudio.google.com/app/apikey" target="_blank" class="underline">Google AI Studio</a> and add to .env
            </p>
            <p v-if="!aiHealth.models.text" class="text-xs text-yellow-700 flex items-center gap-2">
              <Icon name="mdi:alert-circle" class="w-4 h-4" />
              Missing Ollama Cloud API key. Get yours from: <a href="https://ollama.com/cloud" target="_blank" class="underline">Ollama Cloud</a> and add to .env
            </p>
            <p class="text-xs text-yellow-600 mt-2">
              ℹ️ Products will be created but AI validation will not run until both API keys are configured.
            </p>
          </div>
          <p v-else-if="!aiHealth.available" class="text-xs text-yellow-700 mt-1">
            Products will be created but AI validation will not run. Make sure Ollama is running and install required models.
          </p>
        </div>
        <button 
          @click="checkAIHealth"
          class="text-sm px-3 py-1.5 rounded-lg hover:bg-white/50 transition-colors flex items-center gap-1"
          :class="aiHealth.available && aiHealth.models?.vision && aiHealth.models?.text ? 'text-green-700' : 'text-yellow-700'"
        >
          <Icon name="mdi:refresh" class="w-4 h-4" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
            activeFilter === filter.value
              ? 'bg-primary-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          <Icon :name="filter.icon" class="w-4 h-4" />
          {{ filter.label }}
          <span 
            v-if="filter.count !== undefined"
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-bold',
              activeFilter === filter.value
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-700'
            ]"
          >
            {{ filter.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <Icon name="mdi:loading" class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600">Loading products...</p>
    </div>

    <!-- Products List -->
    <div v-else-if="filteredProducts.length > 0" class="space-y-4">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Image -->
          <div class="w-full lg:w-48 h-48 flex-shrink-0 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden">
            <img 
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon name="mdi:image" class="w-16 h-16 text-primary-400" />
            </div>
          </div>

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-semibold text-gray-900 mb-1">{{ product.name }}</h3>
                <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ product.description }}</p>
                <div class="flex flex-wrap items-center gap-3 text-sm">
                  <span class="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-medium">
                    {{ product.category }}
                  </span>
                  <span class="text-gray-600">
                    Price: <strong class="text-primary-600">${{ product.price.toFixed(2) }}</strong>
                  </span>
                  <span class="text-gray-600">
                    Stock: <strong :class="product.stock < 20 ? 'text-red-600' : 'text-green-600'">{{ product.stock }}</strong>
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 flex-shrink-0">
                <button
                  @click="editProduct(product)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Icon name="mdi:pencil" class="w-5 h-5" />
                </button>
                <button
                  @click="deleteProductHandler(product)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Icon name="mdi:delete" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Validation Status Component -->
            <ValidationStatus :product="product" />

            <!-- Refresh Status Button (for pending products only) -->
            <div v-if="product.validationStatus === 'pending'" 
                 class="mt-4">
              <button
                @click="checkValidationStatus(product.id!)"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Icon name="mdi:refresh" class="w-4 h-4" />
                Refresh Validation Status
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Page Info -->
          <div class="text-sm text-gray-600">
            Showing 
            <strong class="text-gray-900">{{ startIndex + 1 }}</strong> to 
            <strong class="text-gray-900">{{ Math.min(endIndex, filteredProducts.length) }}</strong> of 
            <strong class="text-gray-900">{{ filteredProducts.length }}</strong> products
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
            <label for="itemsPerPageAI" class="text-sm text-gray-600">Per page:</label>
            <select
              id="itemsPerPageAI"
              v-model="itemsPerPage"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <Icon name="mdi:package-variant" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 mb-4">
        {{ activeFilter === 'all' ? 'No products found.' : `No ${activeFilter} products.` }}
      </p>
      <button
        @click="showForm = true"
        class="btn btn-primary inline-flex items-center gap-2"
      >
        <Icon name="mdi:plus" class="w-5 h-5" />
        Add Your First Product
      </button>
    </div>

    <!-- Product Form Modal -->
    <ProductForm
      :show="showForm"
      :product="selectedProduct"
      :loading="formLoading"
      @close="closeForm"
      @submit="handleSubmit"
    />

    <!-- Toast -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

useHead({
  title: 'Product Management - AI Marketplace',
  meta: [
    { name: 'description', content: 'Manage your marketplace products with AI validation' }
  ]
})

const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts()
const toast = useToast()

const showForm = ref(false)
const selectedProduct = ref<Product | null>(null)
const formLoading = ref(false)
const activeFilter = ref<'all' | 'pending' | 'approved' | 'rejected'>('all')
const aiHealth = ref<any>(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

type FilterValue = 'all' | 'pending' | 'approved' | 'rejected'

// Fetch products on mount
onMounted(async () => {
  await fetchProducts()
  await checkAIHealth()
  
  // Poll for pending products every 5 seconds
  const pollInterval = setInterval(async () => {
    const hasPending = products.value.some(p => p.validationStatus === 'pending')
    if (hasPending) {
      await fetchProducts()
    } else {
      clearInterval(pollInterval)
    }
  }, 5000)

  onUnmounted(() => clearInterval(pollInterval))
})

// Check AI health
const checkAIHealth = async () => {
  try {
    const response = await $fetch<any>('/api/ai/health')
    aiHealth.value = response
  } catch (error) {
    console.error('Failed to check AI health:', error)
  }
}

// Filter products
const filteredProducts = computed(() => {
  if (activeFilter.value === 'all') return products.value
  return products.value.filter(p => p.validationStatus === activeFilter.value)
})

// Pagination computed properties
const totalPages = computed(() => 
  Math.ceil(filteredProducts.value.length / itemsPerPage.value)
)

const startIndex = computed(() => 
  (currentPage.value - 1) * itemsPerPage.value
)

const endIndex = computed(() => 
  startIndex.value + itemsPerPage.value
)

const paginatedProducts = computed(() => 
  filteredProducts.value.slice(startIndex.value, endIndex.value)
)

// Reset to page 1 when filter or items per page changes
watch([activeFilter, itemsPerPage], () => {
  currentPage.value = 1
})

// Compute counts
const filters = computed(() => [
  {
    value: 'all' as FilterValue,
    label: 'All Products',
    icon: 'mdi:view-grid',
    count: products.value.length
  },
  {
    value: 'pending' as FilterValue,
    label: 'Pending',
    icon: 'mdi:clock-outline',
    count: products.value.filter(p => p.validationStatus === 'pending').length
  },
  {
    value: 'approved' as FilterValue,
    label: 'Approved',
    icon: 'mdi:check-circle',
    count: products.value.filter(p => p.validationStatus === 'approved').length
  },
  {
    value: 'rejected' as FilterValue,
    label: 'Rejected',
    icon: 'mdi:close-circle',
    count: products.value.filter(p => p.validationStatus === 'rejected').length
  }
])

// Edit product
const editProduct = (product: any) => {
  selectedProduct.value = { ...product } as Product
  showForm.value = true
}

// Close form
const closeForm = () => {
  showForm.value = false
  selectedProduct.value = null
}

// Handle form submit
const handleSubmit = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  formLoading.value = true

  let success = false
  if (selectedProduct.value?.id) {
    success = await updateProduct(selectedProduct.value.id, productData)
  } else {
    success = await createProduct(productData)
  }

  formLoading.value = false

  if (success) {
    closeForm()
    toast.success('Product submitted! AI is validating and will auto-approve or reject.')
  }
}

// Delete product
const deleteProductHandler = async (product: any) => {
  if (!product.id) return

  if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
    await deleteProduct(product.id)
  }
}

// Check validation status
const checkValidationStatus = async (productId: string) => {
  await fetchProducts()
  toast.info('Validation status refreshed')
}
</script>
