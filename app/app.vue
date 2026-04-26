<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appUrl = config.public.appUrl || 'https://pactery.com'
const route = useRoute()

useHead({
  htmlAttrs: { lang: 'ko' },
  link: [
    {
      rel: 'canonical',
      href: computed(() => `${appUrl}${route.path}`),
    },
  ],
})

useSeoMeta({
  ogSiteName: 'Pactery',
  ogType: 'website',
  ogLocale: 'ko_KR',
  twitterCard: 'summary_large_image',
})
</script>
