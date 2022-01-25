<script lang="ts">
import Swiper, { Navigation, Pagination } from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";
import IgPage from "~/models/IgPage";
import SwiperSlidesPlaceholder from "~/components/SwiperSlidesPlaceholder.vue";
import {SwiperOptions} from "swiper/types/swiper-options";
import MediaCard from "~/components/MediaCard.vue";
import MediaCardIGEmbed from "~/components/MediaCardIGEmbed.vue";

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

type MediaWithShop = IgMedia & {
  igPage: IgPage
};

export default {
  components: {MediaCardIGEmbed, MediaCard, SwiperSlidesPlaceholder},
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

        // // And if we need scrollbar
        // scrollbar: {
        //   el: '.swiper-scrollbar',
        // },
      }
    };
  },
  props: {
    medias: Array as PropType<MediaWithShop[]>
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
<!--    <swiper-slides-placeholder v-if="!swiperReady" :slide-aspect-ratio="3/5" :swiper-options="swiperOptions" class="pb-8"></swiper-slides-placeholder>-->
    <!-- Slider main container -->
    <div class="swiper" ref="swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper pb-8">
        <!-- Slides -->
<!--        <MediaCard v-for="media in medias"-->
<!--                   class="swiper-slide"-->
<!--                   :media="media"-->
<!--                   :shop="media.igPage"-->
<!--                   :key="media.id + '-post-card'"></MediaCard>-->

        <!--                          :media="media"-->
        <!--                          :shop="media.igPage"-->

        <MediaCardIGEmbed v-if="!swiperReady"></MediaCardIGEmbed>
        <MediaCardIGEmbed v-else
                          v-for="media in medias"
                          class="swiper-slide"
                          postId="CY7CJvONeHN"
                          :key="media.id + '-post-card'"></MediaCardIGEmbed>


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
