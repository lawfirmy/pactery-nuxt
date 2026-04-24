<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <span class="text-lg font-semibold text-blue-600">Pactery</span>
        <span class="text-sm text-gray-500">전자서명</span>
      </div>
    </nav>
    <main class="max-w-4xl mx-auto py-6 px-4">
      <slot />
    </main>
  </div>
</template>
