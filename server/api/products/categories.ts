import { readData } from '~/server/utils/storage'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

// GET product categories
export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    try {
      const products = await readData<Product>('products.json')
      
      // Get unique categories from products
      const categories = [...new Set(products.map(p => p.category))].sort()
      
      // Add predefined categories for fresh market
      const predefinedCategories = ['Fruits', 'Vegetables', 'Organic', 'Seasonal', 'Exotic']
      const allCategories = [...new Set([...predefinedCategories, ...categories])].sort()
      
      // Get category statistics
      const categoryStats = allCategories.map(category => {
        const productCount = products.filter(p => p.category === category).length
        const avgPrice = products
          .filter(p => p.category === category)
          .reduce((sum, p, _, arr) => sum + p.price / arr.length, 0)
        
        return {
          name: category,
          productCount,
          averagePrice: productCount > 0 ? Number(avgPrice.toFixed(2)) : 0
        }
      })

      return {
        success: true,
        data: {
          categories: allCategories,
          statistics: categoryStats,
          total: allCategories.length
        },
        message: `Found ${allCategories.length} categories`
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch categories'
      })
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})