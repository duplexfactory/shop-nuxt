<template>
  <div class="mb-16">
    <div class="hidden md:block bg-gray-100">
      <div class="container mx-auto" >
        <div class="whitespace-nowrap overflow-x-auto" style="height: 40px; padding-top: 4px;" ref="categoriesScroll">
          <div v-for="category in ageRestrictedCategories" class="dropdown inline-block" :key="category['id']">
            <div class="py-1 px-8 font-semibold text-gray-500">{{ category['label'] }}</div>
            <ul :style="`transform: translateX(-${dropdownOffset}px)`">
              <li v-for="tag in category.tags"
                  :key="tag.id"
                  @click="$router.push({path: '/search', query: { tag: tag.id }});">
                {{ tag.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="sm:container mx-auto">

      <template v-if="featured.length">
        <h2 class="section-title px-4 md:px-0">精選店鋪</h2>
        <StoreCardSquareSwiperList class="swiper-padding" :shops="featured"></StoreCardSquareSwiperList>
      </template>

      <!--      <StoreCardRectangle v-for="shop in hot" :shop="shop"></StoreCardRectangle>-->

      <div class="px-4 md:px-0">
        <h2 class="section-title">熱門產品</h2>
        <MediaCardSwiperList :lastMediaPage="latest"></MediaCardSwiperList>
      </div>

<!--      <h2 class="section-title px-4 md:px-0">最新貼文</h2>-->

<!--      <div class="px-4 md:px-0" v-if="latest.length">-->
<!--        <h2 class="section-title">熱門產品</h2>-->
<!--        <MediaCardIGEmbedSwiperList :lastMediaPage="latest"></MediaCardIGEmbedSwiperList>-->
<!--      </div>-->

      <div class="px-4 md:px-0" v-if="active.length">
        <h2 class="section-title">活躍店長</h2>
        <StoreCardSimpleSwiperList :shops="active"></StoreCardSimpleSwiperList>
      </div>

      <template v-if="hot.length">
        <h2 class="section-title px-4 md:px-0">熱門店鋪</h2>
        <StoreCardSquareSwiperList class="swiper-padding" :shops="hot"></StoreCardSquareSwiperList>
      </template>

    </div>

  </div>
</template>

<script setup lang="ts">

const {ageRestrictedCategories} = useTags();
const showAgeRestrictedContent = useShowAgeRestrictedContent();

const hot = ref([]);
const active = ref([]);
const latest = ref([]);
const featured = ref([]);


await fetchHomeData();

async function fetchHomeData() {
  const params = {};
  if (showAgeRestrictedContent.value) {
    params["adult"] = true
  }
  const {data} = await useContentKeyedLazyFetch(`/api/home`, {params});
  if (data.value) {
    const {hot: _hot, active: _active, latest: _latest, featured: _featured} = data.value;
    hot.value = _hot;
    active.value = _active;
    latest.value = _latest;
    featured.value = _featured;
  }

  watch(data, (newData) => {
    const {hot: _hot, active: _active, latest: _latest, featured: _featured} = newData;
    hot.value = _hot;
    active.value = _active;
    latest.value = _latest;
    featured.value = _featured;
  })
}

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

<style>

.swiper-padding .swiper, .swiper-padding .swiper-placeholder {
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
  @apply hidden absolute z-60 bg-gray-100;
}

.dropdown:hover ul {
  @apply block;
}

.dropdown ul li {
  transition: .3s;
  @apply px-8 py-2 cursor-pointer text-left;
}

.dropdown ul li:hover {
  @apply bg-white;
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

