<!-- components/OrderChat.vue -->
<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Toggle Button -->
    <button
      @click="toggleChat"
      class="w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
    >
      <Icon 
        :name="isOpen ? 'mdi:close' : 'mdi:chat'" 
        class="w-6 h-6" 
      />
    </button>

    <!-- Chat Window -->
    <div
      v-if="isOpen"
      class="absolute bottom-16 right-0 w-80 sm:w-96 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col"
    >
      <!-- Header -->
      <div class="bg-green-600 text-white p-4 rounded-t-xl">
        <h3 class="font-semibold flex items-center gap-2">
          <Icon name="mdi:robot-happy" class="w-5 h-5" />
          Shopping Assistant
        </h3>
      </div>

      <!-- Messages -->
      <div class="flex-1 p-4 overflow-y-auto space-y-4">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex',
            message.isUser ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-[80%] rounded-2xl p-3',
              message.isUser 
                ? 'bg-green-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            ]"
          >
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            <p class="text-xs opacity-70 mt-1">
              {{ message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </p>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-gray-100 rounded-2xl rounded-bl-none p-3">
            <div class="flex space-x-2">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex space-x-2">
          <input
            v-model="inputMessage"
            @keypress.enter="handleSend"
            type="text"
            placeholder="Type your order..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            :disabled="isLoading"
          />
          <button
            @click="handleSend"
            :disabled="!inputMessage.trim() || isLoading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="mdi:send" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const inputMessage = ref('')

const { messages, isLoading, sendMessage } = useOrderChat()

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const handleSend = async () => {
  if (!inputMessage.value.trim() || isLoading.value) {
    return
  }

  const message = inputMessage.value
  inputMessage.value = ''

  try {
    await sendMessage(message)
  } catch (error) {
    console.error('Send failed:', error)
  }
}
</script>