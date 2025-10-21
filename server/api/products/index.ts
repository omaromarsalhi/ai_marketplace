import { readData, createItem } from '~/server/utils/storage'
import { validateProductWithAI, checkOllamaHealth, checkRequiredModels } from '~/server/utils/aiValidator'

interface Product {
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

// Validation function for product data
function validateProduct(product: Partial<Product>): string[] {
  const errors: string[] = []
  
  if (!product.name || product.name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters long')
  }
  
  if (!product.description || product.description.trim().length < 10) {
    errors.push('Product description must be at least 10 characters long')
  }
  
  if (!product.price || product.price <= 0) {
    errors.push('Product price must be greater than 0')
  }
  
  if (!product.category || product.category.trim().length === 0) {
    errors.push('Product category is required')
  }
  
  if (product.stock === undefined || product.stock < 0) {
    errors.push('Product stock must be 0 or greater')
  }
  
  return errors
}

// GET all products with optional filtering
export default defineEventHandler(async (event) => {
  const method = event.method

  // GET - Read all products with optional filtering
  if (method === 'GET') {
    try {
      const query = getQuery(event)
      const products = await readData<Product>('products.json')
      
      let filteredProducts = products
      
      // Filter by category
      if (query.category && typeof query.category === 'string') {
        const category = query.category.toString()
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase() === category.toLowerCase()
        )
      }
      
      // Search by name or description
      if (query.search && typeof query.search === 'string') {
        const searchTerm = query.search.toString().toLowerCase()
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        )
      }
      
      // Filter by price range
      if (query.minPrice) {
        const minPrice = parseFloat(query.minPrice.toString())
        if (!isNaN(minPrice)) {
          filteredProducts = filteredProducts.filter(p => p.price >= minPrice)
        }
      }
      
      if (query.maxPrice) {
        const maxPrice = parseFloat(query.maxPrice.toString())
        if (!isNaN(maxPrice)) {
          filteredProducts = filteredProducts.filter(p => p.price <= maxPrice)
        }
      }
      
      // Sort options
      if (query.sortBy && typeof query.sortBy === 'string') {
        const sortBy = query.sortBy.toString()
        switch (sortBy) {
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
      
      return {
        success: true,
        data: filteredProducts,
        count: filteredProducts.length,
        total: products.length,
        message: `Found ${filteredProducts.length} products`
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch products'
      })
    }
  }

  // POST - Create new product
  if (method === 'POST') {
    try {
      const body = await readBody<Omit<Product, 'id'>>(event)
      
      // Validate product data
      const errors = validateProduct(body)
      if (errors.length > 0) {
        throw createError({
          statusCode: 400,
          message: 'Validation failed',
          data: { errors }
        })
      }
      
      // Sanitize and format data
      const productData: any = {
        name: body.name.trim(),
        description: body.description.trim(),
        price: Number(body.price),
        category: body.category.trim(),
        stock: Number(body.stock),
        imageUrl: body.imageUrl?.trim() || '',
        validationStatus: 'pending'
      }
      
      // Check for duplicate product names
      const existingProducts = await readData<Product>('products.json')
      const duplicateName = existingProducts.find(p => 
        p.name.toLowerCase() === productData.name.toLowerCase()
      )
      
      if (duplicateName) {
        throw createError({
          statusCode: 409,
          message: 'A product with this name already exists'
        })
      }
      
      // Create product first with pending status
      const newProduct = await createItem<Product>('products.json', productData)
      
      // Start AI validation in background (non-blocking)
      if (productData.imageUrl) {
        console.log(`🚀 Starting AI validation for product: ${newProduct.id}`)
        
        // Check if required models are available
        const modelsStatus = await checkRequiredModels()
        
        if (modelsStatus.vision && modelsStatus.text) {
          // Run validation asynchronously without blocking the response
          validateProductWithAI(
            productData.name,
            productData.description,
            productData.imageUrl
          ).then(async (validationResult) => {
            // Update product with validation results
            const products = await readData<Product>('products.json')
            const productIndex = products.findIndex(p => p.id === newProduct.id)
            
            if (productIndex !== -1) {
              const currentProduct = products[productIndex]
              if (currentProduct) {
                currentProduct.validationResult = {
                  score: validationResult.score,
                  issues: validationResult.issues,
                  imageDescription: validationResult.imageDescription,
                  reasoning: validationResult.reasoning
                }
                currentProduct.validationStatus = validationResult.isValid ? 'approved' : 'rejected'
                
                // Save updated products
                const fs = await import('fs/promises')
                const path = await import('path')
                const dataDir = path.join(process.cwd(), 'server', 'data')
                await fs.writeFile(
                  path.join(dataDir, 'products.json'),
                  JSON.stringify(products, null, 2)
                )
                
                console.log(`✅ Product ${newProduct.id} validation complete: ${currentProduct.validationStatus}`)
              }
            }
          }).catch((error) => {
            console.error(`❌ Validation failed for product ${newProduct.id}:`, error.message)
            // Optionally mark as rejected if validation fails
          })
        } else {
          if (!modelsStatus.vision || !modelsStatus.text) {
            console.warn(`⚠️ Required models not available (Vision: ${modelsStatus.vision}, Text: ${modelsStatus.text}). Product will remain in pending status.`)
            console.warn(`📝 ${modelsStatus.message}`)
          }
        }
      } else {
        // No image, auto-approve (or you can reject)
        productData.validationStatus = 'approved'
      }
      
      return {
        success: true,
        data: newProduct,
        message: `Product "${newProduct.name}" created successfully and is being validated by AI`
      }
    } catch (error: any) {
      if (error.statusCode) {
        throw error
      }
      
      console.error('Error creating product:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to create product'
      })
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
