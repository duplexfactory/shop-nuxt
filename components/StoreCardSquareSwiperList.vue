<template>
  <div>
    <lazy-component @show="loadSwiper">
      <!-- Slider main container -->
      <div :class="{'hidden': !swiperReady || shops.length === 0}" class="swiper" ref="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper lg:pb-8">
          <!-- Slides -->
          <StoreCardSquare v-for="shop in shops"
                           class="swiper-slide"
                           :shop="shop"
                           :showLocations="true"
                           :key="shop.username + '-store-card-sq'"></StoreCardSquare>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination hidden lg:block" style="bottom: 0px !important;"></div>

        <!-- If we need navigation buttons -->
        <div ref="swiperButtonPrev" class="swiper-button-prev"></div>
        <div ref="swiperButtonNext" class="swiper-button-next"></div>

        <!--        &lt;!&ndash; If we need scrollbar &ndash;&gt;-->
        <!--        <div class="swiper-scrollbar"></div>-->
      </div>
    </lazy-component>

    <swiper-slides-placeholder v-if="!swiperReady || shops.length === 0" :slide-aspect-ratio="4/3"
                               :swiper-options="swiperOptions" class="swiper-placeholder lg:pb-8">
    </swiper-slides-placeholder>

  </div>
</template>

<script setup lang="ts">

import {FreeMode, Navigation, Pagination} from "swiper"
// import Swiper and modules styles
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/free-mode"
import {PropType} from "vue"
import {PageSearch} from "~/models/PageSearch";

const {shops} = defineProps({shops: Array as PropType<PageSearch[]>})

const {
  swiper,
  swiperButtonPrev,
  swiperButtonNext,
  swiperLoaded,
  swiperReady,
  swiperOptions,
  loadSwiper
} = useSwiper({

  modules: [Navigation, FreeMode, Pagination],

  // Optional parameters
  // direction: 'vertical',
  // loop: true,

  on: {
    init: () => {
      swiperReady.value = true
    },
  },

  spaceBetween: 16,
  slidesPerView: 1.2,
  slidesPerGroup: 1,
  freeMode: true,

  breakpoints: {
    1024: { // lg
      spaceBetween: 16,
      slidesPerView: 2.2,
      slidesPerGroup: 2,
      freeMode: false,
    },
    1280: { // xl
      spaceBetween: 16,
      slidesPerView: 2.5,
      slidesPerGroup: 2,
      freeMode: false,
    },
    1536: { // 2xl
      spaceBetween: 16,
      slidesPerView: 3,
      slidesPerGroup: 3,
      freeMode: false,
    }
  },

  pagination: {
    el: ".swiper-pagination",
  },
})

watch(swiper, loadSwiper)

</script>
