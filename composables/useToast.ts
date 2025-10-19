/**
 * Toast Notification Composable
 * Manages toast notifications for user feedback
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const toast: Toast = {
      id,
      type,
      message,
      duration
    }
    
    toasts.value.push(toast)
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }
  
  const success = (message: string, duration?: number) => {
    return showToast(message, 'success', duration)
  }
  
  const error = (message: string, duration?: number) => {
    return showToast(message, 'error', duration)
  }
  
  const warning = (message: string, duration?: number) => {
    return showToast(message, 'warning', duration)
  }
  
  const info = (message: string, duration?: number) => {
    return showToast(message, 'info', duration)
  }
  
  const clear = () => {
    toasts.value = []
  }
  
  return {
    toasts: readonly(toasts),
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clear
  }
}
