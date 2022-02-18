import {defineNuxtConfig, NuxtConfig} from "nuxt3";

export default defineNuxtConfig({
  buildModules: [
    "@vueuse/nuxt",
    "nuxt-windicss",
  ],
  windicss: {
    analyze: true
  },
  css: [
    '@/assets/css/main.css'
  ],
  publicRuntimeConfig: {
    IMAGE_KEY: "s6v9y$B&E)H@McQfThWmZq4t7w!z%C*F"
  },
  privateRuntimeConfig: {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    MONGO_SRV: process.env.MONGO_SRV,
    DYNAMODB_ACCESS_KEY_ID: process.env.DYNAMODB_ACCESS_KEY_ID,
    DYNAMODB_SECRET_ACCESS_KEY: process.env.DYNAMODB_SECRET_ACCESS_KEY,
    DYNAMODB_REGION: process.env.DYNAMODB_REGION,
  },
  ssr: true,
  plugins: [],
} as NuxtConfig);
