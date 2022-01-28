<script setup lang="ts">

import MediaCardIGEmbed from "~/components/MediaCardIGEmbed.vue";
import MediaCardSwiperList from "~/components/MediaCardSwiperList.vue";

const header = ref('Nuxt 3 starter template')
const {counter} = goSick();

const storeName = 'caseonlyy';

// const res = await useFetch(`/api/shop?id=${storeName}`);
// console.log(res.data.value);

// let res = await fetch(`https://www.instagram.com/${storeName}/?__a=1`);
// res = await res.text();
// const data = JSON.parse(res);

const {data} = await useFetch(`/api/home`);
const {hot, active, latest, physical} = data.value;
const {categories} = useTags();

const showModal = ref(false);

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
          <div v-for="category in categories" class="dropdown inline-block" :key="category['id']">
            <div class="py-1 px-8">{{ category['label'] }}</div>
            <ul :style="`transform: translateX(-${dropdownOffset}px)`">
              <li v-for="tag in category.tags" :key="tag.id">{{ tag.label }}</li>
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
<!--        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4">-->
<!--          <div v-for="media in latest" :key="media.id + '-embed-media-card'" class="col-span-1 overflow-hidden">-->
<!--            <MediaCardIGEmbed></MediaCardIGEmbed>-->
<!--          </div>-->
<!--        </div>-->
        <MediaCardSwiperList :simple-pages="latest"></MediaCardSwiperList>
      </div>

<!--      <div class="px-4 md:px-0">-->
<!--        <div class="section-title">最新貼文</div>-->
<!--        <MediaCardIGEmbedSwiperList :medias="latest"></MediaCardIGEmbedSwiperList>-->
<!--      </div>-->

<!--      <div class="px-4 md:px-0">-->
<!--        <div class="section-title">最新貼文</div>-->
<!--        <MediaCardSwiperList :medias="latest"></MediaCardSwiperList>-->
<!--      </div>-->

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
  @apply px-4 md:px-0;
}

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

