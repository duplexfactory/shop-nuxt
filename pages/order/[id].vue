<template>
  <div class="container mx-auto">
    <div v-if="order">
      <div class="mb-4 border rounded-md p-4">

        <div class="text-center">
          <i class="spr-ok text-6xl text-green-500"></i>
          <div class="font-semibold text-green-500">成功建立訂單！</div>
          <div class="mt-4">
            <div class="text-gray-500">如須離開此頁面，請先複製網址，以便重新瀏覽。</div>
            <button @click="clickCopyLink" class="btn-outline !text-gray-500 !border-gray-500 mt-2">按此複製</button>
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
          <div class="font-semibold">訂單狀態</div>
          <div class="flex">
            <div class="font-semibold mr-2" :class="orderStatusColorClass[order.shops[pageId].orderStatus]">{{ orderStatusToText[order.shops[pageId].orderStatus] }}</div>
            <Popper hover offsetDistance="0" placement="top">
              <i class="spr-info-circled-alt text-gray-600"></i>
              <template #content>
                <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">
                  {{ orderStatusTipText[order.shops[pageId].orderStatus] }}
                </div>
              </template>
            </Popper>
          </div>

          <div class="font-semibold mt-4">訂單内容</div>
          <OrderReceipt v-if="!!order.shops[pageId]" class="col-span-2 mt-2" :orderDetail="order.shops[pageId]"></OrderReceipt>

          <button v-if="[OrderStatus.VERIFICATION_FAILED, OrderStatus.PENDING].includes(order.shops[pageId].orderStatus)"
                  class="btn-primary mt-4"
                  @click="showingPaymentMethodsPageId = pageId">
            {{ order.shops[pageId].orderStatus === OrderStatus.PENDING ? "付款並上傳證明" : "重新上傳證明" }}
          </button>

        </div>

        <hr/>
      </div>

    </div>


    <Teleport to="body">
      <transition name="modal">
        <LazyPaymentModal v-if="!!showingPaymentMethodsPageId"
                          :pageId="showingPaymentMethodsPageId"
                          :orderId="order._id"
                          :amount="pageTotal(showingPaymentMethodsPageId)"
                          :receiver="pages[showingPaymentMethodsPageId].username"
                          @close="showingPaymentMethodsPageId = ''"></LazyPaymentModal>
      </transition>
    </Teleport>

  </div>
</template>
<script setup lang="ts">

import {Order, OrderStatus, MailingType} from "~/models/Order";
import dayjs from "dayjs";
import {discountValue, isFreeMailing as _isFreeMailing} from "~/utils/discountValue";
import {mediaPrice, formatMediaPrice} from "~/utils/mediaPrice";
import {Ref} from "vue";
import IgPage from "~/models/IgPage";
import Dict = NodeJS.Dict;
import {IgPageCommerceData} from "~/models/IgPageCommerceData";
import {orderStatusToText, orderStatusColorClass, mailingTypeToText, orderStatusTipText} from "~/data/commerce";
import {notFound} from "~/utils/h3Error";
import Popper from "vue3-popper";

const route = useRoute()
const nuxt = useNuxtApp()
const config = useRuntimeConfig()

const {data, error} = await useLazyFetch(`/api/order/${route.params.id}`)
if (!!error && !!error.value) {
  throwError(notFound);
}
const order = computed(() => {
  if (!data.value)
    return undefined
  return (data.value as any as {order: Order}).order
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

const showingPaymentMethodsPageId = ref("")

function clickCopyLink() {
  navigator.clipboard.writeText(config.DOMAIN + route.fullPath)
  nuxt.vueApp.$toast.success("已複製此頁面網址至剪貼板，請保存以重新瀏覽！", {position: "top"});
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
