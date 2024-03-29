<template>
  <div class="container mx-auto mt-4 md:mt-0">
    <div v-if="order">
      <div class="mb-4 border rounded-md p-4">

        <div v-if="route.query.checkout" class="text-center mb-4">
          <i class="spr-ok text-6xl text-green-500"></i>
          <div class="font-semibold text-green-500">成功建立訂單！</div>
          <div class="mt-4">
            <div class="text-gray-500">如須離開此頁面，請先複製網址，以便重新瀏覽。</div>
            <button @click="clickCopyLink" class="btn-outline !text-gray-500 !border-gray-500 mt-2">按此複製</button>
          </div>
        </div>

        <div class="font-semibold">訂單資訊</div>
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
            <client-only>
              <Popper hover offsetDistance="0" placement="top">
                <i class="spr-info-circled-alt text-gray-600"></i>
                <template #content>
                  <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">
                    {{ orderStatusTipText[order.shops[pageId].orderStatus] }}
                  </div>
                </template>
              </Popper>
            </client-only>
          </div>

          <div class="font-semibold mt-4">訂單内容</div>
          <OrderReceipt v-if="!!order.shops[pageId]"
                        class="col-span-2 mt-2"
                        :orderDetail="order.shops[pageId]"
                        :orderCreated="order.created"
                        :pageId="pageId"></OrderReceipt>

          <button v-if="[OrderStatus.VERIFICATION_FAILED, OrderStatus.PENDING].includes(order.shops[pageId].orderStatus)"
                  class="btn-primary mt-4"
                  @click="showingPaymentMethodsPageId = pageId">
            {{ order.shops[pageId].orderStatus === OrderStatus.PENDING ? "付款並上傳證明" : "重新上傳證明" }}
          </button>

        </div>
      </div>

    </div>
    <transition name="modal">
      <LazyPaymentModal v-if="!!showingPaymentMethodsPageId"
                        :pageId="showingPaymentMethodsPageId"
                        :orderId="order._id"
                        :amount="pageTotal(order.shops[showingPaymentMethodsPageId])"
                        :receiver="pages[showingPaymentMethodsPageId].username"
                        @submit="submitPayment"
                        @close="showingPaymentMethodsPageId = ''"></LazyPaymentModal>
    </transition>
  </div>
</template>
<script setup lang="ts">

import {Order, OrderStatus, MailingType} from "~/models/Order";
import dayjs from "dayjs";
import {discountValue, pageDiscountValue, pageTotal} from "~/utils/discountValue";
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

const {data, refresh, error} = await useContentKeyedLazyFetch(`/api/order/${route.params.id}`)
if (!!error && !!error.value) {
  throwError(notFound);
}
const order = computed(() => {
  if (!data.value)
    return undefined
  return (data.value as any as {order: Order}).order
})

const pageIds = computed(() => !order.value ? [] : Object.keys(order.value.shops))
const createdDateText = computed(() => {
  return dayjs((order.value?.created ?? 0)).format('DD/MM/YYYY');
})

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
  } = await useContentKeyedFetch('/api/shop', {
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
  navigator.clipboard.writeText(config.DOMAIN + route.path)
  nuxt.$toast.success("已複製此頁面網址至剪貼板，請保存以重新瀏覽！");
}

function submitPayment() {
  // Refresh after submitting.
  refresh()
}

</script>
<style scoped>
</style>
