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

    <div v-if="!loading" v-for="pageId in pageIds" :key="pageId">
      <div v-if="pages[pageId]">{{ pages[pageId].username }}</div>
      <hr/>
      <template v-if="mediasGrouped[pageId]" v-for="media in mediasGrouped[pageId]" :key="media.code">
        <div class="grid grid-cols-12 gap-8 py-2">
          <div class="col-span-2">
            <div class="image-container aspect-square rounded-md overflow-hidden"
                 style="max-width: 90px"
                 v-lazy:background-image="media.mediaUrl || $imageUrl(media.code)"></div>
          </div>
          <div class="col-span-2">{{ formatMediaPrice(mediaPrice(media)) }}</div>
          <div class="col-span-2">
            <QuantityInput v-model.number="cart.find((item) => item.code === media.code).quantity" @change="saveCart"></QuantityInput>
<!--            <QuantityInput :modelValue="cart.find((item) => item.code === media.code).quantity"-->
<!--                           @update:modelValue="event => cart.find((item) => item.code === media.code).quantity = event"></QuantityInput>-->
<!--            {{ cart.find((item) => item.code === media.code).quantity }}-->
          </div>
          <div class="col-span-4">
            <DiscountCard v-if="mediaCommerceData[media.code].discount && (mediaDiscountTotalValue(pageId) > pageDiscountValue(pageId))"
                          defaultTitle="產品優惠"
                          discounTextPrefix="此產品買"
                          :discount="mediaCommerceData[media.code].discount"></DiscountCard>
          </div>
          <div class="col-span-2">
            {{ formatMediaPrice(mediaPrice(media) * cart.find((item) => item.code === media.code).quantity
              - (mediaCommerceData[media.code].discount && mediaDiscountTotalValue(pageId) > pageDiscountValue(pageId) ? mediaDiscountValue(media.code) : 0)) }}
          </div>
        </div>
        <hr/>
      </template>
      <div v-if="pageCommerceData[pageId].discount && (pageDiscountValue(pageId) > mediaDiscountTotalValue(pageId)) && (pageDiscountValue(pageId) !== 0)"
           class="grid grid-cols-12 gap-8">
        <div class="col-span-6"></div>
        <div class="col-span-4">
          <DiscountCard defaultTitle="店鋪優惠"
                        discounTextPrefix="全店買"
                        :discount="pageCommerceData[pageId].discount"></DiscountCard>
        </div>
        <div class="col-span-2">
          {{ "-" + formatMediaPrice(pageDiscountValue(pageId)) }}
        </div>
      </div>
      <div class="grid grid-cols-12 gap-8 bg-gray-100">
        <div class="p-4 col-span-10">
          <div>給店鋪留言</div>
          <textarea v-model="notes[pageId]"
                    placeholder="e.g. 產品大小、顔色、訂製内容。提交訂單後，店鋪可以看到此内容，可先與店鋪查詢。（選填）"
                    class="w-full border rounded-md p-2" rows="4">
          </textarea>
        </div>
        <div class="col-span-2">

        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">

import IgMedia from "~/models/IgMedia"
import type {Ref} from "vue"
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {IgPageCommerceData} from "~/models/IgPageCommerceData";
import IgPage from "~/models/IgPage";
import useMediaPrice from "~/composables/useMediaPrice";
import {DiscountType, ThresholdType} from "~/models/Discount";
import Dict = NodeJS.Dict;
import {discountValue} from "~/utils/discountValue";

const cart: Ref<{code: string, quantity: number}[]> = ref([])
const pageIds = computed(() => Array( ...new Set(mediaList.value.map((m) => m.pageId))))

const mediaDict: Ref<Dict<IgMedia>> = ref({})
const mediaList: Ref<IgMedia[]> = computed(() => cart.value.map((item) => mediaDict.value[item.code] || null).filter((item) => item !== null))
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
    mediaDict.value = data.value.medias
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

const {
  formatMediaPrice,
  mediaPrice
} = useMediaPrice();

if (!process.server) {
  cart.value = JSON.parse(localStorage.getItem("cart")) || []
}

const loading = ref(false)
onMounted(async () => {
  if (!!cart.value.length) {
    await nextTick(async () => {
      loading.value = true
      await fetchMedias()
      await fetchMediaCommerceData()
      await fetchPages()
      await fetchPageCommerceData()
      loading.value = false
    })
  }
})

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart.value));
}



function mediaDiscountValue(code: string) {
  const media = mediaDict.value[code]
  const price = mediaPrice(media)
  const quantity = cart.value.find((item) => item.code === code).quantity
  return discountValue(mediaCommerceData.value[code].discount, price * quantity, quantity)
}

function mediaDiscountTotalValue(pageId: string) {
  const medias = mediasGrouped.value[pageId]
  return medias.map((m) => mediaDiscountValue(m.code)).reduce((previous, current) => previous += current, 0)
}

function pageDiscountValue(pageId: string) {
  const medias = mediasGrouped.value[pageId]
  const price = medias.map((m) => mediaPrice(m) * cart.value.find((item) => item.code === m.code).quantity)
      .reduce((previous, current) => previous += current, 0)
  const quantity = medias.map((m) => cart.value.find((item) => item.code === m.code).quantity).reduce((previous, current) => previous += current, 0)
  return discountValue(pageCommerceData.value[pageId].discount, price, quantity)
}

const notes = ref({})

</script>

<style scoped>

</style>