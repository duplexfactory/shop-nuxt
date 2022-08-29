<template>
  <div class="mb-8">
    <div class="border rounded-md p-4 mb-8">
      <div class="mb-2">篩選</div>
      <div class="flex">
        <div class="flex-1 mr-4">
          <div>訂單ID</div>
          <input v-model="keywordFilter"
                 class="text-input-primary w-full"
                 placeholder="訂單ID"
                 @keyup.enter="fetchOrderList"/>
        </div>
        <div>
          <div>訂單狀態</div>
          <lazy-spr-select class="mr-2" v-model="orderStatusFilter" @change="fetchOrderList" :clearable="true" :emptyValue="null">
            <option disabled :value="null">請選擇</option>
            <option v-for="key in Object.keys(orderStatusToText)"
                    :key="'order-status-filter' + key"
                    :value="key">{{ orderStatusToText[key] }}</option>
          </lazy-spr-select>
        </div>
      </div>
    </div>

    <client-only>
      <div class="flex items-center justify-between">
        <h1 class="text-sm text-gray-500">共 {{ orderCount }} 訂單</h1>

        <Pagination v-if="orders.length !== 0"
                    v-model:currentPage="currentPage"
                    class="flex"
                    :records="orderCount"
                    :per-page="pagination.limit"
                    @pageChanged="pageChanged"/>
      </div>

      <div class="hidden md:block my-4 wrapper">
        <div class="table">
          <div class="table-header-group">
            <div class="table-row">
              <div class="table-cell">訂單ID</div>
              <div class="table-cell">訂單日期</div>
              <div class="table-cell" style="width: 400px">貨品</div>
              <div class="table-cell">訂單總計</div>
              <div class="table-cell">訂單狀態</div>
              <div class="table-cell">動作</div>
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
                <div v-for="media in order.shops[igPageId].medias" :key="order._id + '-' + media.code" class="mr-4">
                  <div class="image-container aspect-square rounded-md overflow-hidden"
                       style="width: 80px"
                       v-lazy:background-image="media.mediaUrl || $imageUrl(media.code)"></div>
                  <div class="text-center mt-2">{{ "x" + media.quantity }}</div>
                </div>
              </div>
            </div>
            <div class="table-cell">
              {{ formatMediaPrice(pageTotal(order.shops[igPageId])) }}
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
      <div class="md:hidden my-2">
        <template v-for="order in orders"
                  :key="order._id + '-mobile'">
          <div class="py-4">
            <div class="flex justify-between">
              <div>
                <div class="text-sm">訂單ID</div>
                <div>{{ order._id }}</div>

                <div class="text-sm mt-2">訂單日期</div>
                <div>{{ dayjs(order.created).format('DD/MM/YYYY') }}</div>
              </div>

              <div class="text-right">
                <div :class="orderStatusColorClass[order.shops[igPageId].orderStatus]">{{ orderStatusToText[order.shops[igPageId].orderStatus] }}</div>
                <nuxt-link :to="'/my/order/' + order._id" class="hover:underline text-pink-600">查看詳情</nuxt-link>

                <div class="text-sm mt-2">訂單總計</div>
                <div>{{ formatMediaPrice(pageTotal(order.shops[igPageId])) }}</div>
              </div>
            </div>
            <div class="flex mt-2">
              <div v-for="media in order.shops[igPageId].medias" :key="order._id + '-' + media.code" class="mr-4">
                <div class="image-container aspect-square rounded-md overflow-hidden"
                     style="width: 60px"
                     v-lazy:background-image="media.mediaUrl || $imageUrl(media.code)"></div>
                <div class="text-center mt-2">{{ "x" + media.quantity }}</div>
              </div>
            </div>
          </div>
          <hr/>
        </template>
      </div>
      <div v-if="orders.length === 0" class="mb-4 p-8 border rounded-md text-center">
        <div class="text-xl">尚未有任何訂單</div>
      </div>

      <div class="flex items-center justify-between">
        <h1 class="text-sm text-gray-500">共 {{ orderCount }} 訂單</h1>

        <Pagination v-if="orders.length !== 0"
                    v-model:currentPage="currentPage"
                    class="flex"
                    :records="orderCount"
                    :per-page="pagination.limit"
                    @pageChanged="pageChanged"/>
      </div>
    </client-only>

  </div>
</template>

<script lang="ts" setup>

import dayjs from "dayjs";
import {Order, OrderStatus} from "~/models/Order";
import {useIgPageId} from "~/composables/states";
import {orderStatusToText, orderStatusColorClass} from "~/data/commerce";
import {PaginationQuery} from "~/models/PaginationQuery";
import {
  pageTotal
} from "~/utils/discountValue";
import {formatMediaPrice} from "~/utils/mediaPrice";

const {
  getAuthHeader,
  headersToObject
} = useAuth()
const igPageId = useIgPageId()

const keywordFilter = ref("")
const orderStatusFilter = ref<OrderStatus | null>(null)
const pagination = ref(new PaginationQuery())
const orderCount = ref(0)
const currentPage = ref(1)
const orders = ref<Order[]>([])

async function fetchOrderList() {
  const params: PaginationQuery & {keyword?: string, status?: OrderStatus} =  {
    keyword: keywordFilter.value,
    ...pagination.value
  }
  if (orderStatusFilter.value !== null) {
    params.status = orderStatusFilter.value
  }
  const {
    data,
    pending,
    error
  } = await useLazyFetch("/api/order/list/shop", {
    params,
    headers: headersToObject(await getAuthHeader()),
    initialCache: false
  })
  if (pending.value) {
    watch(data, () => {
      orders.value = data.value["orders"]
      orderCount.value = data.value["count"]
    })
  }
  else {
    orders.value = data.value["orders"]
    orderCount.value = data.value["count"]
  }
}

if (process.client) {
  await fetchOrderList()
}

async function pageChanged() {
  pagination.value.skip = (currentPage.value - 1) * pagination.value.limit
  await fetchOrderList()
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
  @apply align-middle p-2 border-b;
}

</style>
