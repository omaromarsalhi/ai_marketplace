// server/api/chat/order.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { readData } from '~/server/utils/storage'

const PRODUCTS_FILE = 'products.json'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)
    const { message } = body

    console.log('📝 Received message:', message)

    if (!message) {
      throw createError({
        statusCode: 400,
        message: 'Message is required'
      })
    }

    const config = useRuntimeConfig()
    
    console.log('🔑 Gemini Key in server:', config.geminiApiKey ? '✅ Loaded' : '❌ Missing')
    
    if (!config.geminiApiKey) {
      throw createError({
        statusCode: 500,
        message: 'Gemini API key not configured'
      })
    }

    // Read products from products.json
    const productsData = await readData<any>(PRODUCTS_FILE)
    const products = Array.isArray(productsData) ? productsData : []

    console.log('📦 Loaded products:', products.length)

    // Filter only approved products
    const approvedProducts = products.filter((p: any) => p.validationStatus === 'approved')
    
    // Create product mapping for the prompt
    const productList = approvedProducts.map((product: any) => 
      `- ${product.name}: ${product.id}`
    ).join('\n')

    console.log('🤖 Creating Gemini client...')
    const genAI = new GoogleGenerativeAI(config.geminiApiKey)
    
    // Use the correct model name - try different options
    let model
    try {
      // Try the newer model first
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    } catch (modelError) {
      console.log('⚠️ gemini-2.5-flash-lite not available, trying gemini-pro...')
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      } catch (secondError) {
        console.log('⚠️ gemini-pro not available, trying default...')
        model = genAI.getGenerativeModel({ model: 'models/gemini-pro' })
      }
    }

    const prompt = `You are an order extraction assistant. Extract product orders from user messages and return ONLY a JSON object in this exact format:
    {
      "products": [
        {"productId": "1", "quantity": 2},
        {"productId": "2", "quantity": 1}
      ],
      "userId": "user_001"
    }
    
    Available products and their IDs:
    ${productList}
    
    Rules:
    - If user mentions product names, map them to the correct product ID from the list above
    - If quantity is not specified, default to 1
    - Use "user_001" as default userId
    - Return ONLY the JSON, no other text
    - If no valid products found, return: {"products": [], "userId": "user_001"}
    
    User message: "${message}"`

    console.log('🚀 Calling Gemini API...')
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    console.log('✅ Gemini response:', text)

    // Clean the response
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
    
    try {
      const parsedResponse = JSON.parse(cleanText)
      console.log('📦 Parsed response:', parsedResponse)
      
      // Validate that the product IDs actually exist
      if (parsedResponse.products && Array.isArray(parsedResponse.products)) {
        parsedResponse.products = parsedResponse.products.filter((item: any) => {
          const productExists = approvedProducts.some((p: any) => p.id === item.productId)
          if (!productExists) {
            console.log(`❌ Filtered out non-existent product ID: ${item.productId}`)
          }
          return productExists
        })
      }
      
      return { 
        success: true, 
        data: parsedResponse 
      }
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError)
      console.error('❌ Raw response that failed to parse:', cleanText)
      
      // Try to extract JSON from the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0])
          console.log('✅ Extracted JSON:', extractedJson)
          return { 
            success: true, 
            data: extractedJson 
          }
        } catch (e) {
          console.error('❌ Could not extract JSON')
        }
      }
      
      return { 
        success: true, 
        data: { products: [], userId: "user_001" } 
      }
    }

  } catch (error: any) {
    console.error('❌ Gemini API error:')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Full error:', error)
    
    // Handle specific Gemini errors
    if (error.message?.includes('API key not valid') || error.message?.includes('401')) {
      throw createError({
        statusCode: 500,
        message: 'Gemini API key is invalid or unauthorized'
      })
    } else if (error.message?.includes('quota')) {
      throw createError({
        statusCode: 500,
        message: 'Gemini API quota exceeded'
      })
    } else if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw createError({
        statusCode: 500,
        message: 'Gemini model not found. Please check the model name and API version.'
      })
    }
    
    throw createError({
      statusCode: 500,
      message: `Gemini API error: ${error.message}`
    })
  }
})