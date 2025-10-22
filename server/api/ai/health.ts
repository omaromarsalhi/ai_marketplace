import { checkOllamaHealth, checkRequiredModels } from '~/server/utils/aiValidator'

export default defineEventHandler(async (event) => {
  try {
    // Get provider configuration
    const visionProvider = process.env.VISION_PROVIDER || 'gemini'
    const textProvider = process.env.TEXT_PROVIDER || 'ollama'
    
    // Check API keys
    const ollamaApiKey = process.env.OLLAMA_API_KEY
    const geminiApiKey = process.env.GEMINI_API_KEY
    const groqApiKey = process.env.GROQ_API_KEY
    
    // Provider status
    const providers = {
      ollama: {
        configured: !!ollamaApiKey,
        healthy: false,
        models: { vision: false, text: false }
      },
      gemini: {
        configured: !!geminiApiKey,
        healthy: !!geminiApiKey,
        models: { vision: true, text: true } // Gemini supports both
      },
      groq: {
        configured: !!groqApiKey,
        healthy: !!groqApiKey,
        models: { vision: true, text: true } // Groq supports both with appropriate models
      }
    }
    
    // Check Ollama health if configured
    if (ollamaApiKey) {
      try {
        providers.ollama.healthy = await checkOllamaHealth()
        if (providers.ollama.healthy) {
          const modelsStatus = await checkRequiredModels()
          providers.ollama.models = modelsStatus
        }
      } catch (error) {
        providers.ollama.healthy = false
      }
    }
    
    // Determine overall status based on active providers
    const visionProviderStatus = providers[visionProvider as keyof typeof providers]
    const textProviderStatus = providers[textProvider as keyof typeof providers]
    
    const visionAvailable = visionProviderStatus?.healthy && 
      (visionProvider === 'ollama' ? visionProviderStatus.models.vision : visionProviderStatus.models.vision)
    
    const textAvailable = textProviderStatus?.healthy && 
      (textProvider === 'ollama' ? textProviderStatus.models.text : textProviderStatus.models.text)
    
    const allAvailable = visionAvailable && textAvailable
    
    let message = '✅ AI services are ready!'
    if (!visionAvailable && !textAvailable) {
      message = `❌ Both vision (${visionProvider}) and text (${textProvider}) providers are unavailable`
    } else if (!visionAvailable) {
      message = `⚠️ Vision provider (${visionProvider}) is unavailable`
    } else if (!textAvailable) {
      message = `⚠️ Text provider (${textProvider}) is unavailable`
    }

    return {
      success: true,
      available: allAvailable,
      providers,
      activeProviders: {
        vision: visionProvider,
        text: textProvider
      },
      capabilities: {
        vision: visionAvailable,
        text: textAvailable
      },
      message
    }
  } catch (error: any) {
    return {
      success: false,
      available: false,
      message: `Error checking AI services: ${error.message}`,
      providers: {},
      activeProviders: {},
      capabilities: { vision: false, text: false }
    }
  }
})
