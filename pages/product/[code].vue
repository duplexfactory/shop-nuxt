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

const {data: mediaData, pending} = await useContentKeyedLazyFetch(`/api/media/${route.params.code}`)
const media = computed<IgMedia | null>(() => {
  if (!!mediaData.value && !!mediaData.value.media)
    return mediaData.value.media as IgMedia
  return null
})

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