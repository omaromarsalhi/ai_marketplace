<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
    <div class="max-w-3xl mx-auto px-4">
      <!-- Compact Header -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <NuxtLink 
            to="/products/manage" 
            class="p-1.5 hover:bg-white rounded-lg transition-colors"
          >
            <Icon name="mdi:arrow-left" class="w-5 h-5 text-gray-600" />
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Product' : 'Add Product' }}
          </h1>
        </div>
        <p class="text-sm text-gray-600 ml-10">
          {{ isEditMode ? 'Update product details' : 'Fill in the details below' }}
        </p>
      </div>

      <!-- Compact Product Form -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
          <!-- Row 1: Name and Category -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="e.g., Fresh Red Apple"
                required
                :class="[
                  'w-full px-3 py-2 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2',
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                ]"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
            </div>

            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                Category <span class="text-red-500">*</span>
              </label>
              <select
                id="category"
                v-model="formData.category"
                required
                :class="[
                  'w-full px-3 py-2 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2',
                  errors.category 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                ]"
              >
                <option value="">Select category</option>
                <option value="Beverages">Beverages</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Dairy">Dairy</option>
                <option value="Meat">Meat</option>
                <option value="Bread & Bakery">Bread & Bakery</option>
                <option value="Snacks">Snacks</option>
                <option value="Canned Goods">Canned Goods</option>
                <option value="Frozen Foods">Frozen Foods</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Cleaning Supplies">Cleaning Supplies</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Toys">Toys</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Automotive">Automotive</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Salad Mix">Salad Mix</option>
              </select>
              <p v-if="errors.category" class="mt-1 text-xs text-red-600">{{ errors.category }}</p>
            </div>
          </div>

          <!-- Row 2: Price and Stock -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
                Price <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  id="price"
                  v-model.number="formData.price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                  :class="[
                    'w-full pl-7 pr-3 py-2 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2',
                    errors.price 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  ]"
                />
              </div>
              <p v-if="errors.price" class="mt-1 text-xs text-red-600">{{ errors.price }}</p>
            </div>

            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">
                Stock <span class="text-red-500">*</span>
              </label>
              <input
                id="stock"
                v-model.number="formData.stock"
                type="number"
                min="0"
                placeholder="0"
                required
                :class="[
                  'w-full px-3 py-2 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2',
                  errors.stock 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                ]"
              />
              <p v-if="errors.stock" class="mt-1 text-xs text-red-600">{{ errors.stock }}</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              placeholder="Brief description of your product..."
              rows="3"
              required
              :class="[
                'w-full px-3 py-2 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2 resize-none',
                errors.description 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              ]"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-xs text-red-600">{{ errors.description }}</p>
          </div>

          <!-- Image Section - Compact -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            
            <!-- Image Preview - Smaller -->
            <div v-if="formData.imageUrl" class="mb-3">
              <div class="relative inline-block">
                <img 
                  :src="formData.imageUrl" 
                  alt="Product preview" 
                  class="w-48 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button 
                  type="button"
                  @click="formData.imageUrl = ''"
                  class="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                >
                  <Icon name="mdi:close" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Upload Options - Compact -->
            <div class="flex gap-2">
              <label class="cursor-pointer flex-1">
                <div class="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-center transition-colors text-sm">
                  <Icon name="mdi:upload" class="w-4 h-4 inline mr-1" />
                  {{ uploading ? 'Uploading...' : 'Upload' }}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUpload"
                  :disabled="uploading"
                />
              </label>
              
              <input
                v-model="formData.imageUrl"
                type="text"
                placeholder="Or paste URL"
                class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <!-- Auto-generate button - Compact -->
            <div v-if="formData.imageUrl" class="mt-3">
              <button 
                type="button"
                @click="autoGenerateContent"
                :disabled="generatingContent || uploading"
                class="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                <Icon 
                  :name="generatingContent ? 'mdi:loading' : 'mdi:sparkles'" 
                  :class="['w-4 h-4', generatingContent ? 'animate-spin' : '']" 
                />
                {{ generatingContent ? 'Generating...' : 'AI Auto-Generate' }}
              </button>
            </div>
          </div>

          <!-- Action Buttons - Compact -->
          <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <NuxtLink 
              to="/products/manage"
              class="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </NuxtLink>
            <button 
              type="submit" 
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              :disabled="loading"
            >
              <Icon v-if="loading" name="mdi:loading" class="w-4 h-4 animate-spin" />
              {{ 
                loading 
                  ? (isEditMode ? 'Updating...' : 'Creating...') 
                  : (isEditMode ? 'Update' : 'Create') 
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

// Page metadata
definePageMeta({
  title: 'Add New Product'
})

const { createProduct, updateProduct, getProduct } = useProducts()
const toast = useToast()
const router = useRouter()
const route = useRoute()

// Check if we're in edit mode
const editId = computed(() => route.query.edit as string)
const isEditMode = computed(() => !!editId.value)

const formData = reactive({
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
  imageUrl: ''
})

const errors = reactive({
  name: '',
  description: '',
  price: '',
  category: '',
  stock: ''
})

const uploading = ref(false)
const generatingContent = ref(false)
const loading = ref(false)

// Load product data if in edit mode
onMounted(async () => {
  if (isEditMode.value) {
    try {
      loading.value = true
      const product = await getProduct(editId.value)
      if (product) {
        Object.assign(formData, {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          imageUrl: product.imageUrl || ''
        })
      }
    } catch (error) {
      console.error('Failed to load product:', error)
      toast.error('Failed to load product data')
      await router.push('/products/manage')
    } finally {
      loading.value = false
    }
  }
})

const clearErrors = () => {
  errors.name = ''
  errors.description = ''
  errors.price = ''
  errors.category = ''
  errors.stock = ''
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!formData.name.trim()) {
    errors.name = 'Product name is required'
    isValid = false
  }

  if (!formData.description.trim()) {
    errors.description = 'Description is required'
    isValid = false
  } else if (formData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters'
    isValid = false
  }

  if (!formData.price || formData.price <= 0) {
    errors.price = 'Valid price is required'
    isValid = false
  }

  if (!formData.category) {
    errors.category = 'Category is required'
    isValid = false
  }

  if (!formData.stock || formData.stock < 0) {
    errors.stock = 'Stock must be 0 or greater'
    isValid = false
  }

  return isValid
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  uploading.value = true
  
  try {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    
    const response = await $fetch<{ success: boolean; data: { url: string }; message: string }>('/api/upload', {
      method: 'POST',
      body: uploadFormData
    })
    
    if (response.success) {
      formData.imageUrl = response.data.url
      toast.success(response.message)
    }
  } catch (err: any) {
    toast.error(err.data?.message || 'Failed to upload image')
  } finally {
    uploading.value = false
    target.value = ''
  }
}

const autoGenerateContent = async () => {
  if (!formData.imageUrl) {
    toast.error('Please upload an image first')
    return
  }

  generatingContent.value = true
  
  try {
    console.log('🎯 Auto-generating content for:', formData.imageUrl)
    
    const response = await $fetch<{
      success: boolean
      title: string
      description: string
      category: string
      imageDescription: string
    }>('/api/products/generate-content', {
      method: 'POST',
      body: {
        imageUrl: formData.imageUrl
      }
    })

    if (response.success) {
      formData.name = response.title
      formData.description = response.description
      formData.category = response.category
      
      clearErrors()
      
      toast.success('Content generated successfully!')
      console.log('✅ Generated content:', {
        title: response.title,
        description: response.description,
        category: response.category
      })
    }
  } catch (err: any) {
    console.error('❌ Error generating content:', err)
    toast.error(err.data?.message || 'Failed to generate content. Please try again.')
  } finally {
    generatingContent.value = false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: formData.price,
      category: formData.category,
      stock: formData.stock,
      imageUrl: formData.imageUrl.trim() || undefined
    }

    if (isEditMode.value) {
      await updateProduct(editId.value, productData)
      toast.success('Product updated successfully!')
    } else {
      await createProduct(productData)
      toast.success('Product created successfully!')
    }
    
    // Redirect back to product management
    await router.push('/products/manage')
  } catch (error: any) {
    toast.error(error.message || `Failed to ${isEditMode.value ? 'update' : 'create'} product`)
  } finally {
    loading.value = false
  }
}
</script>