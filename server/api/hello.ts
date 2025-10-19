// Example API endpoint
export default defineEventHandler((event) => {
  return {
    message: 'Hello from the API!',
    timestamp: new Date().toISOString()
  }
})
