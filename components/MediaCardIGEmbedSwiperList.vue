<template>
  <div>
    <!--    <swiper-slides-placeholder v-if="!swiperReady" :slide-aspect-ratio="3/5" :swiper-options="swiperOptions" class="pb-8"></swiper-slides-placeholder>-->

    <lazy-component @show="loadSwiper">
      <!-- Slider main container -->
      <div :class="{'hidden': !swiperReady || lastMediaPage.length === 0}" class="swiper" ref="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper pb-8">
          <!-- Slides -->

          <MediaCardIGEmbed v-for="media in lastMediaPage"
                            @showMediaModal="showMediaModal = true; showingMediaModalData = {media: media.lastMediaData, pageId: media._id}"
                            class="swiper-slide"
                            top-bar
                            :fixedAspectRatio="0"
                            :price="mediaPrice(media.lastMediaData)"
                            :delegate-script="true"
                            :postId="media.lastMediaData.code"
                            :key="media._id + '-post-card'"></MediaCardIGEmbed>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination" style="bottom: 0px !important;"></div>

        <!-- If we need navigation buttons -->
        <div ref="swiperButtonPrev" class="swiper-button-prev"></div>
        <div ref="swiperButtonNext" class="swiper-button-next"></div>

      </div>
    </lazy-component>
    <swiper-slides-placeholder v-if="!swiperReady || lastMediaPage.length === 0" :slideAspectRatio="0.5"
                               :swiper-options="swiperOptions" class="pb-8">
    </swiper-slides-placeholder>

  </div>

</template>

<script setup lang="ts">
  import {Navigation, Pagination} from "swiper"
  // import Swiper and modules styles
  import "swiper/css/navigation"
  import "swiper/css/pagination"
  import {PropType} from "vue"
  import loadIGEmbeds from "~/utils/loadIGEmbeds"
  import {PageSearch} from "~/models/PageSearch";

  const {lastMediaPage} = defineProps({lastMediaPage: Array as PropType<Pick<PageSearch, "lastMediaData" | "fullName" | "_id" | "username">[]>})

  const showMediaModal = useShowMediaModal()
  const showingMediaModalData = useShowingMediaModalData()

  // Media Price
  const {mediaPrice} = useMediaPrice()

  const {
    swiper,
    swiperButtonPrev,
    swiperButtonNext,
    swiperReady,
    loadSwiper,
    swiperOptions
  } = useSwiper({
    modules: [Navigation, Pagination],

    // Optional parameters
    // direction: 'vertical',
    // loop: true,

    on: {
      init: () => {
        swiperReady.value = true
        nextTick(() => {
          loadIGEmbeds()
        })
      },
    },

    observer: true,

    spaceBetween: 0,
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
      el: ".swiper-pagination",
    },

    // // And if we need scrollbar
    // scrollbar: {
    //   el: '.swiper-scrollbar',
    // },
  })

  watch(swiper, loadSwiper)
</script>

<style scoped>

  .swiper-button-prev, .swiper-button-next {
    display: flex !important;
    background-color: white !important;
    width: 32px;
    height: 32px;
    @apply rounded-full shadow;
  }

  @screen md {
    .swiper-button-prev, .swiper-button-next {
      width: 44px;
      height: 44px;
    }
  }

  .swiper-button-next::after, .swiper-button-prev::after {
    font-size: 18px !important;
    @apply font-bold;
  }

</style>
