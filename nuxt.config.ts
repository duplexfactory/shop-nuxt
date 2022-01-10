import {defineNuxtConfig, NuxtConfig} from 'nuxt3';

declare module 'nuxt3' {
  interface NuxtConfig {
    windicss?: any;
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
} as NuxtConfig);
