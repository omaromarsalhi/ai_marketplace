import { checkOllamaHealth, checkRequiredModels } from '~/server/utils/aiValidator'

export default defineEventHandler(async (event) => {
  try {
    const isHealthy = await checkOllamaHealth()
    
    if (!isHealthy) {
      return {
        success: false,
        available: false,
        message: 'Ollama service is not available. Please ensure Ollama is running.',
        models: { vision: false, text: false }
      }
    }

    const modelsStatus = await checkRequiredModels()
    const allModelsAvailable = modelsStatus.vision && modelsStatus.text

    return {
      success: true,
      available: allModelsAvailable,
      models: modelsStatus,
      message: allModelsAvailable 
        ? '✅ AI validation is ready! All required models are installed.' 
        : modelsStatus.message
    }
  } catch (error: any) {
    return {
      success: false,
      available: false,
      message: `Error checking Ollama: ${error.message}`,
      models: { vision: false, text: false }
    }
  }
})
