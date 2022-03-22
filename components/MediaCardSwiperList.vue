<script lang="ts">
import Swiper, {FreeMode, Navigation, Pagination} from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {PropType} from "vue";
import IgPage from "~/models/IgPage";
import {SwiperOptions} from "swiper/types/swiper-options";

type SimplePage = Pick<IgPage, "lastMediaData" | "fullName" | "pk" | "username">;

export default {
  data() : {
    swiperReady: boolean,
    swiperOptions: SwiperOptions
  } {
    return {
      swiperReady: false,
      swiperOptions: {
        modules: [Navigation, Pagination],

        // Optional parameters
        // direction: 'vertical',
        // loop: true,

        on: {
          init: () => {
            this.swiperReady = true;
          },
        },

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
            spaceBetween: 24,
            slidesPerView: 3.5,
            slidesPerGroup: 3,
          },
          1536: {
            spaceBetween: 24,
            slidesPerView: 4,
            slidesPerGroup: 4,
          }
        },

        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },

        // // And if we need scrollbar
        // scrollbar: {
        //   el: '.swiper-scrollbar',
        // },
      }
    };
  },
  props: {
    simplePages: Array as PropType<SimplePage[]>
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

<script setup lang="ts">
  import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";
  const showMediaModal = useShowMediaModal();
  const showingMediaModalData = useShowingMediaModalData();
</script>

<template>
  <div>
    <swiper-slides-placeholder v-if="!swiperReady || simplePages.length === 0" :slide-aspect-ratio="3/5" :swiper-options="swiperOptions" class="pb-8">
      <template v-slot:default="slotProps">
        <div class="h-full w-full bg-loading"></div>
      </template>
    </swiper-slides-placeholder>
    <!-- Slider main container -->
    <div :class="{'hidden': !swiperReady || simplePages.length === 0}" class="swiper" ref="swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper pb-8">
        <!-- Slides -->
        <MediaCard v-for="page in simplePages"
                   @click="showMediaModal = true; showingMediaModalData = {code: page.lastMediaData.code, pagePk: page.pk, username: page.username}"
                   class="cursor-pointer swiper-slide"
                   :media="page.lastMediaData"
                   :shop="page"
                   :key="page.pk.toString() + '-post-card'"></MediaCard>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination" style="bottom: 0px !important;"></div>

      <!-- If we need navigation buttons -->
      <div ref="swiperButtonPrev" class="swiper-button-prev"></div>
      <div ref="swiperButtonNext" class="swiper-button-next"></div>

      <!--        &lt;!&ndash; If we need scrollbar &ndash;&gt;-->
      <!--        <div class="swiper-scrollbar"></div>-->
    </div>
  </div>

</template>
