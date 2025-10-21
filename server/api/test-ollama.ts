import { Ollama } from 'ollama'

export default defineEventHandler(async (event) => {
  try {
    const ollamaApiKey = process.env.OLLAMA_API_KEY
    
    if (!ollamaApiKey) {
      return {
        success: false,
        error: 'OLLAMA_API_KEY not configured'
      }
    }

    // Initialize Ollama Cloud client
    const ollama = new Ollama({
      host: 'https://api.ollama.cloud',
      headers: {
        'Authorization': `Bearer ${ollamaApiKey}`
      }
    })

    // Test 1: List available models
    console.log('📋 Testing Ollama Cloud - Listing models...')
    let availableModels = []
    try {
      const modelsList = await ollama.list()
      availableModels = modelsList.models.map((m: any) => m.name)
      console.log('✅ Available models:', availableModels)
    } catch (error: any) {
      console.error('❌ Failed to list models:', error.message)
      return {
        success: false,
        error: 'Failed to list models',
        details: error.message,
        suggestion: 'Check if your OLLAMA_API_KEY is valid'
      }
    }

    // Test 2: Try to generate with a simple model
    console.log('🧪 Testing model generation...')
    let testResult = null
    const modelsToTry = ['llama3.3', 'llama3.1', 'llama3', 'gemma2']
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`)
        const response = await ollama.generate({
          model: modelName,
          prompt: 'Say "Hello" in one word.',
          stream: false
        })
        testResult = {
          model: modelName,
          response: response.response,
          success: true
        }
        console.log(`✅ ${modelName} works!`)
        break
      } catch (error: any) {
        console.log(`❌ ${modelName} failed: ${error.message}`)
        continue
      }
    }

    return {
      success: true,
      apiKeyConfigured: true,
      availableModels,
      testResult,
      message: testResult 
        ? `Successfully tested Ollama Cloud with model: ${testResult.model}` 
        : 'Failed to test any model'
    }

  } catch (error: any) {
    console.error('❌ Test failed:', error)
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})
