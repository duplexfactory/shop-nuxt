import {defineNuxtConfig, NuxtConfig} from "nuxt3";
import {ModuleContainer} from "@nuxt/schema";


const path = require('path')
const fs = require('fs-extra')

import { createSitemap } from "@nuxtjs/sitemap/lib/builder";
import { $fetch } from "ohmyfetch";

export default defineNuxtConfig({
  buildModules: [
    "@vueuse/nuxt",
    "nuxt-windicss",
  ],
  meta: {
    title: 'IG Shop 推薦及評論平台 | IG Shop 搜尋器 | Shopitout',
    link: [
      {rel: 'preconnect dns-prefetch', href: process.env.IMG_PROXY},
    ],
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0'},
      {name: 'theme-color', content: '#f472b6'},
      {name: 'description', content: 'Shopitout是一個IG Shop評論平台及搜尋器，整理及分類香港的IG Shop，令買家輕鬆搜尋、瀏覽、發掘大眾推薦的IG Shop，立即了解！'},
      {name: 'keywords', content: 'Shopitout, ig shop, ig shop衫, instagram, 網店, ig shop商業登記, ig shop推薦, ig shop攻略'},
      {property: 'og:locale', hid: 'og:locale', content: 'zh_HK'},
      {property: 'og:title', hid: 'og:title', content: 'IG Shop 推薦及評論平台 | IG Shop 搜尋器 | Shopitout'},
      // {property: 'og:url', hid: 'og:url', content: process.env.DOMAIN_WEB},
      // {
      //   property: 'og:image',
      //   hid: 'og:image',
      //   content: `${process.env.DOMAIN_WEB}/assets/img/common/home_preview.jpg`
      // },
      // {property: 'og:image:width', hid: 'og:image:width', content: '960'},
      // {property: 'og:image:height', hid: 'og:image:height', content: '540'},
      {
        property: 'og:description',
        hid: 'og:description',
        content: 'Shopitout是一個IG Shop評論平台及搜尋器，整理及分類香港的IG Shop，令買家輕鬆搜尋、瀏覽、發掘大眾推薦的IG Shop，立即了解！'
      },
      {property: 'og:site_name', hid: 'og:site_name', content: 'Shopitout'}
    ],
  },
  windicss: {
    analyze: true
  },
  css: [
    '@/assets/css/main.css',
    '@/assets/font/css/animation.css',
    '@/assets/font/css/shop-it-out.css',
    '@/assets/font/css/shop-it-out-codes.css',
    '@/assets/font/css/shop-it-out-embedded.css',
    '@/assets/font/css/shop-it-out-ie7.css',
    '@/assets/font/css/shop-it-out-ie7-codes.css',
  ],
  publicRuntimeConfig: {
    IMAGE_KEY: "s6v9y$B&E)H@McQfThWmZq4t7w!z%C*F",
    IMG_PROXY: process.env.IMG_PROXY,
    DOMAIN: process.env.DOMAIN
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
  ignore: [
    "pages/hidden/*"
  ],
  sitemap: function() {
    // const nuxtInstance = this.nuxt;
    return {
      path: '/sitemap.xml',
      hostname: process.env.DOMAIN,
      cacheTime: 1000 * 60 * 60 * 6,
      // routes() {
      //   // console.log(nuxtInstance.options);
      //   const jsonStaticRoutesPath = path.resolve(nuxtInstance.options.buildDir, path.join('dist', 'sitemap-routes-patch.json'));
      //   const staticRoutes = fs.readJsonSync(jsonStaticRoutesPath, { throws: false });
      //   return [...staticRoutes];
      // }
    }
  },
  modules: [
    async function (moduleOptions, nuxtInstance) {
      //
      // const test = await $fetch(`${process.env.DOMAIN}/api/home`);
      // console.log(test);

      const base = nuxtInstance.options.router.base
      async function initOptions(nuxtInstance, moduleOptions) {
        if (nuxtInstance.options.sitemap === false || moduleOptions === false) {
          return false
        }

        let options = nuxtInstance.options.sitemap || moduleOptions

        if (typeof options === 'function') {
          options = await options.call(nuxtInstance)
        }

        if (options === false) {
          return false
        }

        return Array.isArray(options) ? options : [options]
      }
      const options = await initOptions(nuxtInstance, moduleOptions)

      // Init cache
      // a file "sitemap-routes.json" is written to "dist" dir on "build" mode

      // const jsonStaticRoutesPath = !nuxtInstance.options.dev
      //     ? path.resolve(nuxtInstance.options.buildDir, path.join('dist', 'sitemap-routes-patch.json'))
      //     : null;
      // const staticRoutes = fs.readJsonSync(jsonStaticRoutesPath, { throws: false });
      // const globalCache = { staticRoutes };
      const globalCache = { staticRoutes: [] };

      // Fix static routes empty.
      function getStaticRoutes(router) {
        return flattenStaticRoutes(router)
      }
      function flattenStaticRoutes(router, path = '', routes = []) {
        router.forEach((route) => {
          // Skip dynamic routes
          if ([':', '*'].some((c) => route.path.includes(c))) {
            return
          }
          // Nested routes
          if (route.children && route.children.length) {
            return flattenStaticRoutes(route.children, path + route.path + '/', routes)
          }
          // Normalize url (without trailing slash)
          route.url = path.length && !route.path.length ? path.slice(0, -1) : path + route.path

          routes.push(route)
        })
        return routes
      }

      (this as any as ModuleContainer).extendRoutes(async (routes) => {

        // Create a cache for static routes
        globalCache.staticRoutes = getStaticRoutes(routes)

        // On run cmd "build"
        // if (!nuxtInstance.options.dev) {
        //   // Save static routes
        //   fs.outputJsonSync(jsonStaticRoutesPath, globalCache.staticRoutes)
        // }

        const xml = await createSitemap(options[0], globalCache.staticRoutes, base).toXML()
        nuxtInstance.addHooks({
          // 'build:before': async (builder) => {
          //   await fs.outputFile(path.resolve(nuxtInstance.options.rootDir, path.join('public', 'sitemap.xml')), xml)
          // },
          'build:done': async (builder) => {
            await fs.outputFile(path.resolve(nuxtInstance.options.buildDir, path.join('dist', 'server', 'sitemap.xml')), xml),
            await fs.outputFile(path.resolve(nuxtInstance.options.buildDir, path.join('dist', 'client', 'sitemap.xml')), xml)
            await fs.outputFile(path.resolve(nuxtInstance.options.rootDir, path.join('.output', 'public', 'sitemap.xml')), xml)
            await fs.outputFile(path.resolve(nuxtInstance.options.rootDir, path.join('.output', 'public', '_nuxt', 'sitemap.xml')), xml)
          },
        })
      })
    },
  ]
} as NuxtConfig);
