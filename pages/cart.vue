<template>
  <div class="container mx-auto">
    <div v-if="!loading" v-for="pageId in pageIds" :key="pageId" class="my-4 border rounded-md">
      <div class="px-4 bg-gray-100">
        <div class="py-2">
          <nuxt-link v-if="pages[pageId]" class="hover:underline font-semibold" :to="`/shop/${pages[pageId].username}`">
            {{ pages[pageId].username }}
          </nuxt-link>
        </div>
        <hr/>
        <div class="grid grid-cols-12 gap-8 py-2">
          <div class="col-span-6">商品</div>
          <div class="col-span-2">單件價格</div>
          <div class="col-span-2">數量</div>
          <div class="col-span-2">小計</div>
        </div>
        <hr/>
      </div>
      <div class="px-4">
        <template v-if="mediasGrouped[pageId]" v-for="media in mediasGrouped[pageId]" :key="media.code">
          <div class="grid grid-cols-12 gap-4 lg:gap-8 pt-4">
            <div class="col-span-4 lg:col-span-6">
              <div class="image-container aspect-square rounded-md overflow-hidden"
                   style="max-width: 90px"
                   v-lazy:background-image="media.mediaUrl || $imageUrl(media.code)"></div>
            </div>
            <div class="col-span-2">{{ formatMediaPrice(mediaPrice(media)) }}</div>
            <div class="col-span-3 lg:col-span-2">
              <QuantityInput v-model.number="cart.find((item) => item.code === media.code).quantity" @change="saveCart"></QuantityInput>
            </div>
            <div class="col-span-3 lg:col-span-2">
              {{ formatMediaPrice(mediaPrice(media) * cart.find((item) => item.code === media.code).quantity - mediaDiscountValue(media.code)) }}
            </div>
          </div>

          <div v-if="mediaCommerceData[media.code].discount"
               class="grid grid-cols-12 gap-4 lg:gap-8 pt-4">
            <div class="col-span-9 lg:col-span-10">
              <div class="flex w-full items-center">
                <div class="mr-4 text-gray-600">
                  <i :class="mediaDiscountValue(media.code) === 0 ? 'spr-cancel' : 'spr-ok'" class="pr-1"></i>
                  {{ mediaDiscountValue(media.code) === 0 ? "未符合" : "已符合" }}
                </div>
                <DiscountCard defaultTitle="產品優惠"
                              discountTextPrefix="此產品買"
                              singleLine
                              :discount="mediaCommerceData[media.code].discount" class="flex-1"></DiscountCard>
              </div>
            </div>
          </div>

          <hr class="mt-4"/>
        </template>

        <template v-if="pageCommerceData[pageId].discount">
          <div class="grid grid-cols-12 gap-4 lg:gap-8 py-4">
            <div class="col-span-9 lg:col-span-10">
              <div class="font-semibold">店鋪優惠</div>
              <div class="flex w-full items-center">
                <div class="mr-4 text-gray-600">
                  <i :class="pageDiscountValue(pageId) === 0 ? 'spr-cancel' : 'spr-ok'" class="pr-1"></i>
                  {{ pageDiscountValue(pageId) === 0 ? "未符合" : "已符合" }}
                </div>
                <DiscountCard defaultTitle="店鋪優惠"
                              discountTextPrefix="全店買"
                              singleLine
                              :discount="pageCommerceData[pageId].discount" class="mt-4 flex-1"></DiscountCard>
              </div>
            </div>
            <div class="col-span-3 lg:col-span-2">
              {{ pageDiscountValue(pageId) === 0 ? "" : ("-" + formatMediaPrice(pageDiscountValue(pageId))) }}
            </div>
          </div>
          <hr/>
        </template>

        <template v-if="!!pageCommerceData && !!pageCommerceData[pageId]">
          <div class="grid grid-cols-12 gap-4 lg:gap-8 py-4">
            <div class="col-span-9 lg:col-span-10">
              <div class="font-semibold">郵寄方法及優惠</div>
              <div class="flex items-center mt-4">
                <lazy-spr-select v-model="selectedMailingIndex[pageId]">
                  <option value="" disabled>請選擇郵寄方法</option>
                  <option v-for="(m, i) in pageCommerceData[pageId].mailing" :key="'mailing-method-' + m.type"
                          :value="i">{{ m.type === MailingType.OTHERS ? m.title : mailingTypeToText[m.type] }}</option>
                </lazy-spr-select>
              </div>
              <div v-if="selectedMailingIndex[pageId] !== '' && pageCommerceData[pageId].mailing[selectedMailingIndex[pageId]].type !== MailingType.OTHERS"
                   class="mt-4">
                {{ selectedMailing(pageId).title }}
              </div>

              <div v-if="pageCommerceData[pageId].mailingDiscount" class="flex w-full items-center mt-4">
                <div class="mr-4 text-gray-600">
                  <i :class="!isFreeMailing(pageId) ? 'spr-cancel' : 'spr-ok'" class="pr-1"></i>
                  {{ !isFreeMailing(pageId) ? "未符合" : "已符合" }}
                </div>
                <div class="bg-yellow-100 px-4 py-2 rounded-md flex-1">
                  <p>
                    <span class="text-gray-600">{{ pageCommerceData[pageId].mailingDiscount.title ?? "免郵優惠" }}</span>
                    <span class="text-gray-600 mx-2">-</span>
                    <span class="font-semibold">{{ mailingDiscountToText(pageCommerceData[pageId].mailingDiscount) }}</span>
                  </p>
                </div>
              </div>

            </div>
            <div class="col-span-3 lg:col-span-2">
              <template v-if="isFreeMailing(pageId)">
                免郵
              </template>
              <template v-else-if="!!selectedMailing(pageId)">
                <div v-if="selectedMailing(pageId).payOnArrive">
                  到付
                </div>
                <div v-if="!!selectedMailing(pageId).cost">
                  {{ formatMediaPrice(selectedMailing(pageId).cost) }}
                </div>
              </template>

            </div>
          </div>
          <hr/>
<!--          <div class="grid grid-cols-12 gap-4 lg:gap-8 py-4">-->
<!--            <div class="col-span-9 lg:col-span-10">-->
<!--              <div class="flex items-center">-->
<!--                <div class="mr-4">付款方法</div>-->
<!--                <lazy-spr-select v-model="selectedPaymentIndex[pageId]">-->
<!--                  <option value="" disabled>付款方法</option>-->
<!--                  <option v-for="(method, i) in pageCommerceData[pageId].paymentMethodData.map((d) => d.method)" :key="'payment-method-' + method"-->
<!--                          :value="i">{{ paymentMethodsToText[method] }}</option>-->
<!--                </lazy-spr-select>-->
<!--              </div>-->
<!--              <template v-if="!!selectedPaymentMethodData(pageId)">-->
<!--                <template v-if="selectedPaymentMethodData(pageId).method === PaymentType.BANK_TRANSFER">-->
<!--                  <div class="mt-1">{{ "銀行名稱：" + selectedPaymentMethodData(pageId).bank }}</div>-->
<!--                  <div class="mt-1">{{ "戶口號碼：" + selectedPaymentMethodData(pageId).accountNumber }}</div>-->
<!--                  <div class="mt-1">{{ "戶口名稱：" + selectedPaymentMethodData(pageId).accountName }}</div>-->
<!--                </template>-->
<!--                <template v-if="selectedPaymentMethodData(pageId).method === PaymentType.FPS">-->
<!--                  <div class="mt-1">{{ "電話號碼：" + selectedPaymentMethodData(pageId).phone }}</div>-->
<!--                  <div class="mt-1">{{ "收款賬戶：" + selectedPaymentMethodData(pageId).account }}</div>-->
<!--                  <div class="mt-1">{{ "戶口名稱：" + selectedPaymentMethodData(pageId).accountName }}</div>-->
<!--                </template>-->
<!--                <template v-if="selectedPaymentMethodData(pageId).method === PaymentType.IN_PERSON">-->
<!--                  <div class="mt-1">{{ "描述：" + selectedPaymentMethodData(pageId).description }}</div>-->
<!--                </template>-->
<!--                <template v-if="[PaymentType.PAYME, PaymentType.WECHAT_PAY_HK, PaymentType.ALIPAY_HK].includes(selectedPaymentMethodData(pageId).method)">-->
<!--                  <div class="mt-2">-->
<!--                    <img :src="selectedPaymentMethodData(pageId).qrCodeUrl" style="max-width: 150px; max-height: 150px;"/>-->
<!--                  </div>-->
<!--                </template>-->
<!--              </template>-->
<!--            </div>-->
<!--            <div class="col-span-3 lg:col-span-2">-->
<!--              -->
<!--            </div>-->
<!--          </div>-->
<!--          <hr/>-->
        </template>
      </div>





      <div class="grid grid-cols-12 gap-4 lg:gap-8 bg-gray-100 p-4">
        <div class="col-span-9 lg:col-span-10">
          <div>給店鋪留言</div>
          <textarea v-model="notes[pageId]"
                    placeholder="e.g. 產品大小、顔色、訂製内容。提交訂單後，店鋪可以看到此内容，可先與店鋪查詢。（選填）"
                    class="w-full border rounded-md p-2 mt-2" rows="4">
          </textarea>
        </div>
        <div class="col-span-3 lg:col-span-2">
          <div class="font-semibold">
            總計
          </div>
          <div class="text-pink-700 text-xl font-semibold mt-2">
            {{ formatMediaPrice(pageTotal(pageId)) }}
          </div>
          <div v-if="!isFreeMailing(pageId) && !!selectedMailing(pageId) && selectedMailing(pageId).payOnArrive">
            （未含到付郵費）
          </div>
        </div>
      </div>

    </div>
    <div class="my-8 text-right">
      <button class="btn-primary btn-lg" @click="clickCheckout">
        立即結賬
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

import IgMedia from "~/models/IgMedia"
import type {Ref} from "vue"
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {IgPageCommerceData, PaymentType} from "~/models/IgPageCommerceData";
import IgPage from "~/models/IgPage";
import useMediaPrice from "~/composables/useMediaPrice";
import {DiscountType, ThresholdType} from "~/models/Discount";
import {paymentMethodsToText, mailingTypeToText} from "~/data/commerce";
import {MailingType} from "~/models/Order";
import Dict = NodeJS.Dict;
import {discountValue, isFreeMailing as _isFreeMailing} from "~/utils/discountValue";
import {mailingDiscountToText} from "~/utils/discountText";

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
      pageIds.value.forEach((id) => selectedMailingIndex.value[id] = "")
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

function pageDiscountValue(pageId: string) {
  const medias = mediasGrouped.value[pageId]
  const price = medias.map((m) => mediaPrice(m) * cart.value.find((item) => item.code === m.code).quantity - mediaDiscountValue(m.code))
      .reduce((previous, current) => previous += current, 0)
  const quantity = medias.map((m) => cart.value.find((item) => item.code === m.code).quantity).reduce((previous, current) => previous += current, 0)
  return discountValue(pageCommerceData.value[pageId].discount, price, quantity)
}

function isFreeMailing(pageId: string) {
  const medias = mediasGrouped.value[pageId]
  const price = medias.map((m) => mediaPrice(m) * cart.value.find((item) => item.code === m.code).quantity - mediaDiscountValue(m.code))
      .reduce((previous, current) => previous += current, 0) - pageDiscountValue(pageId)
  const quantity = medias.map((m) => cart.value.find((item) => item.code === m.code).quantity).reduce((previous, current) => previous += current, 0)
  return _isFreeMailing(pageCommerceData.value[pageId].mailingDiscount, price, quantity)
}

function pageTotal(pageId: string) {
  const medias = mediasGrouped.value[pageId]
  const price = medias.map((m) => mediaPrice(m) * cart.value.find((item) => item.code === m.code).quantity - mediaDiscountValue(m.code))
      .reduce((previous, current) => previous += current, 0)
  const mailing = isFreeMailing(pageId) ? 0 : (selectedMailing(pageId)?.cost ?? 0)
  return Math.max(price - pageDiscountValue(pageId) + mailing, 0)
}


const notes = ref({})
const selectedPaymentIndex = ref({})
function selectedPaymentMethodData(pageId: string) {
  return pageCommerceData.value[pageId].paymentMethodData[selectedPaymentIndex.value[pageId]]
}

const selectedMailingIndex = ref({})
function selectedMailing(pageId: string) {
  return pageCommerceData.value[pageId].mailing[selectedMailingIndex.value[pageId]]
}

function clickCheckout() {

}

</script>

<style scoped>

</style>