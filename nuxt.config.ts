import {defineNuxtConfig, NuxtConfig} from "nuxt3";
const path = require('path')
const fs = require('fs-extra')

export default defineNuxtConfig({
  buildModules: [
    "@vueuse/nuxt",
    "nuxt-windicss",
  ],
  modules: [
    function (moduleOptions, nuxtInstance) {
      // Init cache
      // a file "sitemap-routes.json" is written to "dist" dir on "build" mode

      const jsonStaticRoutesPath = !nuxtInstance.options.dev
          ? path.resolve(nuxtInstance.options.buildDir, path.join('dist', 'sitemap-routes.json'))
          : null
      const staticRoutes = fs.readJsonSync(jsonStaticRoutesPath, { throws: false })
      const globalCache = { staticRoutes }

      console.log('123');
      console.log(Object.keys(nuxtInstance));

      nuxtInstance['__module_container__'].extendRoutes((routes) => {

        // Create a cache for static routes
        // globalCache.staticRoutes = getStaticRoutes(routes)
        globalCache.staticRoutes = ['1', '2']

        // On run cmd "build"
        if (!nuxtInstance.options.dev) {
          // Save static routes
          fs.outputJsonSync(jsonStaticRoutesPath, globalCache.staticRoutes)
        }
      })

      // nuxtInstance.addHooks({
      //   'build:done': (builder) => {
      //     console.log('build:done');
      //     console.log(Object.keys(builder.nuxt));
      //   },
      // })
      //
      // nuxtInstance.addHooks({
      //   'modules:done': (moduleContainer) => {
      //     moduleContainer.nuxt['__module_container__'].extendRoutes((routes) => {
      //
      //       // Create a cache for static routes
      //       // globalCache.staticRoutes = getStaticRoutes(routes)
      //       globalCache.staticRoutes = ['1', '2']
      //
      //       // On run cmd "build"
      //       if (!nuxtInstance.options.dev) {
      //         // Save static routes
      //         fs.outputJsonSync(jsonStaticRoutesPath, globalCache.staticRoutes)
      //       }
      //     })
      //   }
      // })

    }
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
  ]
} as NuxtConfig);
