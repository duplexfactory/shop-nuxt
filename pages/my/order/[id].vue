<template>
  <div>
    <div v-if="order">
      <div class="mb-4 border rounded-md px-8 py-4 bg-blue-100 border-blue-500">
        <i class="spr-info-circled-alt text-gray-600 mr-2"></i>{{ tipText }}
      </div>

      <div class="mb-4 border rounded-md p-8 md:grid grid-cols-2">

        <div class="col-span-1">
          <div class="font-semibold">訂單資訊</div>
          <div>訂單號碼：{{ order._id }}</div>
          <div>訂單日期：{{ createdDateText }}</div>
          <div>訂單狀態：<span :class="orderStatusColorClass[orderDetail.orderStatus]">{{ orderStatusToText[orderDetail.orderStatus] }}</span></div>
          <div>買家留言：{{ orderDetail.note || "-" }}</div>

          <div class="font-semibold mt-4">郵寄資料</div>
          <div>郵寄方法：{{ mailingTitle }}</div>
          <div v-for="d in mailingInfos" :key="'mailing-info-' + d.type">
            {{ d.title + '：' + d.value }}
          </div>
        </div>

        <div class="col-span-1 mt-4 md:mt-0">
          <div class="font-semibold">付款資訊</div>
          <template v-if="!!orderDetail.paymentMethodData">
            <div>{{ '付款方法：' + paymentMethodsToText[orderDetail.paymentMethodData.method] }}</div>
            <div v-for="d in paymentInfos" :key="'payment-info-' + d.title">
              <div v-if="!!d.value">{{ `${d.title}：${d.value}` }}</div>
              <div v-if="!!d.imageUrl">
                <img :src="d.imageUrl" style="max-width: 150px; max-height: 150px;"/>
              </div>
            </div>

            <button v-if="orderDetail.paymentMethodData.method === PaymentType.IN_PERSON" class="btn-primary mt-2">確認交收</button>
          </template>
          <div v-else>請等待買家付款</div>

          <template v-if="!!orderDetail.paymentMethodData && (orderDetail.paymentMethodData.method !== PaymentType.IN_PERSON)">
            <div class="font-semibold mt-4">付款證明</div>
            <template v-if="!!orderDetail.paymentProofUrl">
              <img :src="orderDetail.paymentProofUrl" style="max-width: 150px; max-height: 150px;"/>
              <button class="btn-primary mt-2">核實證明</button>
            </template>
            <div v-else>請等待買家付款</div>
          </template>

        </div>

        <div class="col-span-2 font-semibold mt-4">訂單內容</div>
        <div class="col-span-2">

          <div class="hidden md:grid grid-cols-12 gap-4 lg:gap-8 py-2">
            <div class="col-span-4 xl:col-span-5">商品</div>
            <div class="col-span-2">單件價格</div>
            <div class="col-span-3 xl:col-span-2">數量</div>
            <div class="col-span-2">小計</div>
            <div class="col-span-1"></div>
          </div>

          <template v-for="media in orderDetail.medias" :key="media.code">
            <div class="col-span-2 hidden md:grid grid-cols-12 gap-4 lg:gap-8 pt-4">
              <div class="col-span-4 xl:col-span-5">
                <div class="flex cursor-pointer" @click="openMedia(media.code, pageId)">
                  <div class="image-container aspect-square rounded-md overflow-hidden flex-grow flex-shrink-0 mr-4"
                       style="min-width:60px; max-width: 90px"
                       v-lazy:background-image="media.mediaUrl || $imageUrl(media.code)"></div>
                  <div class="flex-1">
                    <div class="hidden lg:line-clamp-4 text-sm whitespace-pre-wrap break-words">
                      <!--                    {{ media.caption }}-->
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-2">{{ formatMediaPrice(media.price) }}</div>
              <div class="col-span-3 xl:col-span-2">
                {{ media.quantity }}
              </div>
              <div class="col-span-2">
                {{ formatMediaPrice(media.price * media.quantity - discountValue(media.discount, media.price * media.quantity, media.quantity)) }}
              </div>
              <div class="col-span-1">
                <!--              <button class="hover:underline text-red-500" @click="removeMedia(media.code)">移除</button>-->
              </div>
            </div>
            <hr class="mt-4"/>
          </template>

          <template v-if="!!orderDetail.discount && pageDiscountValue() !== 0">
            <div class="grid grid-cols-12 gap-4 lg:gap-8 py-4">
              <div class="col-span-12 md:col-span-9">
                <div class="font-semibold">店鋪優惠</div>
                <div class="md:flex w-full items-center mt-4">
                  <DiscountCard defaultTitle="店鋪優惠"
                                discountTextPrefix="全店買"
                                singleLine
                                :discount="orderDetail.discount"
                                class="flex-1"></DiscountCard>
                </div>
              </div>
              <div class="col-span-12 md:col-span-3 text-right md:text-left">
                {{ "-" + formatMediaPrice(pageDiscountValue()) }}
              </div>
            </div>
            <hr/>
          </template>

          <div class="grid grid-cols-12 gap-4 lg:gap-8 py-4">
            <div class="col-span-12 md:col-span-9">

              <div class="font-semibold">郵寄方法</div>
              <div class="mt-2">
                <div class="flex items-center mt-1">
                  {{ mailingTitle }}
                </div>
              </div>

              <div v-if="!!orderDetail.mailingDiscount && isFreeMailing()" class="mt-4">
                <div class="font-semibold">郵寄優惠</div>
                <div class="md:flex w-full items-center mt-2">
                  <div class="bg-yellow-100 px-4 py-2 rounded-md flex-1">
                    <p>
                      <span class="text-gray-600">{{ orderDetail.mailingDiscount.title ?? "免郵優惠" }}</span>
                      <span class="text-gray-600 mx-2">-</span>
                      <span class="font-semibold">{{ mailingDiscountToText(orderDetail.mailingDiscount) }}</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
            <div class="col-span-12 md:col-span-3 text-right md:text-left">
              <template v-if="isFreeMailing()">
                免郵
              </template>
              <template v-else>
                <div v-if="orderDetail.mailing.payOnArrive">
                  到付
                </div>
                <div v-if="!!orderDetail.mailing.cost">
                  {{ formatMediaPrice(orderDetail.mailing.cost) }}
                </div>
              </template>
            </div>
          </div>
          <hr/>

          <div class="grid grid-cols-12 gap-4 lg:gap-8 bg-gray-100 p-4">
            <div class="col-span-12 text-right md:(col-span-3 order-1 text-left)">
              <div class="font-semibold">
                總計
              </div>
              <div class="text-pink-700 text-xl font-semibold mt-2">
                {{ formatMediaPrice(pageTotal()) }}
              </div>
              <div v-if="!isFreeMailing() && orderDetail.mailing.payOnArrive">
                （未含到付郵費）
              </div>
            </div>
            <div class="col-span-12 md:col-span-9">
<!--              <div>給店鋪留言</div>-->
<!--              <textarea v-model="notes[pageId]"-->
<!--                        placeholder="e.g. 產品大小、顔色、訂製内容。提交訂單後，店鋪可以看到此内容，可先與店鋪查詢。（選填）"-->
<!--                        class="w-full border rounded-md p-2 mt-2" rows="4">-->
<!--              </textarea>-->
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

import {notFound} from "~/utils/h3Error";
import {MailingInfoType, MailingType, Order, OrderStatus} from "~/models/Order";
import dayjs from "dayjs";
import {mailingInfoTypeToText, mailingTypeToText, paymentMethodsToText, orderStatusToText, orderStatusColorClass} from "~/data/commerce";
import {structurePaymentMethodData} from "~/utils/paymentMethodData";
import {PaymentType} from "~/models/IgPageCommerceData";
import {formatMediaPrice} from "~/utils/mediaPrice";
import {discountValue, isFreeMailing as _isFreeMailing} from "~/utils/discountValue";
import {mailingDiscountToText} from "~/utils/discountText";

// Composables.
const route = useRoute()
const nuxt = useNuxtApp()
const config = useRuntimeConfig()
const {getAuthHeader, headersToObject} = useAuth()
const igPageId = useIgPageId()

const order = ref<Order | null>(null)
const orderDetail = computed(() => {
  if (!order.value)
    return null

  // Strip discount deadlines for UI.
  const details = order.value.shops[igPageId.value]
  if (!!details.discount) {
    details.discount.deadline = undefined
  }
  details.medias.forEach((m) => {
    if (!!m.discount) {
      m.discount.deadline = undefined
    }
  })

  return details
})
function pageDiscountValue() {
  const price = orderDetail.value.medias.map((m) => m.price * m.quantity - discountValue(m.discount, m.price * m.quantity, m.quantity))
      .reduce((previous, current) => previous += current, 0)
  const quantity = orderDetail.value.medias.map((m) => m.quantity).reduce((previous, current) => previous += current, 0)
  return discountValue(orderDetail.value.discount, price, quantity)
}
function isFreeMailing() {
  const price = orderDetail.value.medias.map((m) => m.price * m.quantity - discountValue(m.discount, m.price * m.quantity, m.quantity))
      .reduce((previous, current) => previous += current, 0) - pageDiscountValue()
  const quantity = orderDetail.value.medias.map((m) => m.quantity).reduce((previous, current) => previous += current, 0)
  return _isFreeMailing(orderDetail.value.mailingDiscount, price, quantity)
}
function pageTotal() {
  const price = orderDetail.value.medias.map((m) => m.price * m.quantity - discountValue(m.discount, m.price * m.quantity, m.quantity))
      .reduce((previous, current) => previous += current, 0)
  let mailingCost = 0
  if (!isFreeMailing()) {
    if (!orderDetail.value.mailing.payOnArrive) {
      mailingCost = orderDetail.value.mailing.cost
    }
  }
  return Math.max(price - pageDiscountValue() + mailingCost, 0)
}
const mailingTitle = computed(() => {
  if (!orderDetail.value)
    return ""
  if (orderDetail.value.mailing.type === MailingType.OTHERS) {
    return orderDetail.value.mailing.title
  }
  return mailingTypeToText[orderDetail.value.mailing.type]
})
const mailingInfos = computed(() => {
  if (!orderDetail.value)
    return []
  const mailingInfoTypes: MailingInfoType[] = Object.keys(orderDetail.value.mailingInfo).map((t) => Number(t))
  return mailingInfoTypes.map((t) => ({
    type: t,
    title: mailingInfoTypeToText[t],
    value: orderDetail.value.mailingInfo[t]
  }))
})
const paymentInfos = computed(() => {
  if (!orderDetail.value)
    return []
  return structurePaymentMethodData(orderDetail.value.paymentMethodData);
})

if (process.client) {
  const {data, pending, error} = await useLazyFetch(`/api/order/${route.params.id}/shop/`, {headers: headersToObject(await getAuthHeader())})
  if (!!error && !!error.value) {
    throwError(notFound);
  }
  if (pending.value) {
    watch(data, () => {
      order.value = (data.value as any as {order: Order}).order
    })
  }
  else {
    order.value = (data.value as any as {order: Order}).order
  }
}

const createdDateText = dayjs((order.value?.created ?? 0)).format('DD/MM/YYYY');

const tipText = computed(() => {
  if (!orderDetail.value)
    return ""
  let text = "提示："
  switch (orderDetail.value.orderStatus) {
    case OrderStatus.PENDING:
      text += "請等待買家付款及上傳付款證明。"
      break;
    case OrderStatus.TB_VERIFIED:
      if (orderDetail.value.paymentMethodData.method === PaymentType.IN_PERSON) {
        text += "請聯絡買家相約交收時間及地點。交收後，請按「確認交收」。"
      }
      else {
        text += "請驗證買家上傳的付款證明。確認收到款項後，請按「核實證明」。"
      }
      break;
    case OrderStatus.VERIFIED:
      text += "請發貨。發貨後，請按「已發貨」。"
      break;
    case OrderStatus.MAILED:
      text += "已完成交易。"
      break;
  }
  return text
})


// export enum OrderStatus {
//   VERIFICATION_FAILED,
//   PENDING,
//   TB_VERIFIED,
//   VERIFIED,
//   MAILED
// }

</script>
<style scoped>
</style>
