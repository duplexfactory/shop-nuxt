<script lang="ts">
import Swiper, { Navigation, Pagination } from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";
import StoreCardOffline from "~/components/StoreCardOffline.vue";
import PostCard from "~/components/PostCard.vue";

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

export default {
  components: {PostCard, StoreCardOffline},
  props: {
    medias: Array as PropType<IgMedia[]>
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
          slidesPerView: 2.2,
          slidesPerGroup: 2,
        },
        1280: {
          spaceBetween: 16,
          slidesPerView: 2.5,
          slidesPerGroup: 2,
        },
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
      <PostCard v-for="media in medias"
                class="swiper-slide"
                :media="media"
                :key="media.id + '-post-card'"></PostCard>
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

.swiper:hover .swiper-button-next, .swiper:hover .swiper-button-prev {
  display: flex !important;
}

</style>
