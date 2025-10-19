import fs from 'fs/promises'
import path from 'path'

/**
 * JSON Storage Utility
 * Simple file-based storage system using JSON files
 */

const DATA_DIR = path.join(process.cwd(), 'server', 'data')

interface StorageOptions {
  pretty?: boolean
}

/**
 * Read data from a JSON file
 */
export async function readData<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_DIR, filename)
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return []
  }
}

/**
 * Write data to a JSON file
 */
export async function writeData<T>(
  filename: string,
  data: T[],
  options: StorageOptions = { pretty: true }
): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, filename)
    const jsonData = options.pretty
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data)
    
    await fs.writeFile(filePath, jsonData, 'utf-8')
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

/**
 * Find item by ID
 */
export function findById<T extends { id: string | number }>(
  items: T[],
  id: string | number
): T | undefined {
  return items.find(item => item.id === id)
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create a new item
 */
export async function createItem<T extends { id?: string | number }>(
  filename: string,
  item: Omit<T, 'id'>
): Promise<T> {
  const items = await readData<T>(filename)
  const newItem = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString(),
  } as unknown as T
  
  items.push(newItem)
  await writeData(filename, items)
  
  return newItem
}

/**
 * Update an existing item
 */
export async function updateItem<T extends { id: string | number }>(
  filename: string,
  id: string | number,
  updates: Partial<T>
): Promise<T | null> {
  const items = await readData<T>(filename)
  const index = items.findIndex(item => item.id === id)
  
  if (index === -1) {
    return null
  }
  
  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  await writeData(filename, items)
  return items[index]
}

/**
 * Delete an item
 */
export async function deleteItem<T extends { id: string | number }>(
  filename: string,
  id: string | number
): Promise<boolean> {
  const items = await readData<T>(filename)
  const filtered = items.filter(item => item.id !== id)
  
  if (filtered.length === items.length) {
    return false // Item not found
  }
  
  await writeData(filename, filtered)
  return true
}

/**
 * Query items with a filter function
 */
export async function queryItems<T>(
  filename: string,
  filterFn: (item: T) => boolean
): Promise<T[]> {
  const items = await readData<T>(filename)
  return items.filter(filterFn)
}
