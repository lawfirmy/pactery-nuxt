<template>
  <div class="min-h-screen flex">
    <!-- Left: Brand Panel (hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 bg-brand-900 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-brand-950/50 to-transparent"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      <div class="relative flex flex-col justify-center px-12 xl:px-16 z-10">
        <NuxtLink to="/" class="text-3xl font-bold text-white mb-12 tracking-tight">Pactery</NuxtLink>
        <h2 class="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">
          전자서명,<br />
          <span class="text-brand-200">쉽고 빠르게</span>
        </h2>
        <p class="mt-6 text-brand-300 text-lg leading-relaxed max-w-md">
          계약서 업로드부터 서명 완료까지 3분.<br />
          법률사무소를 위한 전자서명 솔루션.
        </p>
        <div class="mt-12 space-y-4">
          <div class="flex items-center gap-3 text-brand-300">
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <span class="text-sm">전자서명법 준수 · PKI 디지털 서명</span>
          </div>
          <div class="flex items-center gap-3 text-brand-300">
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <span class="text-sm">감사추적인증서 자동 생성</span>
          </div>
          <div class="flex items-center gap-3 text-brand-300">
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <span class="text-sm">월 5건 무료 · 30초 만에 가입</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Auth Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-16 bg-white">
      <div class="mx-auto w-full max-w-sm">
        <NuxtLink to="/" class="flex lg:hidden justify-center mb-8">
          <span class="text-3xl font-bold text-brand-900 tracking-tight">Pactery</span>
        </NuxtLink>
        <slot />
      </div>
    </div>
    <ToastContainer />
  </div>
</template>
