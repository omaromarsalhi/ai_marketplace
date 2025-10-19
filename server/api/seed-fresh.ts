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

const freshMarketProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Fresh Red Apples',
    description: 'Crisp and sweet red apples, perfect for snacking and baking',
    price: 3.99,
    category: 'Fruits',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Organic Bananas',
    description: 'Ripe organic bananas, rich in potassium and natural sweetness',
    price: 2.49,
    category: 'Fruits',
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Fresh Orange Carrots',
    description: 'Sweet orange carrots, perfect for cooking, roasting, and raw snacking',
    price: 1.99,
    category: 'Vegetables',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Green Spinach Leaves',
    description: 'Fresh leafy spinach, packed with iron, vitamins, and nutrients',
    price: 2.99,
    category: 'Vegetables',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Ripe Red Tomatoes',
    description: 'Juicy red tomatoes, perfect for salads, cooking, and sandwiches',
    price: 4.49,
    category: 'Vegetables',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b5d?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Sweet Oranges',
    description: 'Fresh sweet oranges, high in vitamin C and bursting with flavor',
    price: 5.99,
    category: 'Fruits',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Colorful Bell Peppers',
    description: 'Mix of red, yellow, and green bell peppers, great for stir-fry and salads',
    price: 3.49,
    category: 'Vegetables',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Fresh Strawberries',
    description: 'Sweet red strawberries, perfect for desserts, smoothies, and snacking',
    price: 6.99,
    category: 'Fruits',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-9',
    name: 'Fresh Broccoli',
    description: 'Green broccoli crowns, packed with vitamins and perfect for steaming',
    price: 2.79,
    category: 'Vegetables',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-10',
    name: 'Organic Blueberries',
    description: 'Fresh organic blueberries, antioxidant-rich and naturally sweet',
    price: 8.99,
    category: 'Organic',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-11',
    name: 'Fresh Avocados',
    description: 'Ripe Hass avocados, perfect for guacamole, toast, and salads',
    price: 4.99,
    category: 'Fruits',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-12',
    name: 'Baby Potatoes',
    description: 'Small tender potatoes, ideal for roasting and boiling',
    price: 1.89,
    category: 'Vegetables',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString()
  }
]

const sampleUsers: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@freshmarket.com',
    fullName: 'Market Administrator',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-2',
    username: 'john_customer',
    email: 'john@example.com',
    fullName: 'John Smith',
    role: 'user',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-3',
    username: 'sarah_buyer',
    email: 'sarah@example.com',
    fullName: 'Sarah Johnson',
    role: 'user',
    createdAt: new Date().toISOString()
  }
]

// Seed database with sample data
export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    try {
      console.log('Seeding Fresh Market database...')
      
      // Write products data
      const productsSuccess = await writeData('products.json', freshMarketProducts)
      
      // Write users data
      const usersSuccess = await writeData('users.json', sampleUsers)
      
      if (productsSuccess && usersSuccess) {
        return {
          success: true,
          message: 'Fresh Market database seeded successfully',
          data: {
            products: freshMarketProducts.length,
            users: sampleUsers.length,
            categories: [...new Set(freshMarketProducts.map(p => p.category))]
          }
        }
      } else {
        throw new Error('Failed to write seed data')
      }
    } catch (error) {
      console.error('Seeding failed:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to seed database'
      })
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})