import { validateProductWithAI } from '~/server/utils/aiValidator'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { imageUrl } = body

    if (!imageUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image URL is required'
      })
    }

    console.log('🎯 Auto-generating product content for image:', imageUrl)

    // Use AI to analyze the image and generate content
    const result = await generateProductContent(imageUrl)
    
    return {
      success: true,
      title: result.title,
      description: result.description,
      category: result.category,
      imageDescription: result.imageDescription
    }

  } catch (error: any) {
    console.error('❌ Error auto-generating content:', error.message)
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to generate product content'
    })
  }
})

/**
 * Generate product title, description, and category based on image analysis
 */
async function generateProductContent(imageUrl: string) {
  try {
    // First, get the image description using our existing AI validator
    const tempValidation = await validateProductWithAI('temp', 'temp', imageUrl)
    const imageDescription = tempValidation.imageDescription
    
    console.log('🖼️ Image analysis complete, generating product content...')
    
    // Now use the description to generate product content
    const productContent = await generateContentFromDescription(imageDescription)
    
    return {
      ...productContent,
      imageDescription
    }
    
  } catch (error: any) {
    throw new Error(`Failed to generate content: ${error.message}`)
  }
}

/**
 * Generate product content from image description using AI
 */
async function generateContentFromDescription(imageDescription: string) {
  // Get configuration
  const textProvider = process.env.TEXT_PROVIDER || 'ollama'
  const ollamaApiKey = process.env.OLLAMA_API_KEY
  const groqApiKey = process.env.GROQ_API_KEY
  
  const ollamaTextModel = process.env.OLLAMA_CLOUD_TEXT_MODEL || 'qwen2.5:3b'
  const groqTextModel = process.env.GROQ_TEXT_MODEL || 'llama3-8b-8192'
  
  const prompt = `You are a product content generator for an e-commerce marketplace. Based on the image description provided, generate attractive product information.

IMAGE DESCRIPTION:
${imageDescription}

TASK:
Generate a compelling product title, detailed description, and select the most appropriate category for this product.

Available categories:
- Beverages
- Fruits
- Vegetables  
- Dairy
- Meat
- Bread & Bakery
- Snacks
- Canned Goods
- Frozen Foods
- Health & Beauty
- Cleaning Supplies
- Pet Supplies
- Electronics
- Books
- Toys
- Clothing
- Home & Garden
- Sports & Outdoors
- Automotive
- Office Supplies
- Salad Mix

Guidelines:
- Title: 3-8 words, catchy and descriptive
- Description: 50-200 words, highlight key features and benefits
- Category: Choose the most fitting category from the list above
- Make it appealing to potential buyers
- Focus on quality, freshness, or unique features

Respond in this EXACT JSON format (no additional text):
{
  "title": "Product Title Here",
  "description": "Detailed product description here highlighting key features, quality, and benefits. Make it engaging and informative for potential customers.",
  "category": "Selected Category"
}`

  try {
    let response: string
    
    if (textProvider === 'groq') {
      console.log(`🚀 Generating content with Groq (${groqTextModel})...`)
      
      if (!groqApiKey) {
        throw new Error('Groq API key not configured')
      }

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: groqTextModel,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      if (!groqResponse.ok) {
        const errorData = await groqResponse.text()
        throw new Error(`Groq API error: ${groqResponse.status} - ${errorData}`)
      }

      const data = await groqResponse.json()
      response = data.choices[0].message.content
      
    } else {
      // Default to Ollama
      console.log(`🤖 Generating content with Ollama (${ollamaTextModel})...`)
      
      if (!ollamaApiKey) {
        throw new Error('Ollama API key not configured')
      }
      
      const { Ollama } = await import('ollama')
      
      const ollama = new Ollama({
        host: 'https://api.ollama.cloud',
        headers: {
          'Authorization': `Bearer ${ollamaApiKey}`
        }
      })
      
      const ollamaResponse = await ollama.generate({
        model: ollamaTextModel,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
        }
      })
      
      response = ollamaResponse.response
    }
    
    // Parse the AI response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid AI response format')
    }
    
    const result = JSON.parse(jsonMatch[0])
    
    // Validate the response
    if (!result.title || !result.description || !result.category) {
      throw new Error('Incomplete content generated')
    }
    
    console.log(`✅ Product content generated successfully with ${textProvider.toUpperCase()}`)
    return result
    
  } catch (error: any) {
    console.error('❌ Error generating content:', error.message)
    throw new Error(`Failed to generate content: ${error.message}`)
  }
}