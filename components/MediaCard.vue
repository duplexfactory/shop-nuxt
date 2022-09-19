<template>
  <div>
    <div v-if="!!mediaUrl && isIGVideoUrl(mediaUrl)" class="image-container aspect-square rounded-md overflow-hidden" style="background-color: #000 !important;">
      <video preload="metadata" class="absolute" style="transform: translateY(-50%); top: 50%;">
        <source :src="mediaUrl" type="video/mp4">
        <source :src="mediaUrl" type="video/ogg">
        Your browser does not support the video tag.
      </video>
    </div>
    <div v-else class="image-container aspect-square rounded-md overflow-hidden" v-lazy:background-image="mediaUrl || $imageUrl(code, size)"></div>

    <!-- style="aspect-ratio: 1.5;"  -->
    <div class="pt-2 overflow-hidden flex flex-col">
      <div class="text-sm whitespace-pre-wrap break-words overflow-hidden" :class="'line-clamp-' + contentClamp" style="flex-shrink: 1">{{ caption }}</div>
      <div v-if="!!mediaPrice(media)" class="mt-2 text-pink-700">{{ formatMediaPrice(mediaPrice(media)) }}</div>
      <div class="mt-2 text-sm text-gray-500 break-all line-clamp-1" style="flex-shrink: 0">{{ takenAtString + ' • ' + shop.username }}</div>
    </div>

    <!--    <div class="mt-2 text-sm text-gray-500">{{ storeName }}</div>-->
    <!--    <button class="mt-4 text-white text-base bg-pink-400 px-6 py-2 rounded-md">探索</button>-->
  </div>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";
import dayjs from "dayjs";
import {PageSearch} from "~/models/PageSearch";
import {isIGVideoUrl} from "~/utils/imageUrl";

const nuxt = useNuxtApp()
const {$imageUrl} = nuxt
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
  mediaUrl: _mediaUrl
} = media;
const officialMediaData = ref<Omit<IgMedia, "price" | "patchPrice"> | null>(null)
const mediaUrl = computed(() => {
  return officialMediaData.value ? officialMediaData.value.mediaUrl : _mediaUrl
})

const takenAtString = dayjs(takenAt * 1000).fromNow();

// Media Price
const {
  mediaPrice,
  formatMediaPrice
} = useMediaPrice();

if (shop.igConnected && !_mediaUrl) {
  const Lazyload = nuxt.vueApp.config.globalProperties.$Lazyload
  const errorHandler = async ({bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error}, formCache) => {
    if (src === $imageUrl(code, size)) {
      Lazyload.$off('error', errorHandler)
      Lazyload.$off('loaded', loadedHandler)

      // Retry with official api.
      const { data: officialData } = await useContentKeyedFetch(`/api/media/official/${pageId}/${media.mediaId}`);
      if (officialData.value) {
        officialMediaData.value = officialData.value.media
      }
    }
  }
  const loadedHandler = ({bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error}, formCache) => {
    if (src === $imageUrl(code, size)) {
      Lazyload.$off('error', errorHandler)
      Lazyload.$off('loaded', loadedHandler)
    }
  }
  Lazyload.$on('error', errorHandler)
  Lazyload.$on('loaded', loadedHandler)
}


</script>


