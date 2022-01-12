<script setup>
const header = ref('Nuxt 3 starter template')
const {counter} = goSick();

const storeName = 'caseonlyy';

// const res = await useFetch(`/api/shop?id=${storeName}`);
// console.log(res.data.value);

// let res = await fetch(`https://www.instagram.com/${storeName}/?__a=1`);
// res = await res.text();
// const data = JSON.parse(res);

const {data} = await useFetch(`/api/home`);
const {hot, active, latest} = data.value;
// const lastActiveDate = new Date(res.data.value.lastActive);
const lastActiveDate = new Date(); // Dummy
const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth() + 1}/${lastActiveDate.getFullYear()}`;

// const description = res.data.value.description;
const description = 'description'; // Dummy

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

    <div class="container mx-auto">

      <div class="section-title">熱門店鋪</div>
      <StoreCardSquareSwiperList></StoreCardSquareSwiperList>

      <div class="section-title">最新產品</div>

      <div class="section-title">活躍店長</div>
      <StoreCardSimpleSwiperList></StoreCardSimpleSwiperList>

      <div class="section-title">實體店鋪</div>
    </div>

  </div>
</template>

<style>
.section-title {
  @apply text-2xl mb-4 mt-6;
}

.swiper-pagination .swiper-pagination-bullet-active {
  /*background-color: black;*/
  @apply bg-pink-400;
}

.swiper-button-next, .swiper-button-prev {
  @apply text-pink-400;
}
</style>

