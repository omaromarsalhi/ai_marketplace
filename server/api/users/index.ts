import { readData, createItem } from '~/server/utils/storage'

interface User {
  id?: string
  username: string
  email: string
  fullName: string
  role: 'admin' | 'user'
  createdAt?: string
  updatedAt?: string
}

export default defineEventHandler(async (event) => {
  const method = event.method

  // GET - Read all users
  if (method === 'GET') {
    const users = await readData<User>('users.json')
    
    // Remove sensitive data if needed
    const sanitizedUsers = users.map(({ ...user }) => user)
    
    return {
      success: true,
      data: sanitizedUsers,
      count: sanitizedUsers.length
    }
  }

  // POST - Create new user
  if (method === 'POST') {
    const body = await readBody<Omit<User, 'id'>>(event)
    
    // Basic validation
    if (!body.email || !body.username) {
      throw createError({
        statusCode: 400,
        message: 'Email and username are required'
      })
    }

    // Check if email already exists
    const users = await readData<User>('users.json')
    const existingUser = users.find(u => u.email === body.email)
    
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'User with this email already exists'
      })
    }

    const newUser = await createItem<User>('users.json', {
      ...body,
      role: body.role || 'user'
    })
    
    return {
      success: true,
      data: newUser,
      message: 'User created successfully'
    }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
