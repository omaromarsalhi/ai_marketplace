<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userId = ref('')
const products = ref([{ productId: '', quantity: 1, price: 0 }])
const status = ref('pending')

const addProduct = () => {
  products.value.push({ productId: '', quantity: 1, price: 0 })
}

const removeProduct = (index: number) => {
  products.value.splice(index, 1)
}

const createOrder = async () => {
  const totalAmount = products.value.reduce((sum, product) => sum + product.quantity * product.price, 0)

  try {
    await $fetch('/api/orders', {
      method: 'POST',
      body: {
        userId: userId.value,
        products: products.value,
        totalAmount,
        status: status.value
      }
    })
    router.push('/orders')
  } catch (error) {
    console.error('Failed to create order:', error)
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold mb-6">Create Order</h1>

    <div class="space-y-4">
      <div>
        <label for="userId" class="block text-sm font-medium text-gray-700">User ID</label>
        <input v-model="userId" id="userId" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Products</label>
        <div v-for="(product, index) in products" :key="index" class="space-y-2">
          <div class="flex items-center space-x-4">
            <input v-model="product.productId" placeholder="Product ID" class="block w-full border-gray-300 rounded-md shadow-sm" />
            <input v-model.number="product.quantity" type="number" placeholder="Quantity" class="block w-20 border-gray-300 rounded-md shadow-sm" />
            <input v-model.number="product.price" type="number" placeholder="Price" class="block w-24 border-gray-300 rounded-md shadow-sm" />
            <button @click="removeProduct(index)" type="button" class="text-red-500 hover:text-red-700">Remove</button>
          </div>
        </div>
        <button @click="addProduct" type="button" class="mt-2 text-green-500 hover:text-green-700">Add Product</button>
      </div>

      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select v-model="status" id="status" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <button @click="createOrder" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Create Order</button>
    </div>
  </div>
</template>