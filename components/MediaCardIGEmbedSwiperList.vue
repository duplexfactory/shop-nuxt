<script lang="ts">
import Swiper, {FreeMode, Navigation, Pagination} from 'swiper';
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
import loadIGEmbeds from "~/utils/loadIGEmbeds";

type SimplePage = Pick<IgPage, "lastMediaData" | "fullName" | "pk" | "username">;

export default {
  components: {MediaCardIGEmbed, MediaCard, SwiperSlidesPlaceholder},
  data() : {
    swiperLoaded: boolean,
    swiperReady: boolean,
    swiperOptions: SwiperOptions
  } {
    return {
      swiperLoaded: false,
      swiperReady: false,
      swiperOptions: {
        modules: [Navigation, Pagination],

        // Optional parameters
        // direction: 'vertical',
        // loop: true,

        on: {
          init: () => {
            this.swiperReady = true;
            this.$nextTick(() => {
              loadIGEmbeds();
            })
          },
        },

        observer: true,

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
    simplePages: Array as PropType<SimplePage[]>
  },
  methods: {
    loadSwiper() {
      this.$nextTick(() => {
        if (!this.swiperLoaded && this.$refs.swiper) {

          this.swiperLoaded = true;

          // Navigation arrows
          this.swiperOptions.navigation = {
            nextEl: this.$refs.swiperButtonNext,
            prevEl: this.$refs.swiperButtonPrev,
          };

          const swiper = new Swiper(this.$refs.swiper, this.swiperOptions);
        }
      })

    }
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
<!--    <swiper-slides-placeholder v-if="!swiperReady" :slide-aspect-ratio="3/5" :swiper-options="swiperOptions" class="pb-8"></swiper-slides-placeholder>-->

    <lazy-component @show="loadSwiper">
      <!-- Slider main container -->
      <div :class="{'hidden': !swiperReady || simplePages.length === 0}" class="swiper" ref="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper pb-8">
          <!-- Slides -->

          <MediaCardIGEmbed v-for="media in simplePages"
                            @showMediaModal="showMediaModal = true; showingMediaModalData = {code: media.lastMediaData.code, pagePk: media.pk, username: media.username}"
                            class="swiper-slide"
                            top-bar
                            :fixedAspectRatio="0"
                            :price="media.lastMediaData.price"
                            :delegate-script="true"
                            :postId="media.lastMediaData.code"
                            :key="media.pk + '-post-card'"></MediaCardIGEmbed>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination" style="bottom: 0px !important;"></div>

        <!-- If we need navigation buttons -->
        <div ref="swiperButtonPrev" class="swiper-button-prev"></div>
        <div ref="swiperButtonNext" class="swiper-button-next"></div>

      </div>
    </lazy-component>
    <swiper-slides-placeholder v-if="!swiperReady || simplePages.length === 0" :slideAspectRatio="0.5" :swiper-options="swiperOptions" class="pb-8">
      <template v-slot:default="slotProps">
<!--        <MediaCardIGEmbed class="h-full w-full"></MediaCardIGEmbed>-->
        <div class="h-full w-full bg-loading"></div>
      </template>
    </swiper-slides-placeholder>

  </div>

</template>
