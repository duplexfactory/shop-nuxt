import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  nitro: {
    preset: "cloudflare"
  },
  buildModules: [
    '@vueuse/core/nuxt',
    'nuxt-windicss',
  ],
  windicss: {
    analyze: true
  },
})
