<script setup lang="ts">
import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";

const {tagsLookup} = useTags()
const {media} = defineProps({
  media: Object as PropType<IgMedia>
})

const {
  id,
  coverImageUrl,
  caption,

  likeCount,
  commentCount,

  takenAt,
} = media;
// const lastActiveDate = new Date(lastActivity * 1000);
// const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth() + 1}/${lastActiveDate.getFullYear()}`;
// const description = 'description';
</script>

<template>
  <div class="p-4">
    <div class="bg-gray-300 rounded-md" style="aspect-ratio: 1;"></div>
    <div class="mt-2 whitespace-pre-wrap" >{{ caption }}</div>
<!--    <div class="mt-2 text-sm text-gray-500">{{ storeName }}</div>-->
    <button class="mt-4 text-white text-md bg-pink-400 px-6 py-2 rounded-md">探索</button>
  </div>
</template>

<style>
.square-image-container {
  aspect-ratio: 1;
  @apply bg-center bg-cover;
}
</style>
