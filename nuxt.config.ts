export default defineNuxtConfig({
  devtools: { enabled: true },

  devServer: {
    port: 4540,
  },

  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // S3
    s3Bucket: process.env.S3_BUCKET || '',
    s3Region: process.env.S3_REGION || 'ap-northeast-2',
    s3AccessKey: process.env.S3_ACCESS_KEY || '',
    s3SecretKey: process.env.S3_SECRET_KEY || '',

    // Email (SES)
    sesRegion: process.env.SES_REGION || 'ap-northeast-2',
    sesFromEmail: process.env.SES_FROM_EMAIL || 'noreply@pactery.com',

    // OAuth
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    kakaoClientId: process.env.KAKAO_CLIENT_ID || '',
    kakaoClientSecret: process.env.KAKAO_CLIENT_SECRET || '',

    // Claude AI
    claudeApiKey: process.env.CLAUDE_API_KEY || '',

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
