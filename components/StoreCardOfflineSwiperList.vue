<script lang="ts">
import Swiper, { Navigation, FreeMode, Pagination } from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/css/free-mode";
import {PropType} from "vue";
import IgPage from '~/models/IgPage';
import SwiperSlidesPlaceholder from "~/components/SwiperSlidesPlaceholder.vue";
import {SwiperOptions} from "swiper/types/swiper-options";
import StoreCardSquare from "~/components/StoreCardSquare.vue";

// configure Swiper to use modules
Swiper.use([Navigation, FreeMode, Pagination]);

export default {
  components: {StoreCardSquare, SwiperSlidesPlaceholder},
  data() : {
    swiperReady: boolean,
    swiperOptions: SwiperOptions
  } {
    return {
      swiperReady: false,
      swiperOptions: {
        // Optional parameters
        // direction: 'vertical',
        // loop: true,

        on: {
          init: () => {
            this.swiperReady = true;
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
          el: '.swiper-pagination',
        },

        // // And if we need scrollbar
        // scrollbar: {
        //   el: '.swiper-scrollbar',
        // },
      }
    }
  },
  props: {
    shops: Array as PropType<IgPage[]>
  },
  mounted() {
    // Navigation arrows
    this.swiperOptions.navigation = {
      nextEl: this.$refs.swiperButtonNext,
      prevEl: this.$refs.swiperButtonPrev,
    };

    const swiper = new Swiper(this.$refs.swiper, this.swiperOptions);
  }
}
</script>

<template>
  <div>
    <swiper-slides-placeholder v-if="!swiperReady" :slide-aspect-ratio="4/3" :swiper-options="swiperOptions" class="pb-8">
      <template v-slot:default="slotProps">
        <div class="h-full w-full bg-loading"></div>
      </template>
    </swiper-slides-placeholder>

    <!-- Slider main container -->
    <div :class="{'hidden': !swiperReady}" class="swiper" ref="swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper pb-8">
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
  </div>
</template>
<style scoped>
    .bg-loading {
      background: #eee;
      background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
      border-radius: 5px;
      background-size: 200% 100%;
      animation: 1.5s shine linear infinite;
    }

    @keyframes shine {
      to {
        background-position-x: -200%;
      }
    }

</style>
