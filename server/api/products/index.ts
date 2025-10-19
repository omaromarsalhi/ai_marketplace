import { readData, createItem, updateItem, deleteItem } from '~/server/utils/storage'

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
}

// GET all products
export default defineEventHandler(async (event) => {
  const method = event.method

  // GET - Read all products
  if (method === 'GET') {
    const products = await readData<Product>('products.json')
    return {
      success: true,
      data: products,
      count: products.length
    }
  }

  // POST - Create new product
  if (method === 'POST') {
    const body = await readBody<Omit<Product, 'id'>>(event)
    
    // Basic validation
    if (!body.name || !body.price) {
      throw createError({
        statusCode: 400,
        message: 'Name and price are required'
      })
    }

    const newProduct = await createItem<Product>('products.json', body)
    
    return {
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
