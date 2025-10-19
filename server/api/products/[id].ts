import { readData, updateItem, deleteItem, findById } from '~/server/utils/storage'
import { validateProductWithAI, checkRequiredModels } from '~/server/utils/aiValidator'

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
  validationStatus?: 'pending' | 'approved' | 'rejected'
  validationScore?: number
  validationIssues?: string[]
  aiDescription?: string
  validationResult?: {
    score: number
    issues: string[]
    imageDescription: string
    reasoning: string
  }
}

// Validation function for product updates
function validateProductUpdate(product: Partial<Product>): string[] {
  const errors: string[] = []
  
  if (product.name !== undefined && (!product.name || product.name.trim().length < 2)) {
    errors.push('Product name must be at least 2 characters long')
  }
  
  if (product.description !== undefined && (!product.description || product.description.trim().length < 10)) {
    errors.push('Product description must be at least 10 characters long')
  }
  
  if (product.price !== undefined && (!product.price || product.price <= 0)) {
    errors.push('Product price must be greater than 0')
  }
  
  if (product.category !== undefined && (!product.category || product.category.trim().length === 0)) {
    errors.push('Product category is required')
  }
  
  if (product.stock !== undefined && (product.stock < 0)) {
    errors.push('Product stock must be 0 or greater')
  }
  
  return errors
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

  try {
    const products = await readData<Product>('products.json')
    const product = findById(products, id)

    // GET - Read single product
    if (method === 'GET') {
      if (!product) {
        throw createError({
          statusCode: 404,
          message: `Product with ID "${id}" not found`
        })
      }

      return {
        success: true,
        data: product,
        message: `Product "${product.name}" retrieved successfully`
      }
    }

    // PUT/PATCH - Update product
    if (method === 'PUT' || method === 'PATCH') {
      if (!product) {
        throw createError({
          statusCode: 404,
          message: `Product with ID "${id}" not found`
        })
      }

      const body = await readBody<Partial<Product>>(event)
      
      // Validate update data
      const errors = validateProductUpdate(body)
      if (errors.length > 0) {
        throw createError({
          statusCode: 400,
          message: 'Validation failed',
          data: { errors }
        })
      }
      
      // Sanitize and format update data
      const updateData: Partial<Product> = {}
      
      if (body.name !== undefined) {
        updateData.name = body.name.trim()
        
        // Check for duplicate name (excluding current product)
        const duplicateName = products.find(p => 
          p.id !== id && p.name.toLowerCase() === updateData.name!.toLowerCase()
        )
        
        if (duplicateName) {
          throw createError({
            statusCode: 409,
            message: 'A product with this name already exists'
          })
        }
      }
      
      if (body.description !== undefined) {
        updateData.description = body.description.trim()
      }
      
      if (body.price !== undefined) {
        updateData.price = Number(body.price)
      }
      
      if (body.category !== undefined) {
        updateData.category = body.category.trim()
      }
      
      if (body.stock !== undefined) {
        updateData.stock = Number(body.stock)
      }
      
      if (body.imageUrl !== undefined) {
        updateData.imageUrl = body.imageUrl.trim()
      }

      // Reset validation status to pending for any product update to trigger AI re-validation
      updateData.validationStatus = 'pending'
      // Clear previous validation data to trigger fresh AI check
      updateData.validationScore = undefined
      updateData.validationIssues = undefined
      updateData.aiDescription = undefined
      console.log(`🔄 Product ${id} updated, resetting to pending for AI re-validation`)

      const updated = await updateItem<Product>('products.json', id, updateData)

      if (!updated) {
        throw createError({
          statusCode: 500,
          message: 'Failed to update product'
        })
      }

      // Start AI validation in background for updated product (non-blocking)
      if (updated.imageUrl) {
        console.log(`🚀 Starting AI validation for updated product: ${updated.id}`)
        
        // Check if required models are available
        const modelsStatus = await checkRequiredModels()
        
        if (modelsStatus.vision && modelsStatus.text) {
          // Run validation asynchronously without blocking the response
          validateProductWithAI(
            updated.name,
            updated.description,
            updated.imageUrl
          ).then(async (validationResult) => {
            // Update product with validation results
            const products = await readData<Product>('products.json')
            const productIndex = products.findIndex(p => p.id === updated.id)
            
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
                
                console.log(`✅ Updated product ${updated.id} validation complete: ${currentProduct.validationStatus}`)
              }
            }
          }).catch((error) => {
            console.error(`❌ Validation failed for updated product ${updated.id}:`, error.message)
            // Optionally mark as rejected if validation fails
          })
        } else {
          console.warn(`⚠️ Required models not available for product update validation (Vision: ${modelsStatus.vision}, Text: ${modelsStatus.text})`)
          console.warn(`📝 ${modelsStatus.message}`)
        }
      }

      return {
        success: true,
        data: updated,
        message: `Product "${updated.name}" updated successfully and sent for AI re-validation`
      }
    }

    // DELETE - Delete product
    if (method === 'DELETE') {
      if (!product) {
        throw createError({
          statusCode: 404,
          message: `Product with ID "${id}" not found`
        })
      }

      const deleted = await deleteItem<Product>('products.json', id)

      if (!deleted) {
        throw createError({
          statusCode: 500,
          message: 'Failed to delete product'
        })
      }

      return {
        success: true,
        message: `Product "${product.name}" deleted successfully`,
        data: { id: product.id, name: product.name }
      }
    }

    // Method not allowed
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error(`Error handling ${method} request for product ${id}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})
