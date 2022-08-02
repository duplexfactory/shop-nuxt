<template>
  <div class="container mx-auto">
    <div v-if="order">
      <div class="mb-4 border rounded-md p-4">

        <div class="text-center">
          <i class="spr-ok text-6xl text-green-500"></i>
          <div class="font-semibold text-green-500">成功建立訂單！</div>
          <div class="mt-4">
            <div class="text-gray-500">如須離開此頁面，請先複製網址，以便重新瀏覽。</div>
            <button class="btn-outline !text-gray-500 !border-gray-500 mt-2">按此複製</button>
          </div>
        </div>

        <div class="font-semibold mt-4">訂單資訊</div>
        <div>訂單號碼: {{ order._id }}</div>
        <div>訂單日期: {{ createdDateText }}</div>

        <div class="mt-4">
          <div class="font-semibold">付款須知</div>
          <ol class="list-decimal list-inside">
            <li>如訂單內的貨品來自多於一間店鋪，請分別付款並上傳證明給各店鋪。</li>
<!--            <li>請於24小時內上載入數紀錄，逾時訂單將會取消。</li>-->
          </ol>
        </div>

      </div>

      <div v-for="pageId in pageIds" :key="pageId" class="mb-4 border rounded-md">
        <div class="px-4 py-2 bg-gray-100">
          <nuxt-link v-if="pages[pageId]" class="hover:underline font-semibold" :to="`/shop/${pages[pageId].username}`">
            {{ pages[pageId].username }}
          </nuxt-link>
        </div>
        <div class="p-4">
          <div>
            <div class="font-semibold">店鋪資訊</div>
            <div>給店鋪留言：<span>{{ order.shops[pageId].note ?? "-" }}</span></div>
            <div>店鋪總計：{{ formatMediaPrice(pageTotal(pageId)) }}<span>{{ !isFreeMailing(pageId) && order.shops[pageId].mailing.payOnArrive ? "（未含到付郵費）" : "" }}</span></div>
          </div>

          <div class="mt-4">
            <div class="font-semibold">郵寄方法</div>
            <div>
              {{ order.shops[pageId].mailing }}
              <template v-if="isFreeMailing(pageId)">
                免郵
              </template>
              <template v-else>
                <div v-if="order.shops[pageId].mailing.payOnArrive">
                  到付
                </div>
                <div v-if="!!order.shops[pageId].mailing.cost">
                  {{ formatMediaPrice(order.shops[pageId].mailing.cost) }}
                </div>
              </template>
            </div>
          </div>

          <button class="btn-primary mt-4">付款並上傳證明</button>

        </div>


        <hr/>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">

import {Order} from "~/models/Order";
import dayjs from "dayjs";
import {discountValue, isFreeMailing as _isFreeMailing} from "~/utils/discountValue";
import {mediaPrice, formatMediaPrice} from "~/utils/mediaPrice";
import {Ref} from "vue";
import IgPage from "~/models/IgPage";
import Dict = NodeJS.Dict;

const route = useRoute()

const {data, error} = await useLazyFetch(`/api/order/${route.params.id}`)
const order = computed(() => {
  if (!data.value)
    return undefined
  return (data.value as {order: Order}).order
})

const pageIds = computed(() => !order.value ? [] : Object.keys(order.value.shops))
const createdDateText = dayjs((order.value?.created ?? 0)).format('DD/MM/YYYY');

const pages: Ref<Dict<IgPage>> = ref({})
if (!!pageIds.value.length) {
  fetchPages()
}
else {
  watch(pageIds, fetchPages)
}
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

// Price calculation
function pageDiscountValue(pageId: string) {
  const medias = order.value.shops[pageId].medias
  const price = medias.map((m) => mediaPrice(m) * m.quantity - discountValue(m.discount, m.price * m.quantity, m.quantity))
      .reduce((previous, current) => previous += current, 0)
  const quantity = medias.map((m) => m.quantity).reduce((previous, current) => previous += current, 0)
  return discountValue(order.value.shops[pageId].discount, price, quantity)
}

function isFreeMailing(pageId: string) {
  const medias = order.value.shops[pageId].medias
  const price = medias.map((m) => mediaPrice(m) * m.quantity - discountValue(m.discount, m.price * m.quantity, m.quantity))
      .reduce((previous, current) => previous += current, 0) - pageDiscountValue(pageId)
  const quantity = medias.map((m) => m.quantity).reduce((previous, current) => previous += current, 0)
  return _isFreeMailing(order.value.shops[pageId].mailingDiscount, price, quantity)
}

function pageTotal(pageId: string) {
  const medias = order.value.shops[pageId].medias
  const price = medias.map((m) => mediaPrice(m) * m.quantity - discountValue(m.discount, m.price * m.quantity, m.quantity))
      .reduce((previous, current) => previous += current, 0)
  const mailing = isFreeMailing(pageId) ? 0 : (order.value.shops[pageId].mailing.cost ?? 0)
  return Math.max(price - pageDiscountValue(pageId) + mailing, 0)
}

</script>
<style scoped>
</style>
