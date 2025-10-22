import type { Order } from '~/types/order'

export const useOrders = () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchOrders = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ orders: Order[] }>('/api/orders')
      orders.value = response.orders
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch orders'
      orders.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    orders: readonly(orders),
    loading: readonly(loading),
    error: readonly(error),
    fetchOrders
  }
}