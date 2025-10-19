/**
 * Products Composable
 * Manages product CRUD operations and state
 */

export interface Product {
  id?: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
  validationStatus?: 'pending' | 'approved' | 'rejected'
  validationResult?: {
    score: number
    issues: string[]
    imageDescription: string
    reasoning: string
  }
}

export const useProducts = () => {
  const toast = useToast()
  
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  /**
   * Fetch all products
   */
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{
        success: boolean
        data: Product[]
        count: number
      }>('/api/products')
      
      if (response.success) {
        products.value = response.data
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products'
      toast.error('Failed to load products')
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Get single product by ID
   */
  const getProduct = async (id: string): Promise<Product | null> => {
    try {
      const response = await $fetch<{
        success: boolean
        data: Product
      }>(`/api/products/${id}`)
      
      return response.success ? response.data : null
    } catch (err) {
      toast.error('Failed to fetch product')
      return null
    }
  }
  
  /**
   * Create new product
   */
  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    loading.value = true
    
    try {
      const response = await $fetch<{
        success: boolean
        data: Product
        message: string
      }>('/api/products', {
        method: 'POST',
        body: productData
      })
      
      if (response.success && response.data) {
        products.value.push(response.data)
        toast.success(response.message || 'Product created successfully')
        return true
      }
      
      return false
    } catch (err: any) {
      const message = err.data?.message || err.message || 'Failed to create product'
      toast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Update existing product
   */
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    loading.value = true
    
    try {
      console.log('Updating product:', id, updates)
      
      const response = await $fetch<{
        success: boolean
        data: Product
        message: string
      }>(`/api/products/${id}`, {
        method: 'PUT',
        body: updates
      })
      
      console.log('Update response:', response)
      
      if (response.success && response.data) {
        // Update local state
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value[index] = response.data
        }
        
        toast.success(response.message || 'Product updated successfully')
        return true
      }
      
      return false
    } catch (err: any) {
      console.error('Update error:', err)
      const message = err.data?.message || err.message || 'Failed to update product'
      toast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Delete product
   */
  const deleteProduct = async (id: string): Promise<boolean> => {
    loading.value = true
    
    try {
      const response = await $fetch<{
        success: boolean
        message: string
      }>(`/api/products/${id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        // Remove from local state
        products.value = products.value.filter(p => p.id !== id)
        toast.success(response.message || 'Product deleted successfully')
        return true
      }
      
      return false
    } catch (err: any) {
      const message = err.data?.message || err.message || 'Failed to delete product'
      toast.error(message)
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Search products
   */
  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return products.value
    
    const lowerQuery = query.toLowerCase()
    return products.value.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    )
  }
  
  /**
   * Filter by category
   */
  const filterByCategory = (category: string): Product[] => {
    if (!category) return products.value
    return products.value.filter(product => product.category === category)
  }
  
  /**
   * Get unique categories
   */
  const getCategories = computed(() => {
    const dynamicCategories = new Set(products.value.map(p => p.category))
    const predefinedCategories = [
      'Fruits', 
      'Vegetables', 
      'Organic', 
      'Seasonal', 
      'Exotic',
      'Berries',
      'Leafy Greens',
      'Root Vegetables',
      'Citrus',
      'Tropical',
      'Herbs',
      'Nuts & Seeds',
      'Dried Fruits',
      'Fresh Juices',
      'Salad Mix'
    ]
    const allCategories = new Set([...predefinedCategories, ...dynamicCategories])
    return Array.from(allCategories).sort()
  })
  
  // Define static categories for the fresh market
  const staticCategories = [
    'Fruits', 
    'Vegetables', 
    'Organic', 
    'Seasonal', 
    'Exotic',
    'Berries',
    'Leafy Greens',
    'Root Vegetables',
    'Citrus',
    'Tropical',
    'Herbs',
    'Nuts & Seeds',
    'Dried Fruits',
    'Fresh Juices',
    'Salad Mix'
  ]
  
  return {
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByCategory,
    categories: getCategories,
    staticCategories
  }
}
