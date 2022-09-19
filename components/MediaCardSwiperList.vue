<template>
  <div>
    <swiper-slides-placeholder v-if="!swiperReady || lastMediaPage.length === 0" :slide-aspect-ratio="3/5"
                               :swiper-options="swiperOptions" class="pb-8">
    </swiper-slides-placeholder>
    <!-- Slider main container -->
    <div :class="{'hidden': !swiperReady || lastMediaPage.length === 0}" class="swiper" ref="swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper pb-8">
        <!-- Slides -->
        <MediaCard v-for="page in lastMediaPage"
                   @click="showMediaForPage(page)"
                   class="cursor-pointer swiper-slide"
                   :media="page.lastMediaData"
                   :shop="page"
                   :key="page._id + '-post-card'"></MediaCard>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination" style="bottom: 0px !important;"></div>

      <!-- If we need navigation buttons -->
      <div ref="swiperButtonPrev" class="swiper-button-prev"></div>
      <div ref="swiperButtonNext" class="swiper-button-next"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {Navigation, Pagination} from "swiper"
  // import Swiper and modules styles
  import "swiper/css/navigation"
  import "swiper/css/pagination"
  import {PropType} from "vue"
  import {PageSearch} from "~/models/PageSearch";

  const {lastMediaPage} = defineProps({lastMediaPage: Array as PropType<Pick<PageSearch, "lastMediaData" | "fullName" | "_id" | "username">[]>})

  const showMediaModal = useShowMediaModal()
  const showingMediaModalData = useShowingMediaModalData()

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
      el: ".swiper-pagination",
    },

    // // And if we need scrollbar
    // scrollbar: {
    //   el: '.swiper-scrollbar',
    // },
  })

  function showMediaForPage(page: Pick<PageSearch, "lastMediaData" | "fullName" | "_id" | "username">) {
    showMediaModal.value = true
    if (!!page.lastMediaData.mediaId) {
      showingMediaModalData.value = {
        mediaId: page.lastMediaData.mediaId,
        pageId: page._id
      }
    }
    else {
      showingMediaModalData.value = {
        media: page.lastMediaData,
        pageId: page._id
      }
    }
  }

  onMounted(loadSwiper)
</script>
