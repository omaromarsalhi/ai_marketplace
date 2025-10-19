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

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required'
    })
  }

  const products = await readData<Product>('products.json')
  const product = findById(products, id)

  // GET - Read single product
  if (method === 'GET') {
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found'
      })
    }

    return {
      success: true,
      data: product
    }
  }

  // PUT/PATCH - Update product
  if (method === 'PUT' || method === 'PATCH') {
    const body = await readBody<Partial<Product>>(event)
    const updated = await updateItem<Product>('products.json', id, body)

    if (!updated) {
      throw createError({
        statusCode: 404,
        message: 'Product not found'
      })
    }

    return {
      success: true,
      data: updated,
      message: 'Product updated successfully'
    }
  }

  // DELETE - Delete product
  if (method === 'DELETE') {
    const deleted = await deleteItem<Product>('products.json', id)

    if (!deleted) {
      throw createError({
        statusCode: 404,
        message: 'Product not found'
      })
    }

    return {
      success: true,
      message: 'Product deleted successfully'
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
