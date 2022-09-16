<template>
  <div class="py-4">
    <template v-for="(_, i) in Array(5)">
      <img v-if="i < review.rating" class="inline-block black-to-yellow-filter" style="width: 28px; height: 28px;" src="~assets/icons/star_filled.png"/>
      <img v-else class="inline-block filter invert-70" style="width: 28px; height: 28px;" src="~assets/icons/star.png"/>
    </template>

    <div class="mt-2 text-lg md:text-xl">
      {{ review.content }}
    </div>

    <div v-if="!!review.imageUrls && review.imageUrls.length" class="mt-2 flex">
      <div v-for="(url, i) in review.imageUrls"
           :key="url"
           @click="clickImage(i)"
           class="mr-2 image-container image-container-clickable aspect-square cursor-pointer"
           style="height: 100px;"
           v-lazy:background-image="url"></div>
    </div>

    <div class="mt-2 text-sm md:text-lg text-gray-400 flex justify-between">
      {{ createdDateString }}
      <button v-if="review.mediaCode && checkMediaButton" @click="$emit('showMedia')">查看相關貼文<i class="spr-angle-right"></i></button>
    </div>
  </div>
</template>
<script lang="ts" setup>

import {PropType} from "vue";
import IgPageReview from "~/models/IgPageReview";
import dayjs from "dayjs";

const {review, checkMediaButton} = defineProps({
  review: Object as PropType<IgPageReview>,
  checkMediaButton: { type: Boolean, default: false },
});

const createdDateString = computed(() => {
  return review != null ? dayjs(review.created).format('DD/MM/YYYY') : 0;
})

const lightBox = useLightBox()
function clickImage(i: number) {
  lightBox.value = {
    imageUrls: review.imageUrls,
    currentIndex: i
  }
}

</script>
