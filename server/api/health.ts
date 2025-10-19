import { readData } from '~/server/utils/storage'
import fs from 'fs/promises'
import path from 'path'

interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  database: {
    status: 'connected' | 'error'
    products: number
    users: number
  }
  storage: {
    dataDirectory: string
    writable: boolean
    backups: number
  }
  uptime: number
}

// Health check endpoint
export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    try {
      const startTime = Date.now()
      const dataDir = path.join(process.cwd(), 'server', 'data')
      
      // Check if data directory is accessible and writable
      let storageWritable = false
      let backupCount = 0
      
      try {
        await fs.access(dataDir, fs.constants.W_OK)
        storageWritable = true
        
        // Count backup files
        const files = await fs.readdir(dataDir)
        backupCount = files.filter(f => f.includes('.backup.')).length
      } catch (error) {
        console.error('Storage check failed:', error)
      }
      
      // Check database by reading data files
      let databaseStatus: 'connected' | 'error' = 'connected'
      let productCount = 0
      let userCount = 0
      
      try {
        const products = await readData('products.json')
        productCount = products.length
        
        const users = await readData('users.json')
        userCount = users.length
      } catch (error) {
        console.error('Database check failed:', error)
        databaseStatus = 'error'
      }
      
      const processingTime = Date.now() - startTime
      const uptime = process.uptime()
      
      const healthStatus: HealthStatus = {
        status: (storageWritable && databaseStatus === 'connected') ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: {
          status: databaseStatus,
          products: productCount,
          users: userCount
        },
        storage: {
          dataDirectory: dataDir,
          writable: storageWritable,
          backups: backupCount
        },
        uptime: Math.round(uptime)
      }

      return {
        success: true,
        data: healthStatus,
        processingTime: `${processingTime}ms`,
        message: `System is ${healthStatus.status}`
      }
    } catch (error) {
      console.error('Health check failed:', error)
      
      return {
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Health check failed'
        },
        message: 'System health check failed'
      }
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})