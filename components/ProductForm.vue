<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4 overflow-y-auto" @click.self="$emit('close')">
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="scale-90 opacity-0"
          leave-active-class="transition-all duration-300"
          leave-to-class="scale-90 opacity-0"
        >
          <div class="bg-white rounded-xl max-w-2xl w-full shadow-2xl my-8" v-if="show">
            <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl z-10">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ isEdit ? 'Edit Product' : 'Add New Product' }}
              </h3>
              <button 
                class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                @click="$emit('close')"
              >
                <Icon name="mdi:close" class="w-6 h-6" />
              </button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span class="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="Enter product name"
                  required
                  :class="[
                    'w-full px-4 py-2.5 border rounded-lg transition-all focus:outline-none focus:ring-2',
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
                  ]"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  placeholder="Enter product description"
                  rows="4"
                  required
                  :class="[
                    'w-full px-4 py-2.5 border rounded-lg transition-all focus:outline-none focus:ring-2 resize-none',
                    errors.description 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
                  ]"
                ></textarea>
                <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500">$</span>
                    </div>
                    <input
                      id="price"
                      v-model.number="formData.price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      required
                      :class="[
                        'w-full pl-8 pr-4 py-2.5 border rounded-lg transition-all focus:outline-none focus:ring-2',
                        errors.price 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
                      ]"
                    />
                  </div>
                  <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
                </div>

                <div>
                  <label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
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
                      'w-full px-4 py-2.5 border rounded-lg transition-all focus:outline-none focus:ring-2',
                      errors.stock 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
                    ]"
                  />
                  <p v-if="errors.stock" class="mt-1 text-sm text-red-600">{{ errors.stock }}</p>
                </div>
              </div>

              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                  Category <span class="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  v-model="formData.category"
                  required
                  :class="[
                    'w-full px-4 py-2.5 border rounded-lg transition-all focus:outline-none focus:ring-2 cursor-pointer',
                    errors.category 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
                  ]"
                >
                  <option value="">Select a category</option>
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
                <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                
                <!-- Image Preview -->
                <div v-if="formData.imageUrl" class="mb-3">
                  <img 
                    :src="formData.imageUrl" 
                    alt="Product preview" 
                    class="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  <button 
                    type="button"
                    @click="formData.imageUrl = ''"
                    class="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove image
                  </button>
                </div>

                <!-- Upload Button -->
                <div class="flex gap-3">
                  <label class="flex-1 cursor-pointer">
                    <div class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-center transition-colors">
                      <Icon name="mdi:upload" class="w-5 h-5 inline mr-2" />
                      {{ uploading ? 'Uploading...' : 'Upload Image' }}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      class="hidden"
                      @change="handleImageUpload"
                      :disabled="uploading"
                    />
                  </label>
                  
                  <div class="flex-1">
                    <input
                      v-model="formData.imageUrl"
                      type="text"
                      placeholder="Or paste image URL"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <p class="mt-1 text-xs text-gray-500">Upload an image or enter a URL</p>
              </div>

              <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  @click="$emit('close')"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  :disabled="loading"
                >
                  <Icon v-if="loading" name="mdi:loading" class="w-5 h-5 animate-spin" />
                  {{ loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product') }}
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
