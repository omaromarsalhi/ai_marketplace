<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrders } from '~/composables/useOrders'

const { orders, loading, error, fetchOrders } = useOrders()

// Search and filter states
const searchQuery = ref('')
const selectedStatus = ref('all')

// Filtered and searched orders
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Apply status filter
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }

  // Apply search filter
  if (searchQuery.value.trim() !== '') {
    filtered = filtered.filter(order =>
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

// Fetch orders on mount
onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Orders</h1>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div class="flex items-center gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Order ID or User ID"
          class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-green-300"
        />
      </div>
      <div class="flex items-center gap-2">
        <label for="statusFilter" class="text-sm font-medium text-gray-700">Filter by Status:</label>
        <select
          v-model="selectedStatus"
          id="statusFilter"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-green-300"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
      <p class="mt-2 text-gray-600">Loading orders...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <Icon name="mdi:alert" class="h-5 w-5 text-red-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
      <Icon name="mdi:shopping-outline" class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
    </div>

    <!-- Orders List -->
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-gray-900">Order #{{ order.id }}</h3>
            <p class="text-sm text-gray-500">
              {{ new Date(order.createdAt).toLocaleDateString() }}
            </p>
            <p class="text-xs text-gray-400 mt-1">User: {{ order.userId }}</p>
          </div>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="{
              'bg-yellow-100 text-yellow-800': order.status === 'pending',
              'bg-green-100 text-green-800': order.status === 'confirmed',
              'bg-blue-100 text-blue-800': order.status === 'shipped',
              'bg-gray-100 text-gray-800': order.status === 'delivered',
              'bg-red-100 text-red-800': order.status === 'cancelled'
            }"
          >
            {{ order.status }}
          </span>
        </div>

        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Products:</span>
            <span class="font-medium">{{ (order.products || []).length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total Amount:</span>
            <span class="font-semibold text-gray-900">${{ (order.totalAmount || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>