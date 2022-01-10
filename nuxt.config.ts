import {defineNuxtConfig, NuxtConfig} from "nuxt3";

export default defineNuxtConfig({
  nitro: {
    preset: "cloudflare"
  },
  buildModules: [
    "@vueuse/core/nuxt",
    "nuxt-windicss",
  ],
  windicss: {
    analyze: true
  },
  privateRuntimeConfig: {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  }
} as NuxtConfig);
