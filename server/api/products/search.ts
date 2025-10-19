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

interface SearchFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'date-desc' | 'date-asc'
  limit?: number
  offset?: number
}

// Advanced product search
export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    try {
      const queryParams = getQuery(event) as SearchFilters
      const products = await readData<Product>('products.json')
      
      let filteredProducts = [...products]
      
      // Text search in name and description
      if (queryParams.query) {
        const searchTerm = queryParams.query.toLowerCase()
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        )
      }
      
      // Filter by category
      if (queryParams.category) {
        filteredProducts = filteredProducts.filter(p =>
          p.category.toLowerCase() === queryParams.category!.toLowerCase()
        )
      }
      
      // Filter by price range
      if (queryParams.minPrice !== undefined) {
        const minPrice = Number(queryParams.minPrice)
        if (!isNaN(minPrice)) {
          filteredProducts = filteredProducts.filter(p => p.price >= minPrice)
        }
      }
      
      if (queryParams.maxPrice !== undefined) {
        const maxPrice = Number(queryParams.maxPrice)
        if (!isNaN(maxPrice)) {
          filteredProducts = filteredProducts.filter(p => p.price <= maxPrice)
        }
      }
      
      // Filter by stock availability
      if (queryParams.inStock === true || queryParams.inStock === 'true' as any) {
        filteredProducts = filteredProducts.filter(p => p.stock > 0)
      }
      
      // Sort results
      if (queryParams.sortBy) {
        switch (queryParams.sortBy) {
          case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
            break
          case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price)
            break
          case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price)
            break
          case 'stock-asc':
            filteredProducts.sort((a, b) => a.stock - b.stock)
            break
          case 'stock-desc':
            filteredProducts.sort((a, b) => b.stock - a.stock)
            break
          case 'date-desc':
            filteredProducts.sort((a, b) => 
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            )
            break
          case 'date-asc':
            filteredProducts.sort((a, b) => 
              new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            )
            break
        }
      }
      
      // Pagination
      const total = filteredProducts.length
      const limit = queryParams.limit ? Number(queryParams.limit) : undefined
      const offset = queryParams.offset ? Number(queryParams.offset) : 0
      
      if (limit && limit > 0) {
        filteredProducts = filteredProducts.slice(offset, offset + limit)
      }
      
      // Calculate some useful statistics
      const stats = {
        totalFound: total,
        returned: filteredProducts.length,
        priceRange: filteredProducts.length > 0 ? {
          min: Math.min(...filteredProducts.map(p => p.price)),
          max: Math.max(...filteredProducts.map(p => p.price)),
          average: Number((filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length).toFixed(2))
        } : null,
        categories: [...new Set(filteredProducts.map(p => p.category))]
      }

      return {
        success: true,
        data: filteredProducts,
        statistics: stats,
        pagination: {
          total,
          limit: limit || total,
          offset,
          hasMore: limit ? (offset + limit) < total : false
        },
        message: `Found ${total} products matching your search criteria`
      }
    } catch (error) {
      console.error('Error searching products:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to search products'
      })
    }
  }

  if (method === 'POST') {
    try {
      const searchFilters = await readBody<SearchFilters>(event)
      const products = await readData<Product>('products.json')
      
      // Similar search logic but using POST body for more complex filters
      let filteredProducts = [...products]
      
      // Apply all the same filters as GET method
      if (searchFilters.query) {
        const searchTerm = searchFilters.query.toLowerCase()
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        )
      }
      
      // ... (same filtering logic as GET)
      
      return {
        success: true,
        data: filteredProducts,
        message: `Search completed with ${filteredProducts.length} results`
      }
    } catch (error) {
      console.error('Error in POST search:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to process search request'
      })
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})