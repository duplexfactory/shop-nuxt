<script setup lang="ts">
const header = ref('Nuxt 3 starter template')
const { counter } = goSick();

const storeName = 'caseonlyy';

// const res = await useFetch(`/api/shop?id=${storeName}`);
// console.log(res.data.value);

// let res = await fetch(`https://www.instagram.com/${storeName}/?__a=1`);
// res = await res.text();
// const data = JSON.parse(res);

// const lastActiveDate = new Date(res.data.value.lastActive);
const lastActiveDate = new Date(); // Dummy
const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth() + 1}/${lastActiveDate.getFullYear()}`;

// const description = res.data.value.description;
const description = 'description'; // Dummy

</script>

<script lang="ts">

import Swiper, { Navigation, Pagination } from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

export default {
  mounted() {
    const swiper = new Swiper('.swiper', {
      // Optional parameters
      // direction: 'vertical',
      // loop: true,

      spaceBetween: 32,
      slidesPerView: 2,
      slidesPerGroup: 2,

      breakpoints: {
        1536: {
          spaceBetween: 16,
          slidesPerView: 3,
          slidesPerGroup: 3,
        }
      },

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // // And if we need scrollbar
      // scrollbar: {
      //   el: '.swiper-scrollbar',
      // },
    });
  }
}
</script>

<template>
  <div>
    <h1 class="rounded-md bg-green-200 text-xl text-green-700 font-bold">
      {{ header }}
      {{ counter }}
      with <a href="https://vueuse.org/" target="_blank">VueUse</a> and <a href="https://windicss.org/" target="_blank">Windi CSS</a>.
    </h1>
    <p>
      Edit <strong>layouts/default.vue</strong> and <strong>windi.config.js</strong>.
    </p>
    <nuxt-link to="/hello">HEEEEEE</nuxt-link>



    <div class="container mx-auto">

      <div class="section-title">熱門店鋪</div>
      <!-- Slider main container -->
      <div class="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <StoreCardSquare v-for="i in [1, 2, 3, 4, 5]"
                           class="swiper-slide"
                           :key="i.toString() + '-store-card-sq'"></StoreCardSquare>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>

        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>

        <!--        &lt;!&ndash; If we need scrollbar &ndash;&gt;-->
        <!--        <div class="swiper-scrollbar"></div>-->
      </div>


      <div class="section-title">最新產品</div>
      <div class="section-title">活躍店長</div>
      <div class="section-title">實體店鋪</div>
    </div>


    <div class="container mx-auto pb-20">

      <div class="mt-10 text-xl">Components Showcase</div>

      <div class="mt-8 mb-4">Post Card</div>
      <div class="grid grid-cols-8">
        <div class="p-4 col-span-1">
          <div class="bg-gray-300 rounded-md" style="aspect-ratio: 1;"></div>
          <div class="mt-2">Post content long long long long long long long long long long long long long</div>
          <div class="mt-2 text-sm text-gray-500">{{ storeName }}</div>
          <button class="mt-4 text-white text-md bg-pink-400 px-6 py-2 rounded-md">探索</button>
        </div>
      </div>

      <div class="mt-8 mb-4">Store Card Simple</div>
      <div class="flex flex-row">
        <div class="p-4 text-center">
          <div class="bg-gray-300 rounded-full mx-auto" style="aspect-ratio: 1; height: 100px;">
          </div>

          <div class="mt-2 font-semibold text-lg">{{ storeName }}</div>
          <div class="mt-2 flex">
            <tag v-for="i in [1, 2, 3]"
                 :key="i.toString()"
                 class="mr-2"
                 title="Tag 1"></tag>
          </div>
          <button class="mt-4 text-white text-md bg-pink-400 px-6 py-2 rounded-md">探索</button>

        </div>
      </div>

      <div class="mt-8 mb-4">Store Card Square</div>
      <div class="flex flex-row">

        <div class="border rounded-md grid grid-cols-2">
          <div class="p-4 col-span-1">
            <div class="bg-gray-300 rounded-full" style="aspect-ratio: 1; height: 80px;">

            </div>

            <div class="mt-2 font-semibold text-lg">{{ storeName }}</div>
            <div class="text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>

            <div class="mt-4 text-sm text-gray-500 flex flex-row">
              <div class="text-center" style="flex: 1;">
                <div>Followers</div>
                <div>1,000</div>
              </div>
              <div class="bg-gray-300 mx-2" style="width: 1px;"></div>
              <div class="text-center" style="flex: 1;">
                <div>Posts</div>
                <div>1,000</div>
              </div>
            </div>

            <div class="mt-4 flex">
              <tag v-for="i in [1, 2, 3]"
                   :key="i.toString()"
                   class="mr-2"
                   title="Tag 1"></tag>
            </div>

            <button class="mt-4 text-white text-md bg-pink-400 px-6 py-2 rounded-md">進入店鋪</button>

          </div>

          <div class="col-span-1">
            <div class="bg-gray-300" style="aspect-ratio: 1; height: 220px;"></div>
            <div class="flex flex-row">
              <div class="bg-red-300" style="aspect-ratio: 1; height: 110px;"></div>
              <div class="bg-green-300" style="aspect-ratio: 1; height: 110px;"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 mb-4">Store Card Rectangle</div>
      <div class="border rounded-md p-4 flex flex-row">
          <div class="mr-4">
            <div class="bg-gray-300 rounded-full" style="aspect-ratio: 1; height: 80px;">

            </div>

            <div class="mt-2 font-semibold text-lg">{{ storeName }}</div>
            <div class="text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>

            <div class="mt-2 text-sm text-gray-500 flex flex-row">
              <div class="text-center" style="flex: 1;">
                <div>Followers</div>
                <div>1,000</div>
              </div>
              <div class="bg-gray-300 mx-2" style="width: 1px;"></div>
              <div class="text-center" style="flex: 1;">
                <div>Posts</div>
                <div>1,000</div>
              </div>
            </div>

            <div class="mt-4 flex">
              <tag v-for="i in [1, 2, 3]"
                   :key="i.toString()"
                   class="mr-2"
                   title="Tag 1"></tag>
            </div>

          </div>
          <div class="">
            <div class="text-gray-500">Tag line</div>
            <div class="mt-2 text-gray-500">{{ description }}</div>
            <div class="flex flex-row mt-2">
              <div v-for="i in [1, 2, 3]" :key="i.toString()" class="bg-gray-300 mr-2" style="aspect-ratio: 1; height: 100px;"></div>
            </div>
          </div>

        </div>


    </div>


  </div>
</template>

<style>
  .section-title {
    @apply text-xl font-semi-bold;
  }


</style>

