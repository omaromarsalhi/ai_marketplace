// server/api/orders.ts
import { createError } from 'h3'
import { readData, writeData } from '~/server/utils/storage'
import { createId } from '~/server/utils/ids'
import type { Order, OrderData } from '~/types/order'

const ORDERS_FILE = 'orders.json'
const PRODUCTS_FILE = 'products.json'

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = getRouterParam(event, 'id')

  try {
    // GET /api/orders - List all orders
    if (method === 'GET' && !id) {
      const data = await readData<any>(ORDERS_FILE)
      if (!data || !Array.isArray(data) || data.length === 0 || !data[0] || !data[0].orders) {
        return { orders: [] }
      }
      return { orders: data[0].orders }
    }

    // GET /api/orders/:id - Get single order
    if (method === 'GET' && id) {
      const data = await readData<any>(ORDERS_FILE)
      if (!data || !Array.isArray(data) || data.length === 0 || !data[0] || !data[0].orders) {
        throw createError({ 
          statusCode: 404, 
          message: 'Order not found' 
        })
      }
      
      const order = data[0].orders.find((o: Order) => o.id === id)
      if (!order) {
        throw createError({ 
          statusCode: 404, 
          message: 'Order not found' 
        })
      }
      return order
    }

    // POST /api/orders - Create order
    if (method === 'POST') {
      const body = await readBody(event)
      const now = new Date().toISOString()
      
      // Read products to calculate total amount
      const productsData = await readData<any>(PRODUCTS_FILE)
      const products = Array.isArray(productsData) ? productsData : []

      // Calculate total amount based on product prices
      let totalAmount = 0
      const productsWithPrices = body.products.map((item: any) => {
        const product = products.find((p: any) => p.id === item.productId)
        const price = product?.price || 0
        const itemTotal = price * item.quantity
        totalAmount += itemTotal
        
        return {
          ...item,
          price: price
        }
      })

      const order: Order = {
        id: createId(),
        ...body,
        products: productsWithPrices,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        createdAt: now,
        updatedAt: now,
        status: 'pending'
      }

      const data = await readData<any>(ORDERS_FILE)
      
      // If no data exists, create the structure
      if (!data || !Array.isArray(data) || data.length === 0) {
        const newData = [{
          orders: [order]
        }]
        await writeData(ORDERS_FILE, newData)
        return order
      }

      // Ensure orders array exists in the first element
      if (!data[0].orders) {
        data[0].orders = []
      }

      // Add order to existing data
      data[0].orders.push(order)
      await writeData(ORDERS_FILE, data)
      
      return order
    }

    // PUT /api/orders/:id - Update order
    if (method === 'PUT' && id) {
      const body = await readBody(event)
      const data = await readData<any>(ORDERS_FILE)
      
      if (!data || !Array.isArray(data) || data.length === 0 || !data[0] || !data[0].orders) {
        throw createError({ 
          statusCode: 404, 
          message: 'Order not found' 
        })
      }

      const index = data[0].orders.findIndex((o: Order) => o.id === id)
      if (index === -1) {
        throw createError({ 
          statusCode: 404, 
          message: 'Order not found' 
        })
      }

      const updatedOrder: Order = {
        ...data[0].orders[index],
        ...body,
        updatedAt: new Date().toISOString()
      }
      
      data[0].orders[index] = updatedOrder
      await writeData(ORDERS_FILE, data)
      
      return updatedOrder
    }

    // DELETE /api/orders/:id - Delete order
    if (method === 'DELETE' && id) {
      const data = await readData<any>(ORDERS_FILE)
      
      if (!data || !Array.isArray(data) || data.length === 0 || !data[0] || !data[0].orders) {
        return { success: false, message: 'No orders found' }
      }

      data[0].orders = data[0].orders.filter((o: Order) => o.id !== id)
      await writeData(ORDERS_FILE, data)
      return { success: true }
    }

    throw createError({ 
      statusCode: 405, 
      message: 'Method not allowed' 
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Server error'
    })
  }
})