<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="px-4 py-3 rounded-lg shadow-lg text-sm font-medium backdrop-blur-sm"
          :class="toastClass(toast.type)"
        >
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts } = useToast()

function toastClass(type: string) {
  switch (type) {
    case 'success': return 'bg-green-600 text-white'
    case 'error': return 'bg-red-600 text-white'
    default: return 'bg-gray-800 text-white'
  }
}
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(30px); }
.toast-leave-to { opacity: 0; transform: translateX(30px); }
</style>
