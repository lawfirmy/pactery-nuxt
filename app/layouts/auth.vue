<template>
  <div class="min-h-screen flex">
    <!-- Left: Brand Panel (hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4UzAgOC4wNiAwIDE4IDE4IDM2IDE4IDM2IDI4LjA2IDM2IDM2IDE4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div class="relative flex flex-col justify-center px-12 xl:px-16">
        <NuxtLink to="/" class="text-3xl font-bold text-white mb-12">Pactery</NuxtLink>
        <h2 class="text-3xl xl:text-4xl font-bold text-white leading-tight">
          전자서명,<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-indigo-300">쉽고 빠르게</span>
        </h2>
        <p class="mt-6 text-brand-200/80 text-lg leading-relaxed max-w-md">
          계약서 업로드부터 서명 완료까지 3분.<br />
          법률사무소를 위한 전자서명 솔루션.
        </p>
        <div class="mt-12 space-y-4">
          <div class="flex items-center gap-3 text-brand-200/70">
            <svg class="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <span class="text-sm">전자서명법 준수 &middot; PKI 디지털 서명</span>
          </div>
          <div class="flex items-center gap-3 text-brand-200/70">
            <svg class="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <span class="text-sm">감사추적인증서 자동 생성</span>
          </div>
          <div class="flex items-center gap-3 text-brand-200/70">
            <svg class="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <span class="text-sm">월 5건 무료 &middot; 30초 만에 가입</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Auth Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-16 bg-white">
      <div class="mx-auto w-full max-w-sm">
        <NuxtLink to="/" class="flex lg:hidden justify-center mb-8">
          <span class="text-3xl font-bold text-brand-600">Pactery</span>
        </NuxtLink>
        <slot />
      </div>
    </div>
    <ToastContainer />
  </div>
</template>
