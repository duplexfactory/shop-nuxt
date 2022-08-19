<template>
  <div class="container mx-auto">
    <div v-if="order">
      <div class="mb-4 border rounded-md p-4">
        <div class="font-semibold mt-4">訂單資訊</div>
        <div>訂單號碼：{{ order._id }}</div>
        <div>訂單日期：{{ createdDateText }}</div>
        <div>訂單狀態：{{ orderDetail.orderStatus }}</div>
        <div>買家留言：{{ orderDetail.note }}</div>

        <div class="font-semibold mt-4">郵寄資料</div>
        <div>郵寄方法：{{ mailingTitle }}</div>
        <div v-for="d in mailingInfos" :key="'mailing-info-' + d.type">
          {{ d.title + '：' + d.value }}
        </div>

        <div class="font-semibold mt-4">訂單內容</div>
        <div v-for="media in orderDetail.medias" :key="media.code">
          <!--          code: string,-->
          <!--          price: number,-->
          <!--          discount?: Discount;-->
          <!--          quantity: number;-->
        </div>

        <div class="font-semibold mt-4">付款資訊</div>
        <template v-if="!!orderDetail.value.paymentMethodData">
          <div>{{ '付款方法：' + paymentMethodsToText[orderDetail.value.paymentMethodData.method] }}</div>
          <div v-for="d in paymentInfos" :key="'payment-info-' + d.title">
            <div v-if="!!d.value">{{ `${d.title}：${d.value}` }}</div>
            <div v-if="!!d.imageUrl">
              <img :src="d.imageUrl" style="max-width: 150px; max-height: 150px;"/>
            </div>
          </div>
        </template>
        <div v-else>請等待買家付款</div>

        <div class="font-semibold mt-4">付款證明</div>
        <template v-if="!!orderDetail.value.paymentProofUrl">
          <img :src="orderDetail.value.paymentProofUrl" style="max-width: 150px; max-height: 150px;"/>
          <div>
            <button class="btn-primary">核實證明</button>
          </div>
        </template>
        <div v-else>請等待買家付款</div>

      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

import {notFound} from "~/utils/h3Error";
import {MailingInfoType, MailingType, Order} from "~/models/Order";
import dayjs from "dayjs";
import {mailingInfoTypeToText, mailingTypeToText, paymentMethodsToText} from "~/data/commerce";
import {structurePaymentMethodData} from "~/utils/paymentMethodData";

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

</script>
<style scoped>
</style>
