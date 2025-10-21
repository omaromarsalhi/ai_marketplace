<template>
  <div v-if="product.validationStatus" class="mt-4 space-y-3">
    <!-- Status Badge -->
    <div class="flex items-center gap-3">
      <span class="text-sm font-medium text-gray-700">AI Validation:</span>
      <span
        :class="[
          'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold',
          getStatusStyle(product.validationStatus).class
        ]"
      >
        <Icon :name="getStatusStyle(product.validationStatus).icon" class="w-4 h-4" />
        {{ getStatusStyle(product.validationStatus).text }}
      </span>
    </div>

    <!-- Pending Animation -->
    <div v-if="product.validationStatus === 'pending'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <Icon name="mdi:robot" class="w-6 h-6 text-blue-600 animate-pulse flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-blue-900 mb-1">AI Analysis in Progress</h4>
          <p class="text-xs text-blue-700 mb-3">
            Our AI is analyzing your product image and verifying the information. This usually takes 10-30 seconds.
          </p>
          <div class="relative h-2 bg-blue-100 rounded-full overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse-slow"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approved Status -->
    <div v-else-if="product.validationStatus === 'approved' && product.validationResult" 
         class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <Icon name="mdi:check-circle" class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-green-900 mb-1">
            Product Approved - Score: {{ product.validationResult.score }}/100
          </h4>
          <p class="text-xs text-green-700 mb-2">{{ product.validationResult.reasoning }}</p>
          
          <details class="mt-2">
            <summary class="text-xs font-medium text-green-800 cursor-pointer hover:text-green-900 select-none">
              View AI Analysis Details
            </summary>
            <div class="mt-2 pt-2 border-t border-green-200 space-y-2">
              <div>
                <p class="text-xs font-medium text-green-900 mb-1">Image Description:</p>
                <p class="text-xs text-green-700 bg-green-100 rounded p-2">
                  {{ product.validationResult.imageDescription }}
                </p>
              </div>
              <div v-if="product.validationResult.issues.length > 0">
                <p class="text-xs font-medium text-green-900 mb-1">Minor Notes:</p>
                <ul class="list-disc list-inside text-xs text-green-700 space-y-1">
                  <li v-for="(issue, idx) in product.validationResult.issues" :key="idx">{{ issue }}</li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>

    <!-- Rejected Status -->
    <div v-else-if="product.validationStatus === 'rejected' && product.validationResult" 
         class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <Icon name="mdi:alert-circle" class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-red-900 mb-1">
            Product Rejected - Score: {{ product.validationResult.score }}/100
          </h4>
          <p class="text-xs text-red-700 mb-3">{{ product.validationResult.reasoning }}</p>
          
          <div v-if="product.validationResult.issues.length > 0" class="space-y-2">
            <p class="text-xs font-medium text-red-900">Issues Found:</p>
            <ul class="space-y-1.5">
              <li v-for="(issue, idx) in product.validationResult.issues" 
                  :key="idx"
                  class="flex items-start gap-2 text-xs text-red-700">
                <Icon name="mdi:close-circle" class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{{ issue }}</span>
              </li>
            </ul>
          </div>

          <details class="mt-3">
            <summary class="text-xs font-medium text-red-800 cursor-pointer hover:text-red-900 select-none">
              View AI Image Analysis
            </summary>
            <div class="mt-2 pt-2 border-t border-red-200">
              <p class="text-xs font-medium text-red-900 mb-1">What AI Saw in the Image:</p>
              <p class="text-xs text-red-700 bg-red-100 rounded p-2">
                {{ product.validationResult.imageDescription }}
              </p>
            </div>
          </details>

          <div class="mt-3 pt-3 border-t border-red-200">
            <p class="text-xs font-medium text-red-900 mb-2">Recommended Actions:</p>
            <ul class="text-xs text-red-700 space-y-1 list-disc list-inside">
              <li>Update the product title or description to match the image</li>
              <li>Upload a different image that better represents the product</li>
              <li>Ensure the image clearly shows the product</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

interface Props {
  product: Product | any
}

defineProps<Props>()

const statusStyles = {
  pending: {
    text: 'Validating...',
    icon: 'mdi:clock-outline',
    class: 'bg-blue-100 text-blue-700 border border-blue-300'
  },
  approved: {
    text: 'Approved',
    icon: 'mdi:check-circle',
    class: 'bg-green-100 text-green-700 border border-green-300'
  },
  rejected: {
    text: 'Rejected',
    icon: 'mdi:close-circle',
    class: 'bg-red-100 text-red-700 border border-red-300'
  }
}

const getStatusStyle = (status: string) => {
  return statusStyles[status as keyof typeof statusStyles] || statusStyles.pending
}
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
