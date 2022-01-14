<script setup lang="ts">
import {PropType} from "vue";
import IgPage from '~/models/IgPage';

const {tagsLookup} = useTags()
const {shop} = defineProps({
  shop: Object as PropType<IgPage>
})

const {
  username,
  lastActivity,
  followerCount,
  mediaCount,
  mediaUrls,
  profilePicUrl,
  tags
} = shop;
const lastActiveDate = new Date(lastActivity * 1000);
const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth() + 1}/${lastActiveDate.getFullYear()}`;
const description = 'description';
</script>

<template>
  <div class="overflow-hidden border rounded-md grid grid-cols-2">
    <div class="p-4 col-span-1">
      <div class="relative h-full">
        <div class="bg-gray-300 rounded-full square-image-container" :style="`background-image: url(${profilePicUrl});`" style="height: 60px;"></div>

        <div class="mt-1 2xl:mt-2 overflow-hidden">
          <div class="font-semibold text-lg truncate">{{ username }}</div>
          <div class="text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>
        </div>

        <div class="mt-2 2xl:mt-4 text-sm text-gray-500">
          <div>門市</div>
          <div>旺角、銅鑼灣</div>
        </div>

        <div class="mt-2 2xl:mt-4"
             style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; /* number of lines to show */ -webkit-box-orient: vertical; font-size: 0;">
          <tag v-for="tag in tags"
               :key="tag"
               class="mr-1 2xl:mr-2"
               :title="tagsLookup[tag]"></tag>
        </div>

        <div class="flex flex-row absolute" style="bottom: 0px;">
          <button class="mt-2 2xl:mt-4 btn-primary">進入店鋪</button>
          <button class="mt-2 2xl:mt-4 btn-outline ml-4" style="padding: 0px !important;">進</button>
        </div>

      </div>
    </div>

    <div class="col-span-1">
      <div class="bg-gray-300 square-image-container" :style="`background-image: url(${mediaUrls[0]});`"></div>
      <div class="bg-white" style="height: 2px;"/>
      <div class="block lg:flex flex-row">
        <div class="bg-red-300 square-image-container" style="flex: 1;" :style="`background-image: url(${mediaUrls[1]});`"></div>
        <div style="width: 2px;"></div>
        <div class="bg-green-300 square-image-container" style="flex: 1;" :style="`background-image: url(${mediaUrls[2]});`"></div>
      </div>
    </div>
  </div>
</template>

<style>
.square-image-container {
  aspect-ratio: 1;
  @apply bg-center bg-cover;
}
</style>

