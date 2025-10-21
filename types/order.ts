export interface Order {
  id: string
  userId: string
  products: Array<{
    productId: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface OrderData {
  orders: Order[]
}

export interface CreateOrder {
  userId: string
  products: Array<{
    productId: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
}