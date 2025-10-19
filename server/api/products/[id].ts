import { readData, updateItem, deleteItem, findById } from '~/server/utils/storage'

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

      const updated = await updateItem<Product>('products.json', id, updateData)

      if (!updated) {
        throw createError({
          statusCode: 500,
          message: 'Failed to update product'
        })
      }

      return {
        success: true,
        data: updated,
        message: `Product "${updated.name}" updated successfully`
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
