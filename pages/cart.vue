<template>
  <div class="container mx-auto">

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-2">商品</div>
      <div class="col-span-2">單件價格</div>
      <div class="col-span-2">數量</div>
      <div class="col-span-4">優惠</div>
      <div class="col-span-2">小計</div>
    </div>
    <hr/>

    <div v-for="pageId in pageIds" :key="pageId">
      <div v-if="pages[pageId]">{{ pages[pageId].username }}</div>
      <hr/>
      <template v-if="mediasGrouped[pageId]" v-for="media in mediasGrouped[pageId]" :key="media.code">
        <div class="grid grid-cols-12 gap-8 py-2">
          <div class="col-span-2">
            <div class="image-container aspect-square rounded-md overflow-hidden"
                 style="max-width: 90px"
                 v-lazy:background-image="media.mediaUrl || $imageUrl(media.code)"></div>
          </div>
          <div class="col-span-2">{{ formatMediaPrice(media) }}</div>
          <div class="col-span-2">{{ cart.find((item) => item.code === media.code).quantity }}</div>
          <div class="col-span-4">優惠</div>
          <div class="col-span-2">小計</div>
        </div>
        <hr/>
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">

import IgMedia from "~/models/IgMedia"
import type {Ref} from "vue"
import Dict = NodeJS.Dict
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {IgPageCommerceData} from "~/models/IgPageCommerceData";
import IgPage from "~/models/IgPage";
import useMediaPrice from "~/composables/useMediaPrice";

const cart: Ref<{code: string, quantity: number}[]> = ref([])
const pageIds = computed(() => Array( ...new Set(mediaList.value.map((m) => m.pageId))))

const mediaList: Ref<IgMedia[]> = ref([])
const mediasGrouped = computed(() => {
  return mediaList.value.reduce((previous, current) => {
    if (!previous[current.pageId]) {
      previous[current.pageId] = []
    }
    previous[current.pageId].push(current)
    return previous
  }, {} as Dict<IgMedia[]>)
})
async function fetchMedias() {
  const {
    data,
    error
  } = await useFetch("/api/media", {
    params: {
      codes: cart.value.map((item) => item.code).join(",")
    }
  })
  if (!!data.value) {
    const mediasDict = data.value.medias
    mediaList.value = cart.value.map((item) => mediasDict[item.code] || null).filter((item) => item !== null)
  }
}

const mediaCommerceData: Ref<Dict<IgMediaCommerceData>> = ref({})
async function fetchMediaCommerceData() {
  const {
    data,
    error
  } = await useFetch('/api/media/commerce-data', {
    params: {
      ids: cart.value.map((item) => item.code).join(",")
    }
  })
  if (!!data.value) {
    mediaCommerceData.value = data.value["data"]
  }
}

const pages: Ref<Dict<IgPage>> = ref({})
async function fetchPages() {
  const {
    data,
    error
  } = await useFetch('/api/shop', {
    params: {
      ids: pageIds.value.join(",")
    }
  })
  if (!!data.value) {
    pages.value = data.value["pages"]
  }
}

const pageCommerceData: Ref<Dict<IgPageCommerceData>> = ref({})
async function fetchPageCommerceData() {
  await Promise.all(pageIds.value.map(async (s) => {
    const {
      data,
      error
    } = await useFetch(`/api/shop/id/${s}/commerce-data`)
    if (!!data.value) {
      pageCommerceData.value[s] = data.value["commerceData"]
    }
  }))
}

const { formatMediaPrice: _formatMediaPrice } = useMediaPrice();
function formatMediaPrice(media: IgMedia) {
  return _formatMediaPrice(media.patchPrice || media.price || 0)
}

if (!process.server) {
  cart.value = JSON.parse(localStorage.getItem("cart")) || []
}

onMounted(async () => {
  if (!!cart.value.length) {
    await nextTick(async () => {
      await fetchMedias()
      await fetchMediaCommerceData()
      await fetchPages()
      await fetchPageCommerceData()
    })
  }
})

</script>

<style scoped>

</style>