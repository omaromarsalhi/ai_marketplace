<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Icon name="mdi:cog" class="w-8 h-8 text-primary-500" />
          Fresh Market Management
        </h1>
        <p class="text-gray-600 mt-2">Manage your fresh vegetables and fruits with full CRUD operations</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="btn btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
      >
        <Icon name="mdi:plus-circle" class="w-5 h-5" />
        Add Product
      </button>
    </div>

    <!-- Search and Filter Toolbar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search Box -->
        <div class="flex-1">
          <div class="relative">
            <Icon name="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products by name, description, or category..."
              class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="mdi:close-circle" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3">
          <select 
            v-model="selectedCategory" 
            class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer bg-white min-w-[180px]"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <select 
            v-model="sortBy" 
            class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer bg-white min-w-[200px]"
          >
            <option value="name">Sort by Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !products.length" class="text-center py-16">
      <Icon name="mdi:loading" class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600">Loading products...</p>
    </div>

    <!-- Empty State (No Products) -->
    <div v-else-if="!filteredProducts.length && !searchQuery && !selectedCategory" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <Icon name="mdi:package-variant" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">No Products Yet</h2>
      <p class="text-gray-600 mb-6">Start by adding your first product to the marketplace</p>
      <button @click="openCreateModal" class="btn btn-primary inline-flex items-center gap-2">
        <Icon name="mdi:plus" class="w-5 h-5" />
        Add Your First Product
      </button>
    </div>

    <!-- No Results State -->
    <div v-else-if="!filteredProducts.length" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <Icon name="mdi:magnify" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h2>
      <p class="text-gray-600 mb-6">Try adjusting your search or filters</p>
      <button @click="clearFilters" class="btn btn-secondary inline-flex items-center gap-2">
        <Icon name="mdi:filter-off" class="w-5 h-5" />
        Clear Filters
      </button>
    </div>

    <!-- Products Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <p class="text-sm text-gray-600">
          Showing <strong class="text-gray-900">{{ filteredProducts.length }}</strong> of 
          <strong class="text-gray-900">{{ products.length }}</strong> products
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <img 
                    v-if="product.imageUrl" 
                    :src="product.imageUrl" 
                    :alt="product.name"
                    class="w-full h-full object-cover"
                  />
                  <Icon v-else name="mdi:image" class="w-6 h-6 text-primary-500" />
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 max-w-xs truncate">{{ product.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                  {{ product.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-primary-600">${{ product.price.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    product.stock === 0 ? 'bg-red-100 text-red-800' :
                    product.stock < 20 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  ]"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(product.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button 
                    @click="openEditModal(product)" 
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit product"
                  >
                    <Icon name="mdi:pencil" class="w-5 h-5" />
                  </button>
                  <button 
                    @click="confirmDelete(product)" 
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete product"
                  >
                    <Icon name="mdi:delete" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Form Modal -->
    <ProductForm
      :show="showForm"
      :product="editingProduct"
      :loading="formLoading"
      @close="closeForm"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :show="showDeleteDialog"
      title="Delete Product"
      :message="`Are you sure you want to delete '${productToDelete?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />

    <!-- Toast Notifications -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

useHead({
  title: 'Product Management - Fresh Market',
  meta: [
    { name: 'description', content: 'Manage fresh vegetables and fruits with full CRUD operations' }
  ]
})

const { 
  products, 
  loading, 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  categories 
} = useProducts()

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('name')
const showForm = ref(false)
const showDeleteDialog = ref(false)
const editingProduct = ref<Product | null>(null)
const productToDelete = ref<Product | null>(null)
const formLoading = ref(false)

onMounted(async () => {
  await fetchProducts()
})

const filteredProducts = computed(() => {
  let result = [...products.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  switch (sortBy.value) {
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'stock-asc':
      result.sort((a, b) => a.stock - b.stock)
      break
    case 'stock-desc':
      result.sort((a, b) => b.stock - a.stock)
      break
    case 'date-desc':
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      break
    case 'date-asc':
      result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
      break
  }

  return result
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortBy.value = 'name'
}

const openCreateModal = () => {
  editingProduct.value = null
  showForm.value = true
}

const openEditModal = (product: Product) => {
  editingProduct.value = { ...product }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingProduct.value = null
}

const handleFormSubmit = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  formLoading.value = true
  
  try {
    let success = false

    if (editingProduct.value?.id) {
      success = await updateProduct(editingProduct.value.id, productData)
    } else {
      success = await createProduct(productData)
    }

    if (success) {
      closeForm()
    }
  } finally {
    formLoading.value = false
  }
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!productToDelete.value?.id) return

  const success = await deleteProduct(productToDelete.value.id)
  
  if (success) {
    showDeleteDialog.value = false
    productToDelete.value = null
  }
}

const formatDate = (date?: string): string => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}
</script>
