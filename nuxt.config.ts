export default defineNuxtConfig({
  devtools: { enabled: true },

  devServer: {
    port: 4540,
  },

  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css' },
      ],
      script: [
        { innerHTML: 'if(location.search.includes("notrace")){localStorage.setItem("umami.disabled","1");document.title="\\u2713 추적제외";setTimeout(function(){window.close()},1200)}' },
        { src: 'https://api.lawfirmy.com/umami/script.js', defer: true, 'data-website-id': 'e7b5a3b3-0bf4-48b4-b358-4ea686428a1b' },
      ],
    },
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // S3
    s3Bucket: process.env.S3_BUCKET || '',
    s3Region: process.env.S3_REGION || 'ap-northeast-2',
    s3AccessKey: process.env.S3_ACCESS_KEY || '',
    s3SecretKey: process.env.S3_SECRET_KEY || '',

    // Email (Resend)
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@pactery.com',

    // OAuth
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    kakaoClientId: process.env.KAKAO_CLIENT_ID || '',
    kakaoClientSecret: process.env.KAKAO_CLIENT_SECRET || '',

    // Claude AI
    claudeApiKey: process.env.CLAUDE_API_KEY || '',

    // NCloud SMS
    ncloudAccessKey: process.env.NCLOUD_ACCESS_KEY || '',
    ncloudSecretKey: process.env.NCLOUD_SECRET_KEY || '',
    ncloudSmsServiceId: process.env.NCLOUD_SMS_SERVICE_ID || '',
    ncloudSmsFrom: process.env.NCLOUD_SMS_FROM || '',

    // Cron
    cronSecret: process.env.CRON_SECRET || '',

    public: {
      appName: 'Pactery',
      appUrl: process.env.APP_URL || 'http://localhost:4540',
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      kakaoClientId: process.env.KAKAO_CLIENT_ID || '',
    },
  },

  nitro: {
    preset: 'node-server',
    serverAssets: [{
      baseName: 'fonts',
      dir: './server/assets/fonts',
    }],
  },

  compatibilityDate: '2026-04-26',
})
