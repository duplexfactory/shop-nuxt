<template>
    <div class="text-sm text-gray-700 bg-gray-100">
        <div class="container mx-auto py-8">

            <div class="grid grid-cols-2 md:grid-cols-8 lg:grid-cols-12 gap-y-8">
              <div class="col-span-2">
                  <img style="width: 108px; height: 45px;" src="/images/logo.png"/>
              </div>
              <div class="col-span-2">
                <div class="mb-4 font-semibold">商戶</div>
                <nuxt-link to="/verify" class="block mb-2">認證我的商店</nuxt-link>
                <nuxt-link to="/takedown" class="block mb-2">移除商店資料</nuxt-link>
              </div>
              <div class="col-span-2">
                <div class="mb-4 font-semibold">社群</div>
                <nuxt-link to="/suggest-shop" class="mb-2">提供商店資料</nuxt-link>
              </div>
              <div class="col-span-2">
                <div class="mb-4 font-semibold">幫助</div>
                <div class="mb-2"><a href="https://www.instagram.com/shoperuse/">聯絡我們</a></div>
                <!--                <div class="mr-6">關於我們</div>-->
                <nuxt-link to="/privacy-policy" class="mb-2">私隱條款</nuxt-link>
              </div>

            </div>

            <hr class="mt-4 mb-2 border-gray-700"/>

            <div class="text-right">
                © 2022 Shoperuse. All Rights Reserved.
            </div>

        </div>
    </div>
</template>

<style scoped>
  a {
    transition: .3s;
    @apply hover:text-pink-400
  }
</style>

