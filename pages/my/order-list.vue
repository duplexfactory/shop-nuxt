<template>
  <div class="wrapper">
    <div class="table">
      <div class="table-header-group">
        <div class="table-row">
          <div class="table-cell">訂單ID</div>
          <div class="table-cell">訂單日期</div>
          <div class="table-cell" style="width: 400px">貨品</div>
          <div class="table-cell">訂單狀態</div>
          <div class="table-cell">動作</div>

<!--          orderStatus: OrderStatus;-->
<!--          medias: {-->
<!--          code: string,-->
<!--          price: number,-->
<!--          discount?: Discount;-->
<!--          quantity: number;-->
<!--          }[]-->
<!--          discount?: Discount;-->
<!--          mailing: Mailing;-->
<!--          mailingDiscount?: MailingDiscount;-->
<!--          mailingInfo: {-->
<!--          [key:number]: string // key MailingInfoType-->
<!--          };-->
<!--          paymentMethodData?: PaymentMethodData;-->
<!--          paymentProofUrl?: string;-->
<!--          note: string;-->
        </div>
      </div>

      <div class="table-row"
           v-for="order in orders"
           :key="order._id">
        <div class="table-cell">
          {{ order._id }}
        </div>
        <div class="table-cell">
          {{ dayjs(order.created).format('DD/MM/YYYY') }}
        </div>
        <div class="table-cell" style="width: 400px">
          <div class="flex">
            <div v-for="media in order.shops[igPageId].medias"
                 class="image-container aspect-square rounded-md overflow-hidden mr-4"
                 style="width: 80px"
                 v-lazy:background-image="media.mediaUrl || $imageUrl(media.code)"></div>
          </div>
        </div>
        <div class="table-cell">
          <span :class="orderStatusColorClass[order.shops[igPageId].orderStatus]">{{ orderStatusToText[order.shops[igPageId].orderStatus] }}</span>
        </div>
        <div class="table-cell">
          <nuxt-link :to="'/my/order/' + order._id" class="hover:underline text-pink-600 mr-2">查看詳情</nuxt-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

import dayjs from "dayjs";
import {Order} from "~/models/Order";
import {useIgPageId} from "~/composables/states";
import {orderStatusToText, orderStatusColorClass} from "~/data/commerce";

const {
  getAuthHeader,
  headersToObject
} = useAuth()
const igPageId = useIgPageId()

const orders = ref<Order[]>([])

if (process.client) {
  const {
    data,
    pending,
    error
  } = await useLazyFetch("/api/order/list/shop", { headers: headersToObject(await getAuthHeader())})
  if (pending.value) {
    watch(data, () => {
      orders.value = data.value["orders"]
    })
  }
  else {
    orders.value = data.value["orders"]
  }
}


</script>

<style scoped>

.wrapper {
  overflow-x: auto;
  white-space: nowrap;
}

.wrapper .table {
  width: auto;
  min-width: 100%;
}

.table-cell {
  @apply align-middle p-2;
}

</style>
