# JSON Storage System - Documentation

## Overview

This project uses a simple, lightweight JSON file-based storage system instead of a traditional database. This approach is perfect for rapid prototyping, small applications, and scenarios where database complexity is unnecessary.

## 📁 File Structure

```
server/
├── data/                    # JSON data files
│   ├── products.json       # Products data
│   ├── users.json          # Users data
│   └── orders.json         # Orders data
├── utils/
│   └── storage.ts          # Storage utility functions
└── api/
    ├── seed.ts             # Seed sample data
    ├── products/
    │   ├── index.ts        # GET all, POST new product
    │   └── [id].ts         # GET, PUT, DELETE single product
    └── users/
        └── index.ts        # GET all, POST new user
```

## 🔧 Storage Utility Functions

Located in `server/utils/storage.ts`:

### Core Functions

#### `readData<T>(filename: string): Promise<T[]>`
Read all items from a JSON file.

```typescript
const products = await readData<Product>('products.json')
```

#### `writeData<T>(filename: string, data: T[], options?: StorageOptions): Promise<boolean>`
Write data to a JSON file.

```typescript
await writeData('products.json', products, { pretty: true })
```

#### `createItem<T>(filename: string, item: Omit<T, 'id'>): Promise<T>`
Create a new item with auto-generated ID and timestamp.

```typescript
const newProduct = await createItem<Product>('products.json', {
  name: 'AI Tool',
  price: 29.99,
  category: 'AI Tools',
  stock: 100
})
```

#### `updateItem<T>(filename: string, id: string | number, updates: Partial<T>): Promise<T | null>`
Update an existing item by ID.

```typescript
const updated = await updateItem<Product>('products.json', 'prod-1', {
  price: 39.99,
  stock: 95
})
```

#### `deleteItem<T>(filename: string, id: string | number): Promise<boolean>`
Delete an item by ID.

```typescript
const deleted = await deleteItem<Product>('products.json', 'prod-1')
```

#### `queryItems<T>(filename: string, filterFn: (item: T) => boolean): Promise<T[]>`
Query items with a custom filter function.

```typescript
const aiTools = await queryItems<Product>('products.json', 
  product => product.category === 'AI Tools'
)
```

### Helper Functions

#### `generateId(): string`
Generate a unique ID (timestamp + random string).

```typescript
const id = generateId() // "1729350000000-abc123def"
```

#### `findById<T>(items: T[], id: string | number): T | undefined`
Find an item by ID in an array.

```typescript
const product = findById(products, 'prod-1')
```

## 🚀 API Endpoints

### Products API

#### Get All Products
```http
GET /api/products
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-1",
      "name": "AI Image Generator",
      "description": "Generate stunning images",
      "price": 29.99,
      "category": "AI Tools",
      "stock": 100,
      "createdAt": "2025-10-19T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "New AI Tool",
  "description": "Description here",
  "price": 49.99,
  "category": "AI Tools",
  "stock": 50
}
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Update Product
```http
PUT /api/products/:id
Content-Type: application/json

{
  "price": 39.99,
  "stock": 75
}
```

#### Delete Product
```http
DELETE /api/products/:id
```

### Users API

#### Get All Users
```http
GET /api/users
```

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "user"
}
```

### Seed Data
```http
GET /api/seed
```

Populates the database with sample products and users.

## 💡 Usage Examples

### Creating a New API Endpoint

1. Create a new API file in `server/api/`:

```typescript
// server/api/categories/index.ts
import { readData, createItem } from '~/server/utils/storage'

interface Category {
  id?: string
  name: string
  description: string
}

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const categories = await readData<Category>('categories.json')
    return { success: true, data: categories }
  }

  if (method === 'POST') {
    const body = await readBody<Omit<Category, 'id'>>(event)
    const newCategory = await createItem<Category>('categories.json', body)
    return { success: true, data: newCategory }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
```

2. Create the JSON file:

```bash
echo [] > server/data/categories.json
```

### Using in Frontend

```vue
<script setup>
// Fetch products
const { data: products } = await useFetch('/api/products')

// Create a new product
const createProduct = async () => {
  const newProduct = await $fetch('/api/products', {
    method: 'POST',
    body: {
      name: 'Test Product',
      price: 19.99,
      category: 'Test',
      stock: 10
    }
  })
  console.log(newProduct)
}

// Update a product
const updateProduct = async (id) => {
  await $fetch(`/api/products/${id}`, {
    method: 'PUT',
    body: { price: 24.99 }
  })
}

// Delete a product
const deleteProduct = async (id) => {
  await $fetch(`/api/products/${id}`, {
    method: 'DELETE'
  })
}
</script>
```

## ✅ Advantages

1. **No Database Setup** - Works immediately without installation
2. **Easy to Debug** - JSON files are human-readable
3. **Version Control Friendly** - Track data changes in Git
4. **Zero Configuration** - No connection strings or migrations
5. **Fast Prototyping** - Get started in seconds
6. **Portable** - Copy files to deploy

## ⚠️ Limitations

1. **Not for Production** - Not suitable for large-scale applications
2. **No Concurrency Control** - Multiple writes can cause conflicts
3. **Performance** - Entire file loaded into memory
4. **No Transactions** - No ACID guarantees
5. **Limited Queries** - No complex joins or aggregations
6. **Scalability** - Not designed for thousands of records

## 🔄 Migration Path

When you're ready to move to a real database:

### Option 1: SQLite
```bash
npm install better-sqlite3
```

### Option 2: PostgreSQL
```bash
npm install pg
npm install drizzle-orm
```

### Option 3: MongoDB
```bash
npm install mongodb
```

### Option 4: Prisma (Universal)
```bash
npm install prisma @prisma/client
npx prisma init
```

## 📊 Best Practices

1. **Keep Files Small** - Aim for < 1000 records per file
2. **Use Meaningful Filenames** - `users.json`, not `data1.json`
3. **Add TypeScript Interfaces** - Type safety for all data
4. **Backup Regularly** - JSON files can be easily backed up
5. **Consider .gitignore** - Exclude sensitive data files
6. **Validate Input** - Always validate before writing
7. **Error Handling** - Wrap operations in try-catch

## 🔒 Security Considerations

1. **Sensitive Data** - Don't store passwords in plain JSON
2. **File Permissions** - Ensure proper file system permissions
3. **Input Validation** - Sanitize all user inputs
4. **Rate Limiting** - Add rate limiting to write operations
5. **Backup Strategy** - Regular backups of JSON files

## 📝 Example: Complete CRUD Flow

```typescript
// 1. Read all items
const products = await readData<Product>('products.json')

// 2. Create new item
const newProduct = await createItem<Product>('products.json', {
  name: 'AI Tool',
  price: 29.99
})

// 3. Update item
const updated = await updateItem<Product>('products.json', newProduct.id, {
  price: 39.99
})

// 4. Query items
const expensive = await queryItems<Product>('products.json',
  p => p.price > 30
)

// 5. Delete item
await deleteItem<Product>('products.json', newProduct.id)
```

## 🚀 Getting Started

1. **Create a data file:**
```bash
echo [] > server/data/mydata.json
```

2. **Use storage utilities in your API:**
```typescript
import { readData, createItem } from '~/server/utils/storage'
```

3. **Access from frontend:**
```typescript
const data = await $fetch('/api/myendpoint')
```

That's it! You're ready to build with JSON storage.

## 📚 Resources

- [Nuxt Server Directory](https://nuxt.com/docs/guide/directory-structure/server)
- [H3 Event Handlers](https://h3.unjs.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Remember**: This is perfect for prototyping and small projects. For production apps with many users, consider migrating to a proper database.
