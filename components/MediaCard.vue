<script setup lang="ts">
import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";
import IgPage from "~/models/IgPage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const {tagsLookup} = useTags()
const {media, shop} = defineProps({
  media: Object as PropType<IgMedia>,
  shop: Object as PropType<IgPage>,
})

const {
  id,
  coverImageUrl,
  caption,

  likeCount,
  commentCount,

  takenAt,
} = media;

const takenAtString = dayjs(takenAt * 1000).fromNow();

</script>

<template>
  <div>
    <div class="bg-gray-300 square-image-container rounded-md" :style="`background-image: url(${coverImageUrl});`"></div>
    <div class="mt-2 text-sm whitespace-pre-wrap line-clamp-10" >{{ caption }}</div>
    <div class="mt-2 text-sm text-gray-500 break-all line-clamp-1">{{ takenAtString + ' • ' + shop.username }}</div>
<!--    <div class="mt-2 text-sm text-gray-500">{{ storeName }}</div>-->
<!--    <button class="mt-4 text-white text-md bg-pink-400 px-6 py-2 rounded-md">探索</button>-->
  </div>
</template>

<style>
.square-image-container {
  aspect-ratio: 1;
  @apply bg-center bg-cover;
}
</style>
