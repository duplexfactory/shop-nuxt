<script setup lang="ts">
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

const {categories} = useTags()

</script>

<template>
  <div>
    <!--<h1 class="rounded-md bg-green-200 text-xl text-green-700 font-bold">-->
    <!--{{ header }}-->
    <!--{{ counter }}-->
    <!--with <a href="https://vueuse.org/" target="_blank">VueUse</a> and <a href="https://windicss.org/" target="_blank">Windi CSS</a>.-->
    <!--</h1>-->
    <!--<p>-->
    <!--Edit <strong>layouts/default.vue</strong> and <strong>windi.config.js</strong>.-->
    <!--</p>-->
    <!--<nuxt-link to="/hello">HEEEEEE</nuxt-link>-->

    <div class="bg-gray-50">
      <div class="container mx-auto flex py-2">
        <div v-for="category in categories" :key="category['id']" class="px-8">
          {{ category['label'] }}
        </div>
      </div>
    </div>

    <div class="sm:container mx-auto">
      <div class="section-title px-4 md:px-0">熱門店鋪</div>
      <StoreCardSquareSwiperList class="!px-4 !md:px-0" :shops="hot"></StoreCardSquareSwiperList>
      <!--      <StoreCardRectangle v-for="shop in hot" :shop="shop"></StoreCardRectangle>-->

      <div class="px-4 md:px-0">
        <div class="section-title">最新貼文</div>
        <MediaCardSwiperList :medias="latest"></MediaCardSwiperList>
      </div>

      <div class="px-4 md:px-0">
        <div class="section-title">活躍店長</div>
        <StoreCardSimpleSwiperList :shops="active"></StoreCardSimpleSwiperList>
      </div>

      <div class="section-title">實體店鋪</div>
      <StoreCardOfflineSwiperList :shops="physical"></StoreCardOfflineSwiperList>

    </div>

  </div>
</template>

<style>

.section-title {
  @apply text-xl mb-3 mt-5;
}

@screen md {
  .section-title {
    @apply text-2xl mb-4 mt-6;
  }
}

.swiper-pagination .swiper-pagination-bullet-active {
  /*background-color: black;*/
  @apply bg-pink-400;
}

.swiper-button-next, .swiper-button-prev {
  @apply text-pink-400;
}
</style>

