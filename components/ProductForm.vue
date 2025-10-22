<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" @click.self="$emit('close')">
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="scale-95 opacity-0"
          leave-active-class="transition-all duration-300"
          leave-to-class="scale-95 opacity-0"
        >
          <div class="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col" v-if="show">
            <!-- Compact Header -->
            <div class="flex items-center justify-between px-5 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl z-10">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ isEdit ? 'Edit Product' : 'Add Product' }}
              </h3>
              <button 
                class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                @click="$emit('close')"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Compact Form -->
            <form @submit.prevent="handleSubmit" class="p-5 space-y-3 overflow-y-auto flex-1">
              <!-- Name -->
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

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  placeholder="Brief product description..."
                  rows="2"
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

              <!-- Price and Stock Row -->
              <div class="grid grid-cols-2 gap-3">
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

              <!-- Category -->
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                  Category <span class="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  v-model="formData.category"
                  required
                  :class="[
                    'w-full px-3 py-2 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2 cursor-pointer',
                    errors.category 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  ]"
                >
                  <option value="">Select category</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Organic">Organic</option>
                  <option value="Seasonal">Seasonal</option>
                  <option value="Exotic">Exotic</option>
                  <option value="Berries">Berries</option>
                  <option value="Leafy Greens">Leafy Greens</option>
                  <option value="Root Vegetables">Root Vegetables</option>
                  <option value="Citrus">Citrus</option>
                  <option value="Tropical">Tropical</option>
                  <option value="Herbs">Herbs</option>
                  <option value="Nuts & Seeds">Nuts & Seeds</option>
                  <option value="Dried Fruits">Dried Fruits</option>
                  <option value="Fresh Juices">Fresh Juices</option>
                  <option value="Salad Mix">Salad Mix</option>
                </select>
                <p v-if="errors.category" class="mt-1 text-xs text-red-600">{{ errors.category }}</p>
              </div>

              <!-- Image Section - Compact -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                
                <!-- Compact Image Preview -->
                <div v-if="formData.imageUrl" class="mb-2">
                  <div class="relative inline-block">
                    <img 
                      :src="formData.imageUrl" 
                      alt="Product preview" 
                      class="w-32 h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button 
                      type="button"
                      @click="formData.imageUrl = ''"
                      class="absolute -top-1.5 -right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                    >
                      <Icon name="mdi:close" class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <!-- Upload Options - Side by side -->
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
                <div v-if="formData.imageUrl" class="mt-2">
                  <button 
                    type="button"
                    @click="autoGenerateContent"
                    :disabled="generatingContent || uploading"
                    class="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed text-sm"
                  >
                    <Icon 
                      :name="generatingContent ? 'mdi:loading' : 'mdi:sparkles'" 
                      :class="['w-4 h-4', generatingContent ? 'animate-spin' : '']" 
                    />
                    {{ generatingContent ? 'Generating...' : 'AI Auto-Generate' }}
                  </button>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2 justify-end pt-3 border-t border-gray-200">
                <button 
                  type="button" 
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  @click="$emit('close')"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  :disabled="loading"
                >
                  <Icon v-if="loading" name="mdi:loading" class="w-4 h-4 animate-spin" />
                  {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

interface Props {
  show: boolean
  product?: Product | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  product: null,
  loading: false
})

const emit = defineEmits<{
  close: []
  submit: [product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>]
}>()

const toast = useToast()
const isEdit = computed(() => !!props.product?.id)

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

const resetForm = () => {
  formData.name = ''
  formData.description = ''
  formData.price = 0
  formData.category = ''
  formData.stock = 0
  formData.imageUrl = ''
  clearErrors()
}

const clearErrors = () => {
  errors.name = ''
  errors.description = ''
  errors.price = ''
  errors.category = ''
  errors.stock = ''
}

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.name = newProduct.name || ''
    formData.description = newProduct.description || ''
    formData.price = newProduct.price || 0
    formData.category = newProduct.category || ''
    formData.stock = newProduct.stock || 0
    formData.imageUrl = newProduct.imageUrl || ''
  } else {
    resetForm()
  }
}, { immediate: true })

const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  if (!formData.name.trim()) {
    errors.name = 'Product name is required'
    isValid = false
  } else if (formData.name.length < 3) {
    errors.name = 'Name must be at least 3 characters'
    isValid = false
  }

  if (!formData.description.trim()) {
    errors.description = 'Description is required'
    isValid = false
  } else if (formData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters'
    isValid = false
  }

  if (formData.price <= 0) {
    errors.price = 'Price must be greater than 0'
    isValid = false
  }

  if (!formData.category) {
    errors.category = 'Please select a category'
    isValid = false
  }

  if (formData.stock < 0) {
    errors.stock = 'Stock cannot be negative'
    isValid = false
  }

  return isValid
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size must be less than 5MB')
    return
  }
  
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
    // Reset input
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
      // Update form data with generated content
      formData.name = response.title
      formData.description = response.description
      formData.category = response.category
      
      // Clear any existing errors
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

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  emit('submit', {
    name: formData.name.trim(),
    description: formData.description.trim(),
    price: formData.price,
    category: formData.category,
    stock: formData.stock,
    imageUrl: formData.imageUrl.trim() || undefined
  })
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>
