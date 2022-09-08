<template>
  <LazyModal class="text-gray-800" modalContainerClass="!w-full" @close="close">
    <template #body>
      <div>
        <MediaDetails v-if="!!localMedia && !!localPage" :media="localMedia" :page="localPage"
                      class="pb-8 px-4"></MediaDetails>
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

const fetchedPage = ref(null)
const localPage = computed<SimpleIgPage>(() => {
  return showingMediaModalData.value.simplePage || fetchedPage.value
})

const localMediaCode = computed(() => {
  return showingMediaModalData.value.media?.code || showingMediaModalData.value.code
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
  if (!localMedia.value) {
    const {data, pending} = await useContentKeyedFetch(`/api/media/${localMediaCode.value}`)
    fetchedMedia.value = data.value.media
  }

  if (!localPage.value) {
    const {data, error} = await useContentKeyedFetch(`/api/shop/id/${showingMediaModalData.value.pageId}`)
    if (!error.value) {
      fetchedPage.value = data.value.page
    }
  }

})

</script>


