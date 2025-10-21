import { readData } from '~/server/utils/storage'

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

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required'
    })
  }

  // GET - Get validation status
  if (method === 'GET') {
    try {
      const products = await readData<Product>('products.json')
      const product = products.find(p => p.id === id)

      if (!product) {
        throw createError({
          statusCode: 404,
          message: 'Product not found'
        })
      }

      return {
        success: true,
        data: {
          id: product.id,
          validationStatus: product.validationStatus || 'pending',
          validationResult: product.validationResult || null
        }
      }
    } catch (error: any) {
      if (error.statusCode) throw error
      
      console.error('Error fetching validation status:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch validation status'
      })
    }
  }

  // PATCH - Manually approve or reject
  if (method === 'PATCH') {
    try {
      const body = await readBody<{ action: 'approve' | 'reject' }>(event)
      
      if (!body.action || !['approve', 'reject'].includes(body.action)) {
        throw createError({
          statusCode: 400,
          message: 'Invalid action. Must be "approve" or "reject"'
        })
      }

      const products = await readData<Product>('products.json')
      const productIndex = products.findIndex(p => p.id === id)

      if (productIndex === -1) {
        throw createError({
          statusCode: 404,
          message: 'Product not found'
        })
      }

      const currentProduct = products[productIndex]
      if (!currentProduct) {
        throw createError({
          statusCode: 404,
          message: 'Product not found'
        })
      }

      // Update validation status
      currentProduct.validationStatus = body.action === 'approve' ? 'approved' : 'rejected'
      currentProduct.updatedAt = new Date().toISOString()

      // Save updated products
      const fs = await import('fs/promises')
      const path = await import('path')
      const dataDir = path.join(process.cwd(), 'server', 'data')
      await fs.writeFile(
        path.join(dataDir, 'products.json'),
        JSON.stringify(products, null, 2)
      )

      return {
        success: true,
        data: currentProduct,
        message: `Product ${body.action}d successfully`
      }
    } catch (error: any) {
      if (error.statusCode) throw error
      
      console.error('Error updating validation status:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to update validation status'
      })
    }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
