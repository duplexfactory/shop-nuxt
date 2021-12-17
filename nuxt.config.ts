import { defineNuxtConfig } from 'nuxt3'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    windicss?: any
  }
}

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
