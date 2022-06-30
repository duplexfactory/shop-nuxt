<template>
  <div>
    <lazy-component @show="loadSwiper">
      <!-- Slider main container -->
      <div :class="{'hidden': !swiperReady || shops.length === 0}" class="swiper" ref="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper pb-8">
          <!-- Slides -->
          <StoreCardSimple v-for="shop in shops"
                           class="swiper-slide"
                           :shop="shop"
                           :key="shop.username + '-store-card-simple'"></StoreCardSimple>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination" style="bottom: 0px !important;"></div>

        <!-- If we need navigation buttons -->
        <div ref="swiperButtonPrev" class="swiper-button-prev"></div>
        <div ref="swiperButtonNext" class="swiper-button-next"></div>

        <!--        &lt;!&ndash; If we need scrollbar &ndash;&gt;-->
        <!--        <div class="swiper-scrollbar"></div>-->
      </div>
    </lazy-component>
    <swiper-slides-placeholder v-if="!swiperReady || shops.length === 0" :height="268" :swiper-options="swiperOptions"
                               class="pb-8">
    </swiper-slides-placeholder>
  </div>
</template>

<script setup lang="ts">
  import {Navigation, Pagination} from "swiper"
  // import Swiper and modules styles
  import "swiper/css/navigation"
  import "swiper/css/pagination"
  import {PropType} from "vue"
  import {PageSearch} from "~/models/PageSearch";

  const {shops} = defineProps({shops: Array as PropType<PageSearch[]>})

  const {
    swiper,
    swiperButtonPrev,
    swiperButtonNext,
    swiperReady,
    swiperOptions,
    loadSwiper
  } = useSwiper({
    modules: [Navigation, Pagination],

    // Optional parameters
    // direction: 'vertical',
    // loop: true,

    on: {
      init: () => {
        swiperReady.value = true
      },
    },

    observer: true,

    spaceBetween: 16,
    slidesPerView: 2,
    slidesPerGroup: 2,

    breakpoints: {
      1024: {
        spaceBetween: 16,
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      1280: {
        spaceBetween: 16,
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
      1536: {
        spaceBetween: 16,
        slidesPerView: 5,
        slidesPerGroup: 5,
      }
    },

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
    },

    // // And if we need scrollbar
    // scrollbar: {
    //   el: '.swiper-scrollbar',
    // },
  })

  watch(swiper, loadSwiper)
</script>
