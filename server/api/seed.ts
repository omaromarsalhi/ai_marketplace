import { writeData } from '../utils/storage'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  imageUrl: string
  createdAt: string
}

interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: 'admin' | 'user'
  createdAt: string
}

const sampleProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'AI Image Generator',
    description: 'Generate stunning images using advanced AI models',
    price: 29.99,
    category: 'AI Tools',
    stock: 100,
    imageUrl: '/images/ai-image-gen.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Text Analyzer Pro',
    description: 'Analyze and extract insights from text data',
    price: 19.99,
    category: 'AI Tools',
    stock: 150,
    imageUrl: '/images/text-analyzer.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Voice Assistant API',
    description: 'Add voice capabilities to your applications',
    price: 49.99,
    category: 'APIs',
    stock: 75,
    imageUrl: '/images/voice-api.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'ChatBot Builder',
    description: 'Build intelligent chatbots without coding',
    price: 39.99,
    category: 'AI Tools',
    stock: 200,
    imageUrl: '/images/chatbot.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'ML Model Trainer',
    description: 'Train custom machine learning models easily',
    price: 99.99,
    category: 'ML Tools',
    stock: 50,
    imageUrl: '/images/ml-trainer.jpg',
    createdAt: new Date().toISOString()
  }
]

const sampleUsers: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@aimarketplace.com',
    fullName: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-2',
    username: 'johndoe',
    email: 'john@example.com',
    fullName: 'John Doe',
    role: 'user',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-3',
    username: 'janedoe',
    email: 'jane@example.com',
    fullName: 'Jane Doe',
    role: 'user',
    createdAt: new Date().toISOString()
  }
]

export default defineEventHandler(async (event) => {
  try {
    // Seed products
    await writeData('products.json', sampleProducts)
    
    // Seed users
    await writeData('users.json', sampleUsers)
    
    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        products: sampleProducts.length,
        users: sampleUsers.length
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to seed database'
    })
  }
})
