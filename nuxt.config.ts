// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // App configuration
  app: {
    head: {
      title: 'AI Marketplace',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI Marketplace - Your AI solutions platform' }
      ]
    }
  },

  // Server configuration
  nitro: {
    preset: 'node-server'
  },

  // Auto-import components
  components: true,

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available server-side)
    apiSecret: '',
    
    // Public keys (exposed to client)
    public: {
      apiBase: '/api'
    }
  }
})
