<template>
  <div>
    <div class="image-container aspect-square rounded-md overflow-hidden" v-lazy:background-image="mediaUrl || $imageUrl(code, size)"></div>

    <!-- style="aspect-ratio: 1.5;"  -->
    <div class="pt-2 overflow-hidden flex flex-col">
      <div class="text-sm whitespace-pre-wrap overflow-hidden" :class="'line-clamp-' + contentClamp" style="flex-shrink: 1;">{{ caption }}</div>
      <div v-if="!!mediaPrice(media)" class="mt-2 text-pink-700">{{ formatMediaPrice(mediaPrice(media)) }}</div>
      <div class="mt-2 text-sm text-gray-500 break-all line-clamp-1" style="flex-shrink: 0;">{{ takenAtString + ' • ' + shop.username }}</div>
    </div>

    <!--    <div class="mt-2 text-sm text-gray-500">{{ storeName }}</div>-->
    <!--    <button class="mt-4 text-white text-md bg-pink-400 px-6 py-2 rounded-md">探索</button>-->
  </div>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";
import dayjs from "dayjs";
import {PageSearch} from "~/models/PageSearch";

const {tagsLookup} = useTags()
const {media, shop, size} = defineProps({
  media: Object as PropType<IgMedia>,
  shop: Object as PropType<Partial<PageSearch>>,
  size: {type: String, default: "m"}, // m or l
  contentClamp: {type: String, default: "7"} // Can be "none"
})

const {
  pageId,
  code,
  caption,

  takenAt,

  price,
  mediaUrl
} = media;

const takenAtString = dayjs(takenAt * 1000).fromNow();

// Media Price
const {
  mediaPrice,
  formatMediaPrice
} = useMediaPrice();

</script>


