<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md">
      <TransitionGroup 
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-to-class="translate-x-full opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-center gap-3 p-4 bg-white rounded-lg shadow-lg border-l-4 cursor-pointer hover:-translate-x-1 transition-transform',
            {
              'border-green-500': toast.type === 'success',
              'border-red-500': toast.type === 'error',
              'border-yellow-500': toast.type === 'warning',
              'border-blue-500': toast.type === 'info'
            }
          ]"
          @click="removeToast(toast.id)"
        >
          <div 
            :class="[
              'flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold flex-shrink-0',
              {
                'bg-green-100 text-green-600': toast.type === 'success',
                'bg-red-100 text-red-600': toast.type === 'error',
                'bg-yellow-100 text-yellow-600': toast.type === 'warning',
                'bg-blue-100 text-blue-600': toast.type === 'info'
              }
            ]"
          >
            <Icon v-if="toast.type === 'success'" name="mdi:check" class="w-4 h-4" />
            <Icon v-else-if="toast.type === 'error'" name="mdi:close" class="w-4 h-4" />
            <Icon v-else-if="toast.type === 'warning'" name="mdi:alert" class="w-4 h-4" />
            <Icon v-else name="mdi:information" class="w-4 h-4" />
          </div>
          <div class="flex-1 text-sm text-gray-700">{{ toast.message }}</div>
          <button 
            class="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            @click.stop="removeToast(toast.id)"
          >
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToast()
</script>
