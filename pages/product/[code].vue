<template>
  <div class="mb-16">
    <div class="container mx-auto">
      <MediaDetails v-if="!!media && !!page" :media="media" :page="page"></MediaDetails>
    </div>
  </div>
</template>

<script lang="ts" setup>

import IgMedia from "~/models/IgMedia";
import {PageSearch} from "~/models/PageSearch";
import {notFound} from "~/utils/h3Error";

const config = useRuntimeConfig()
const route = useRoute()

const {
  data: mediaCommerceData,
  error: mediaCommerceDataError
} = await useContentKeyedFetch('/api/media/commerce-data', {
  params: {
    codes: route.params.code
  }
})
if (!!mediaCommerceDataError.value) {
  throwError(notFound)
}
if (!!mediaCommerceData.value && !mediaCommerceData.value.data[route.params.code]) {
  throwError(notFound)
}

const media = ref<IgMedia | null>(null)

async function fetchOfficialIfAvailable() {
  if (!!media.value && !!media.value.mediaId) {
    // Crawled using official.
    const { data } = await useContentKeyedFetch(`/api/media/official/${media.value.pageId}/${media.value.mediaId}`);
    media.value = data.value.media as IgMedia
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
