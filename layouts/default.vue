<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-white font-bold text-2xl hover:text-green-100 transition-colors flex items-center gap-2">
              <Icon name="mdi:fruit-grapes" class="w-8 h-8" />
              <span>Fresh Market</span>
            </NuxtLink>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink 
              to="/" 
              class="text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
              active-class="bg-white/30"
            >
              <Icon name="mdi:home" class="inline w-5 h-5 mr-1" />
              Home
            </NuxtLink>
            <NuxtLink 
              to="/products" 
              class="text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
              active-class="bg-white/30"
            >
              <Icon name="mdi:food-apple" class="inline w-5 h-5 mr-1" />
              Products
            </NuxtLink>
            <NuxtLink 
              to="/products/manage" 
              class="text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
              active-class="bg-white/30"
            >
              <Icon name="mdi:cog" class="inline w-5 h-5 mr-1" />
              Manage
            </NuxtLink>
            <NuxtLink 
              to="/orders" 
              class="text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
              active-class="bg-white/30"
            >
              <Icon name="mdi:shopping" class="inline w-5 h-5 mr-1" />
              Orders
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
              active-class="bg-white/30"
            >
              <Icon name="mdi:information" class="inline w-5 h-5 mr-1" />
              About
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>
    
    <main class="flex-1 bg-gradient-to-br from-green-50 to-emerald-50">
      <slot />
      
      <!-- AI Order Chat Assistant -->
      <OrderChat />
    </main>
    
    <footer class="mt-16 bg-gradient-to-r from-gray-100 to-gray-200 border-t-4 border-green-500">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-600">
          &copy; 2025 Fresh Market - Fresh vegetables and fruits delivered daily
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>