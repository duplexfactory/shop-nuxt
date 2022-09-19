<template>
  <LazyModal class="text-gray-800" modalContainerClass="!w-full" @close="close">
    <template #body>
      <div>
        <MediaDetails :media="localMedia" :page="localPage" class="pb-8 px-4"></MediaDetails>
      </div>
    </template>
  </LazyModal>
</template>

<script setup lang="ts">

import IgPageReview from "~/models/IgPageReview"

import {computed} from "@vue/reactivity"
import PageInfoRow from "~/models/PageInfoRow"

import Popper from "vue3-popper"
import type {Ref} from "vue"
import IgMedia from "~/models/IgMedia"
import IgPage from "~/models/IgPage"
import IgPageExtraData from "~/models/IgPageExtraData"
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData"
import {IgPageCommerceData} from "~/models/IgPageCommerceData"
import {isIGVideoUrl} from "~/utils/imageUrl";
import {SimpleIgPage} from "~/models/SimpleIgPage";

const nuxt = useNuxtApp()
const router = useRouter()
const route = useRoute()

// Media Modal
const showMediaModal = useShowMediaModal()
const showingMediaModalData = useShowingMediaModalData()

const localPageId = computed(() => {
  return showingMediaModalData.value.simplePage?._id || showingMediaModalData.value.pageId
})
const fetchedPage = ref(null)
const localPage = computed<SimpleIgPage>(() => {
  return showingMediaModalData.value.simplePage || fetchedPage.value
})

const localMediaCode = computed(() => {
  return showingMediaModalData.value.media?.code || showingMediaModalData.value.code
})
const localMediaId = computed(() => {
  return showingMediaModalData.value.media?.mediaId || showingMediaModalData.value.mediaId
})
const fetchedMedia: Ref<IgMedia | null> = ref(null)
const localMedia = computed(() => {
  return showingMediaModalData.value.media || fetchedMedia.value
})

function close() {
  // resetCreateReview()
  // isShowingCreateReview.value = false
  // reviews.value = []

  showMediaModal.value = false
}

watch(() => route.fullPath, () => {
  close()
})

// Mounted
onMounted(async () => {

  // Init data on modal open
  let code = ''
  let officialMedia: Omit<IgMedia, "price" | "patchPrice"> | null
  if (!!localMediaId.value) {
    // Official must be available.
    const { data: officialData } = await useContentKeyedFetch(`/api/media/official/${localPageId.value}/${localMediaId.value}`)
    officialMedia = officialData.value.media
    code = officialMedia.code
  }
  if (!!localMediaCode.value) {
    code = localMediaCode.value
  }
  if (!!code && !localMedia.value) {
    const {data, pending} = await useContentKeyedFetch(`/api/media/${code}`)
    fetchedMedia.value = data.value.media
  }
  if (!!fetchedMedia.value && !!fetchedMedia.value.mediaId && !officialMedia) {
    // Get official if available.
    const { data: officialData } = await useContentKeyedFetch(`/api/media/official/${localPageId.value}/${fetchedMedia.value.mediaId}`);
    officialMedia = officialData.value.media
  }
  if (!!officialMedia) {
    if (!!showingMediaModalData.value.media) {
      showingMediaModalData.value.media = Object.assign({}, showingMediaModalData.value.media, officialMedia)
    }
    if (!!fetchedMedia.value) {
      fetchedMedia.value = Object.assign({}, fetchedMedia.value, officialMedia)
    }
  }

  if (!localPage.value) {
    const {data, error} = await useContentKeyedFetch(`/api/shop/id/${showingMediaModalData.value.pageId}`)
    if (!error.value) {
      fetchedPage.value = data.value.page
    }
  }

})

</script>


