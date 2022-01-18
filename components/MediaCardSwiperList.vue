<script lang="ts">
import Swiper, { Navigation, Pagination } from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";
import IgPage from "~/models/IgPage";

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

type MediaWithShop = IgMedia & {
  igPage: IgPage
};

export default {
  components: {},
  props: {
    medias: Array as PropType<MediaWithShop[]>
  },
  mounted() {
    const swiper = new Swiper(this.$refs.swiper, {
      // Optional parameters
      // direction: 'vertical',
      // loop: true,

      spaceBetween: 16,
      slidesPerView: 2,
      slidesPerGroup: 2,

      breakpoints: {
        1024: {
          // spaceBetween: 32,
          // slidesPerView: 2,
          // slidesPerGroup: 2,

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

      // Navigation arrows
      navigation: {
        nextEl: this.$refs.swiperButtonNext,
        prevEl: this.$refs.swiperButtonPrev,
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
  <!-- Slider main container -->
  <div class="swiper" ref="swiper">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper pb-8">
      <!-- Slides -->
      <MediaCard v-for="media in medias"
                class="swiper-slide"
                :media="media"
                :shop="media.igPage"
                :key="media.id + '-post-card'"></MediaCard>
    </div>
    <!-- If we need pagination -->
    <div class="swiper-pagination" style="bottom: 0px !important;"></div>

    <!-- If we need navigation buttons -->
    <div ref="swiperButtonPrev" class="swiper-button-prev"></div>
    <div ref="swiperButtonNext" class="swiper-button-next"></div>

    <!--        &lt;!&ndash; If we need scrollbar &ndash;&gt;-->
    <!--        <div class="swiper-scrollbar"></div>-->
  </div>
</template>
<style scoped>
.swiper-pagination .swiper-pagination-bullet-active {
  @apply bg-pink-400;
}

.swiper-button-next, .swiper-button-prev {
  display: none;
  @apply text-pink-400;
}

.swiper-button-next::after, .swiper-button-prev::after {
  font-size: 32px;
}

@screen md {
  .swiper:hover .swiper-button-next, .swiper:hover .swiper-button-prev {
    display: flex !important;
  }
}

</style>
