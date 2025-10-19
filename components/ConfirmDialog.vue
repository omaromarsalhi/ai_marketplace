<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" @click.self="onCancel">
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="scale-90 opacity-0"
          leave-active-class="transition-all duration-300"
          leave-to-class="scale-90 opacity-0"
        >
          <div class="bg-white rounded-xl max-w-md w-full shadow-2xl" v-if="show">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
              <button 
                class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                @click="onCancel"
              >
                <Icon name="mdi:close" class="w-6 h-6" />
              </button>
            </div>
            
            <div class="p-6">
              <p class="text-gray-600 leading-relaxed">{{ message }}</p>
            </div>
            
            <div class="flex gap-3 justify-end p-6 border-t border-gray-200">
              <button 
                class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                @click="onCancel"
              >
                {{ cancelText }}
              </button>
              <button 
                :class="[
                  'px-5 py-2.5 font-medium rounded-lg transition-colors',
                  type === 'danger' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                ]"
                @click="onConfirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'default' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'default'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}

// Close on Escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    onCancel()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>
