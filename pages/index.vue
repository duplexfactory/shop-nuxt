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

const {categories} = useTags();

const showModal = ref(false);

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
      <div class="container mx-auto flex">
        <div v-for="category in categories" class="dropdown" :key="category['id']">
          <div class="py-2 px-8">{{ category['label'] }}</div>
          <ul>
            <li v-for="tag in category.tags" :key="tag.id">{{ tag.label }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="sm:container mx-auto">
      <div class="section-title px-4 md:px-0">熱門店鋪</div>
      <client-only>
        <StoreCardSquareSwiperList class="!px-4 !md:px-0" :shops="hot"></StoreCardSquareSwiperList>
      </client-only>
<!--      <div class="flex">-->
<!--&lt;!&ndash;        1, 2.2, 2.5, 3&ndash;&gt;-->
<!--        <template v-for="(_, i) of Array(Math.ceil(2.2)).fill(0)">-->
<!--          <div class="bg-red-300 w-full"-->
<!--               style="aspect-ratio: 4/3; flex: 1;"-->
<!--               :style="i !== Array(Math.ceil(2.2)).length - 1 ? 'margin-right: 16px;' : ''">-->
<!--          </div>-->
<!--        </template>-->
<!--      </div>-->
      <div class="flex">
        <!--        1, 2.2, 2.5, 3-->
        <template v-for="(_, i) of Array(Math.ceil(2.2)).fill(0)">
          <div class="bg-red-300 w-full"
               style="aspect-ratio: 4/3; flex: 1;"
               :style="i != 0 ? 'padding-left: 32px;' : ''">
            <div class="h-full w-full bg-green-300"></div>
          </div>
        </template>
      </div>
<!--      <div class="flex">-->
<!--        <template v-for="(_, i) of Array(Math.ceil(2.2)).fill(0)">-->
<!--          <div class="bg-red-300 w-full"-->
<!--               style="aspect-ratio: 4/3; flex: 1;"-->
<!--               :style="i !== Array(Math.ceil(2.2)).length - 1 ? 'padding-right: 16px;' : ''">-->
<!--            <div class="h-full w-full bg-green-300"></div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </div>-->

      <!--      <StoreCardRectangle v-for="shop in hot" :shop="shop"></StoreCardRectangle>-->

      <div class="px-4 md:px-0">
        <div class="section-title">最新貼文</div>
        <client-only>
          <MediaCardSwiperList :medias="latest"></MediaCardSwiperList>
        </client-only>
      </div>

      <div class="px-4 md:px-0">
        <div class="section-title">活躍店長</div>
        <client-only>
          <StoreCardSimpleSwiperList :shops="active"></StoreCardSimpleSwiperList>
        </client-only>
      </div>

      <div class="section-title">實體店鋪</div>
      <client-only>
        <StoreCardOfflineSwiperList :shops="physical"></StoreCardOfflineSwiperList>
      </client-only>
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

.dropdown {
  @apply relative;
}

.dropdown ul {
  z-index: 1000;
  @apply hidden absolute bg-gray-50 w-full;
}

.dropdown:hover ul {
  @apply block;
}

.dropdown ul li {
  @apply px-8 py-2 text-center;
}


</style>

