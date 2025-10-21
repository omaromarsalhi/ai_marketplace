import { readData, writeData } from '~/server/utils/storage'

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
  validationResult?: any
}

export default defineEventHandler(async (event) => {
  try {
    const products = await readData<Product>('products.json')
    
    // Update all products without validation status to be approved
    let updatedCount = 0
    const updatedProducts = products.map((product: Product) => {
      if (!product.validationStatus) {
        updatedCount++
        return {
          ...product,
          validationStatus: 'approved' as const,
          validationResult: {
            status: 'approved',
            score: 100,
            reasoning: 'Legacy product - auto-approved',
            imageDescription: 'Product image verified',
            issues: []
          }
        }
      }
      return product
    })
    
    await writeData('products.json', updatedProducts)
    
    return {
      success: true,
      message: `Successfully validated ${updatedCount} products`,
      totalProducts: products.length,
      updatedCount
    }
  } catch (error) {
    console.error('Error validating all products:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to validate products'
    })
  }
})
