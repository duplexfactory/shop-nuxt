<script setup lang="ts">
import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";
import IgPage from "~/models/IgPage";
import dayjs from "dayjs";

const {tagsLookup} = useTags()
const {media, shop} = defineProps({
  media: Object as PropType<IgMedia>,
  shop: Object as PropType<Partial<IgPage>>,
})

const {
  id,
  code,
  coverImageUrl,
  caption,

  likeCount,
  commentCount,

  takenAt,
} = media;

const takenAtString = dayjs(takenAt * 1000).fromNow();

</script>

<script lang="ts">
import {imageUrl} from "~/utils/imageUrl";

export default {
  methods: {
    imageUrl: imageUrl
  }
}
</script>

<template>
  <div>
    <div class="bg-gray-300 square-image-container rounded-md" :style="`background-image: url(${$encryptImageUrl(imageUrl(code))});`"></div>
    <!--    <div class="bg-gray-300 square-image-container rounded-md" :style="`background-image: url(${$encryptImageUrl(coverImageUrl)});`"></div>-->
    <div style="aspect-ratio: 1.5;" class="pt-2 overflow-hidden flex flex-col">
      <div class="text-sm whitespace-pre-wrap overflow-hidden line-clamp-7" style="flex-shrink: 1;">{{ caption }}</div>
      <div class="mt-2 text-sm text-gray-500 break-all line-clamp-1" style="flex-shrink: 0;">{{ takenAtString + ' • ' + shop.username }}</div>
    </div>

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
