import fs from 'fs/promises'
import path from 'path'

/**
 * JSON Storage Utility
 * Simple file-based storage system using JSON files for Fresh Market
 */

const DATA_DIR = path.join(process.cwd(), 'server', 'data')

interface StorageOptions {
  pretty?: boolean
  backup?: boolean
}

/**
 * Ensure data directory exists
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR)
  } catch {
    console.log('Creating data directory:', DATA_DIR)
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

/**
 * Create backup of data file
 */
async function createBackup(filename: string): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, filename)
    const backupPath = path.join(DATA_DIR, `${filename}.backup.${Date.now()}`)
    await fs.copyFile(filePath, backupPath)
    
    // Keep only the 5 most recent backups
    const files = await fs.readdir(DATA_DIR)
    const backupFiles = files
      .filter(f => f.startsWith(`${filename}.backup.`))
      .sort()
      .reverse()
    
    for (let i = 5; i < backupFiles.length; i++) {
      const backupFile = backupFiles[i]
      if (backupFile) {
        await fs.unlink(path.join(DATA_DIR, backupFile))
      }
    }
  } catch (error) {
    console.warn('Failed to create backup:', error)
  }
}

/**
 * Read data from a JSON file
 */
export async function readData<T>(filename: string): Promise<T[]> {
  try {
    await ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)
    
    try {
      const data = await fs.readFile(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      
      if (!Array.isArray(parsed)) {
        console.warn(`Data in ${filename} is not an array, returning empty array`)
        return []
      }
      
      return parsed
    } catch (fileError: any) {
      if (fileError.code === 'ENOENT') {
        // File doesn't exist, create empty array
        console.log(`Creating new file: ${filename}`)
        await fs.writeFile(filePath, '[]', 'utf-8')
        return []
      }
      throw fileError
    }
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
  options: StorageOptions = { pretty: true, backup: true }
): Promise<boolean> {
  try {
    await ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)
    
    // Create backup if enabled and file exists
    if (options.backup) {
      try {
        await fs.access(filePath)
        await createBackup(filename)
      } catch {
        // File doesn't exist, no backup needed
      }
    }
    
    const jsonData = options.pretty
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data)
    
    await fs.writeFile(filePath, jsonData, 'utf-8')
    console.log(`Successfully wrote ${data.length} items to ${filename}`)
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
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 9)
  return `${timestamp}-${random}`
}

/**
 * Create a new item
 */
export async function createItem<T extends { id?: string | number }>(
  filename: string,
  item: Omit<T, 'id'>
): Promise<T> {
  try {
    const items = await readData<T>(filename)
    const newItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
    } as unknown as T
    
    items.push(newItem)
    const success = await writeData(filename, items)
    
    if (!success) {
      throw new Error('Failed to write data to file')
    }
    
    console.log(`Created new item with ID: ${newItem.id}`)
    return newItem
  } catch (error) {
    console.error('Error creating item:', error)
    throw error
  }
}

/**
 * Update an existing item
 */
export async function updateItem<T extends { id: string | number }>(
  filename: string,
  id: string | number,
  updates: Partial<T>
): Promise<T | null> {
  try {
    const items = await readData<T>(filename)
    const index = items.findIndex(item => item.id === id)
    
    if (index === -1) {
      console.warn(`Item with ID ${id} not found for update`)
      return null
    }
    
    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as unknown as T
    
    items[index] = updatedItem
    
    const success = await writeData(filename, items)
    if (!success) {
      throw new Error('Failed to write updated data to file')
    }
    
    console.log(`Updated item with ID: ${id}`)
    return updatedItem
  } catch (error) {
    console.error(`Error updating item ${id}:`, error)
    throw error
  }
}

/**
 * Delete an item
 */
export async function deleteItem<T extends { id: string | number }>(
  filename: string,
  id: string | number
): Promise<boolean> {
  try {
    const items = await readData<T>(filename)
    const filtered = items.filter(item => item.id !== id)
    
    if (filtered.length === items.length) {
      console.warn(`Item with ID ${id} not found for deletion`)
      return false // Item not found
    }
    
    const success = await writeData(filename, filtered)
    if (!success) {
      throw new Error('Failed to write data after deletion')
    }
    
    console.log(`Deleted item with ID: ${id}`)
    return true
  } catch (error) {
    console.error(`Error deleting item ${id}:`, error)
    throw error
  }
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
