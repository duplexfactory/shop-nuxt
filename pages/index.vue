<script setup lang="ts">

import {useShowAgeRestrictedContent} from "~/composables/states";

const {ageRestrictedCategories} = useTags();
const showAgeRestrictedContent = useShowAgeRestrictedContent();

async function fetchHomeData() {
  const params = {};
  if (showAgeRestrictedContent.value) {
    params["adult"] = true
  }
  const {data} = await useFetch(`/api/home`, {params});
  const {hot: _hot, active: _active, latest: _latest, physical: _physical} = data.value;
  hot.value = _hot;
  active.value = _active;
  latest.value = _latest;
  physical.value = _physical;
}

const hot = ref([]);
const active = ref([]);
const latest = ref([]);
const physical = ref([]);
fetchHomeData();

watch(
    showAgeRestrictedContent,
    async (show, prevShow) => fetchHomeData()
)

// const header = ref('Nuxt 3 starter template')
// const {counter} = goSick();

// let res = await fetch(`https://www.instagram.com/${storeName}/?__a=1`);
// res = await res.text();
// const data = JSON.parse(res);

// function slideStyle(spaceBetween: number, slidesPerView: number, index: number) {
//   const lastIndex = Math.ceil(slidesPerView) - 1;
//   const marginStyle = index != lastIndex ? `margin-right: ${spaceBetween}px; ` : '';
//   // if (index == lastIndex) {
//   //   return 'height: 100%;';
//   // }
//   return 'aspect-ratio: 4/3; ' + marginStyle + `width: calc(${100 / slidesPerView}% - ${(16 * (slidesPerView - 1) / slidesPerView)}px);`;
// }

</script>

<script lang="ts">
  export default {
    data(): {
      dropdownOffset: number,
      igEmbedLoaded: boolean
    } {
      return {
        dropdownOffset: 0,
        igEmbedLoaded: false
      }
    },
    mounted() {
      // const script = document.createElement("script");
      // script.type = "text/javascript";
      // script.src = "//www.instagram.com/embed.js";
      // document.body.appendChild(script);

      this.$refs.categoriesScroll.onscroll = (_) => {
        this.dropdownOffset = this.$refs.categoriesScroll.scrollLeft
      }
    }
  }
</script>

<template>
  <div class="mb-16">

    <!--<h1 class="rounded-md bg-green-200 text-xl text-green-700 font-bold">-->
    <!--{{ header }}-->
    <!--{{ counter }}-->
    <!--with <a href="https://vueuse.org/" target="_blank">VueUse</a> and <a href="https://windicss.org/" target="_blank">Windi CSS</a>.-->
    <!--</h1>-->
    <!--<p>-->
    <!--Edit <strong>layouts/default.vue</strong> and <strong>windi.config.js</strong>.-->
    <!--</p>-->
    <!--<nuxt-link to="/hello">HEEEEEE</nuxt-link>-->

    <div class="hidden md:block bg-gray-50">
      <div class="container mx-auto" >
        <div class="whitespace-nowrap overflow-x-scroll" style="height: 40px; padding-top: 4px;" ref="categoriesScroll">
          <div v-for="category in ageRestrictedCategories" class="dropdown inline-block" :key="category['id']">
            <div class="py-1 px-8">{{ category['label'] }}</div>
            <ul :style="`transform: translateX(-${dropdownOffset}px)`">
              <li v-for="tag in category.tags" :key="tag.id" @click="$router.push({path: '/search', query: { tag: tag.id }});" style="cursor: pointer;">{{ tag.label }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="sm:container mx-auto">

      <div class="section-title px-4 md:px-0">熱門店鋪</div>
      <StoreCardSquareSwiperList class="swiper-padding" :shops="hot"></StoreCardSquareSwiperList>
      <!--      <StoreCardRectangle v-for="shop in hot" :shop="shop"></StoreCardRectangle>-->

      <div class="px-4 md:px-0">
        <div class="section-title">最新貼文</div>
        <MediaCardSwiperList :simple-pages="latest"></MediaCardSwiperList>
      </div>
      <!--        <MediaCardIGEmbedSwiperList :medias="latest"></MediaCardIGEmbedSwiperList>-->
      <!--        <MediaCardSwiperList :medias="latest"></MediaCardSwiperList>-->

      <div class="px-4 md:px-0">
        <div class="section-title">活躍店長</div>
        <client-only>
          <StoreCardSimpleSwiperList :shops="active"></StoreCardSimpleSwiperList>
        </client-only>
      </div>

      <div class="section-title px-4 md:px-0">實體店鋪</div>
      <StoreCardOfflineSwiperList class="swiper-padding" :shops="physical"></StoreCardOfflineSwiperList>

    </div>

  </div>
</template>

<style>

.swiper-padding .swiper {
  @apply px-4 md:px-0 !important;
}

.swiper-pagination .swiper-pagination-bullet-active {
  @apply bg-pink-400 !important;
}

.swiper-button-next, .swiper-button-prev {
  display: none !important;
  @apply text-pink-400 !important;
}

.swiper-button-next::after, .swiper-button-prev::after {
  font-size: 32px !important;
}

@screen md {
    .swiper:hover .swiper-button-next, .swiper:hover .swiper-button-prev {
        display: flex !important;
    }
}

</style>

<style scoped>

.section-title {
  @apply text-xl mb-3 mt-5;
}

@screen md {
  .section-title {
    @apply text-2xl mb-4 mt-6;
  }
}






.dropdown {
  /*@apply relative;*/
}

.dropdown ul {
  z-index: 1000;
  @apply hidden absolute bg-gray-50;
}

.dropdown:hover ul {
  @apply block;
}

.dropdown ul li {
  @apply px-8 py-2 text-center;
}




::-webkit-scrollbar {
  height: 4px;               /* width of the entire scrollbar */
}

::-webkit-scrollbar-track {
  background: #FAFAFA;        /* color of the tracking area */
}

::-webkit-scrollbar-thumb {
  background-color: lightgray;    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
  border: 0px solid orange;  /* creates padding around scroll thumb */
}

</style>

