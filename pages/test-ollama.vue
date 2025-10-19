<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Ollama Cloud Test</h1>
    
    <button
      @click="testOllama"
      :disabled="loading"
      class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
    >
      {{ loading ? 'Testing...' : 'Test Ollama Cloud Connection' }}
    </button>

    <div v-if="result" class="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <h2 class="text-xl font-semibold mb-2">Test Results</h2>
        <div :class="result.success ? 'text-green-600' : 'text-red-600'">
          {{ result.success ? '✅ Success' : '❌ Failed' }}
        </div>
      </div>

      <div v-if="result.error" class="bg-red-50 border border-red-200 rounded p-4">
        <h3 class="font-semibold text-red-800">Error:</h3>
        <p class="text-red-700">{{ result.error }}</p>
        <p v-if="result.details" class="text-sm text-red-600 mt-2">{{ result.details }}</p>
        <p v-if="result.suggestion" class="text-sm text-red-600 mt-2 font-medium">{{ result.suggestion }}</p>
      </div>

      <div v-if="result.availableModels">
        <h3 class="font-semibold mb-2">Available Models:</h3>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="model in result.availableModels" :key="model" class="text-gray-700">
            {{ model }}
          </li>
        </ul>
        <p v-if="result.availableModels.length === 0" class="text-gray-500 italic">
          No models found. You may need to pull models first.
        </p>
      </div>

      <div v-if="result.testResult" class="bg-green-50 border border-green-200 rounded p-4">
        <h3 class="font-semibold text-green-800">Test Generation:</h3>
        <p class="text-sm text-gray-600">Model: <strong>{{ result.testResult.model }}</strong></p>
        <p class="text-gray-700 mt-2">Response: {{ result.testResult.response }}</p>
      </div>

      <div v-if="result.message" class="text-gray-600">
        {{ result.message }}
      </div>

      <details class="mt-4">
        <summary class="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          View Raw Response
        </summary>
        <pre class="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">{{ JSON.stringify(result, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)
const result = ref<any>(null)

const testOllama = async () => {
  loading.value = true
  result.value = null
  
  try {
    const response = await $fetch('/api/test-ollama')
    result.value = response
  } catch (error: any) {
    result.value = {
      success: false,
      error: 'Failed to connect to test endpoint',
      details: error.message
    }
  } finally {
    loading.value = false
  }
}
</script>
