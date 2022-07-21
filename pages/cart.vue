<template>
  <div class="container mx-auto">
    <div v-for="shop in shops" :key="shop">
      {{ mediasGrouped[shop] }}
    </div>
  </div>
</template>

<script setup lang="ts">

import IgMedia from "~/models/IgMedia"
import type {Ref} from "vue"
import Dict = NodeJS.Dict
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {IgPageCommerceData} from "~/models/IgPageCommerceData";

const cart: Ref<{code: string, quantity: number}[]> = ref([])
const shops = computed(() => Array( ...new Set(mediaList.value.map((m) => m.pageId))))

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

const pageCommerceData: Ref<Dict<IgPageCommerceData>> = ref({})
async function fetchPageCommerceData() {
  await Promise.all(shops.value.map(async (s) => {
    const {
      data,
      error
    } = await useFetch(`/api/shop/id/${s}/commerce-data`)
    if (!!data.value) {
      pageCommerceData.value[s] = data.value["commerceData"]
    }
  }))
}

if (!process.server) {
  cart.value = JSON.parse(localStorage.getItem("cart")) || []
}

onMounted(async () => {
  if (!!cart.value.length) {
    await nextTick(async () => {
      await fetchMedias()
      await fetchMediaCommerceData()
      await fetchPageCommerceData()
    })
  }
})

</script>

<style scoped>

</style>