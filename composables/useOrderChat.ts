// composables/useOrderChat.ts
import { ref } from 'vue'

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface OrderRequest {
  products: Array<{
    productId: string
    quantity: number
  }>
  userId: string
}

export const useOrderChat = () => {
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const isOrderPlacing = ref(false)

  // Add initial welcome message
  messages.value.push({
    id: '1',
    content: "Hello! I'm your shopping assistant. Tell me what products you'd like to order (like '2 apples and 1 banana') and I'll help you place the order.",
    isUser: false,
    timestamp: new Date()
  })

  const extractOrderFromMessage = async (message: string): Promise<OrderRequest | null> => {
    try {
      console.log('🤖 Calling Gemini API with message:', message)
      
      const response = await $fetch('/api/chat/order', {
        method: 'POST',
        body: { message }
      }) as any

      console.log('🤖 Gemini response:', response)
      return response.data
    } catch (error) {
      console.error('❌ Error extracting order:', error)
      addMessage("Sorry, I'm having trouble connecting to the AI service. Please try again later.", false)
      return null
    }
  }

  const placeOrder = async (orderRequest: OrderRequest) => {
    try {
      isOrderPlacing.value = true
      
      const response = await $fetch('/api/orders', {
        method: 'POST',
        body: {
          userId: orderRequest.userId,
          products: orderRequest.products
        }
      })

      return response
    } catch (error) {
      throw new Error('Failed to place order')
    } finally {
      isOrderPlacing.value = false
    }
  }

  const getProductDetails = async (productIds: string[]) => {
    try {
      const products = await $fetch('/api/products') as any[]
      return productIds.map(id => products.find(p => p.id === id)).filter(Boolean)
    } catch (error) {
      console.error('Error fetching product details:', error)
      return []
    }
  }

  const sendMessage = async (content: string) => {
    console.log('📨 Sending message:', content)
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    }
    messages.value.push(userMessage)

    isLoading.value = true

    try {
      // Extract order from message
      addMessage("Let me check what you'd like to order...", false)
      
      console.log('🔍 Extracting order from message...')
      const orderRequest = await extractOrderFromMessage(content)
      console.log('📦 Order request result:', orderRequest)
      
      if (!orderRequest || !orderRequest.products || orderRequest.products.length === 0) {
        console.log('❌ No valid products found')
        addMessage(`I couldn't find any products in your message. Here are some examples:\n• "I want 2 apples and 1 banana"\n• "Please order 3 oranges"\n• "I need carrots and lettuce"`, false)
        return
      }

      // Get product details for confirmation
      const productIds = orderRequest.products.map(p => p.productId)
      const productDetails = await getProductDetails(productIds)
      
      // Create confirmation message
      let confirmationMessage = "I found these items in your order:\n\n"
      orderRequest.products.forEach((item, index) => {
        const product = productDetails.find(p => p.id === item.productId)
        if (product) {
          confirmationMessage += `• ${item.quantity} x ${product.name} - $${(product.price * item.quantity).toFixed(2)}\n`
        }
      })
      
      // Calculate total
      const total = orderRequest.products.reduce((sum, item) => {
        const product = productDetails.find(p => p.id === item.productId)
        return sum + (product?.price || 0) * item.quantity
      }, 0)
      
      confirmationMessage += `\n**Total: $${total.toFixed(2)}**\n\nShould I place this order?`

      addMessage(confirmationMessage, false)
      
      // For now, auto-confirm and place order
      // In a real app, you'd wait for user confirmation
      console.log('🛒 Placing order with products:', orderRequest.products)
      addMessage("Placing your order now...", false)
      
      const orderResult = await placeOrder(orderRequest)
      console.log('✅ Order placed successfully:', orderResult)
      
      // Success message with order details
      let successMessage = `✅ **Order Placed Successfully!**\n\n`
      successMessage += `**Order ID:** ${orderResult.id}\n`
      successMessage += `**Status:** ${orderResult.status}\n`
      successMessage += `**Total Amount:** $${orderResult.totalAmount}\n\n`
      successMessage += `**Items Ordered:**\n`
      
      orderResult.products.forEach((item: any) => {
        const product = productDetails.find(p => p.id === item.productId)
        if (product) {
          successMessage += `• ${item.quantity} x ${product.name} - $${item.price} each\n`
        }
      })
      
      successMessage += `\nThank you for your order! You'll receive a confirmation email shortly.`
      
      addMessage(successMessage, false)

    } catch (error) {
      console.error('❌ Order processing error:', error)
      addMessage("Sorry, I encountered an error while processing your order. Please try again in a moment.", false)
    } finally {
      isLoading.value = false
    }
  }

  const addMessage = (content: string, isUser: boolean = false) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date()
    }
    messages.value.push(message)
  }

  return {
    messages: readonly(messages),
    isLoading: readonly(isLoading),
    isOrderPlacing: readonly(isOrderPlacing),
    sendMessage
  }
}