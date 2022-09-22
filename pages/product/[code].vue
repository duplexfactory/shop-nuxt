<template>
  <div class="mb-16">
    <div class="container mx-auto">
      <div class="my-4 md:mt-0">
        <nuxt-link v-if="!!page" :to="`/shop/${page.username}`"
                   class="hover:underline"><i class="spr-angle-left"></i>返回店鋪</nuxt-link>
      </div>

      <MediaDetails :media="media" :page="page"></MediaDetails>
    </div>
  </div>
</template>

<script lang="ts" setup>

import IgMedia from "~/models/IgMedia";
import {PageSearch} from "~/models/PageSearch";
import {notFound} from "~/utils/h3Error";

const config = useRuntimeConfig()
const route = useRoute()

// const {
//   data: mediaCommerceData,
//   error: mediaCommerceDataError
// } = await useContentKeyedFetch('/api/media/commerce-data', {
//   params: {
//     codes: route.params.code
//   }
// })
// if (!!mediaCommerceDataError.value) {
//   throwError(notFound)
// }
// if (!!mediaCommerceData.value && !mediaCommerceData.value.data[route.params.code]) {
//   throwError(notFound)
// }

const media = ref<IgMedia | null>(null)

async function fetchOfficialIfAvailable() {
  if (!!media.value && !!media.value.mediaId) {
    // Crawled using official.
    const { data: officialData } = await useContentKeyedFetch(`/api/media/official/${media.value.pageId}/${media.value.mediaId}`);
    const m: Omit<IgMedia, "price" | "patchPrice"> = officialData.value.media
    media.value = Object.assign({}, media.value, m)
  }
}

const {data: mediaData, pending} = await useContentKeyedLazyFetch(`/api/media/${route.params.code}`)
if (!!mediaData.value && !!mediaData.value.media) {
  media.value = mediaData.value.media as IgMedia
  await fetchOfficialIfAvailable()
}
else {
  watch(mediaData, async () => {
    media.value = mediaData.value.media as IgMedia // Use non official to get official media id.
    await fetchOfficialIfAvailable()
  })
}

const page = ref<PageSearch>(null)
if (!!media.value) {
  const {data: pageData, error} = await useContentKeyedLazyFetch(`/api/shop/id/${media.value.pageId}`)
  if (!!pageData.value && !!pageData.value.page) {
    page.value = pageData.value.page
  }
}
else {
  watch(media, async (newMedia, oldMedia) => {
    if (!!newMedia && !!oldMedia && newMedia.code === oldMedia.code) {
      return
    }
    const {data: pageData, error} = await useContentKeyedFetch(`/api/shop/id/${media.value.pageId}`)
    if (!!pageData.value && !!pageData.value.page) {
      page.value = pageData.value.page
    }
  })
}

</script>

<style scoped>

</style>
