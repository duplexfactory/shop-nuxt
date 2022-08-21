<template>
  <div>
    <div v-if="order">
      <div class="mb-4 border rounded-md px-8 py-4">
        {{ tipText }}
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
          </template>
          <div v-else>請等待買家付款</div>

          <template v-if="!!orderDetail.paymentMethodData && (orderDetail.paymentMethodData.method !== PaymentType.IN_PERSON)">
            <div class="font-semibold mt-4">付款證明</div>
            <template v-if="!!orderDetail.paymentProofUrl">
              <img :src="orderDetail.paymentProofUrl" style="max-width: 150px; max-height: 150px;"/>
              <div>
                <button class="btn-primary">核實證明</button>
              </div>
            </template>
            <div v-else>請等待買家付款</div>
          </template>

        </div>


        <div class="font-semibold mt-4">訂單內容</div>
        <div v-for="media in orderDetail.medias" :key="media.code">
          <!--          code: string,-->
          <!--          price: number,-->
          <!--          discount?: Discount;-->
          <!--          quantity: number;-->
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
  return order.value.shops[igPageId.value]
})
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
      text += "請驗證買家上傳的付款證明。確認收到款項後，請按「核實證明」。"
      break;
    case OrderStatus.VERIFIED:
      text += "請發貨。確認收到款項後，請按「已發貨」。"
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
