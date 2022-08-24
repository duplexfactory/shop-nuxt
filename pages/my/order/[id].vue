<template>
  <div>
    <div v-if="order">
      <div class="mb-4 border rounded-md px-8 py-4 bg-blue-100 border-blue-500">
        <i class="spr-info-circled-alt text-gray-600 mr-2"></i>{{ tipText }}
      </div>

      <div class="mb-4 border rounded-md p-4 md:(p-8 grid grid-cols-2)">

        <div class="col-span-1">
          <div class="font-semibold">訂單資訊</div>
          <div>訂單號碼：{{ order._id }}</div>
          <div>訂單日期：{{ createdDateText }}</div>
          <div>訂單狀態：<span :class="orderStatusColorClass[orderDetail.orderStatus]">{{ orderStatusToText[orderDetail.orderStatus] }}</span></div>
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

            <button v-if="orderDetail.paymentMethodData.method === PaymentType.IN_PERSON && orderDetail.orderStatus !== OrderStatus.MAILED"
                    class="btn-primary mt-2"
                    :disabled="isSettleLoading"
                    @click="clickSettle">
              完成交易
            </button>
          </template>
          <div v-else>請等待買家付款</div>

          <template v-if="!!orderDetail.paymentMethodData && (orderDetail.paymentMethodData.method !== PaymentType.IN_PERSON)">
            <div class="font-semibold mt-4">付款證明</div>
            <template v-if="!!orderDetail.paymentProofUrl && orderDetail.orderStatus !== OrderStatus.VERIFICATION_FAILED">
              <img :src="orderDetail.paymentProofUrl" style="max-width: 150px; max-height: 150px;"/>
              <div class="mt-2">
                <button class="btn-primary"
                        :disabled="isVerifyLoading"
                        @click="clickVerify">
                  接受證明
                </button>
                <button class="btn-outline ml-2"
                        :disabled="isVerifyLoading"
                        @click="clickDeny">
                  拒絕接受證明
                </button>
              </div>

            </template>
            <div v-else>請等待買家上傳付款證明</div>
          </template>

        </div>

        <div class="col-span-2 font-semibold mt-4">訂單內容</div>
        <OrderReceipt v-if="!!orderDetail" class="col-span-2 mt-2" :orderDetail="orderDetail" :orderCreated="order.created"></OrderReceipt>

      </div>
    </div>

    <!-- Confirm settle -->
    <Teleport to="body">
      <transition name="modal">
        <LazyConfirmModal v-if="showConfirmModal"
                          @confirm="onConfirm"
                          @close="showConfirmModal = false">
          <template #body>
            <div class="p-4">
              <div v-if="!!confirmModalTitle">{{ confirmModalTitle }}</div>
              <div v-if="!!confirmModalContent" class="mt-2">{{ confirmModalContent }}</div>
            </div>
          </template>
        </LazyConfirmModal>
      </transition>
    </Teleport>

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

const paymentInfos = computed(() => {
  if (!orderDetail.value)
    return []
  return structurePaymentMethodData(orderDetail.value.paymentMethodData);
})

onMounted(async () => {
  const {data, pending, error} = await useLazyFetch(`/api/order/${route.params.id}/shop`, {headers: headersToObject(await getAuthHeader())})
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
})

const createdDateText = computed(() => {
  if (!orderDetail.value)
    return '-'
  return dayjs(order.value.created).format('DD/MM/YYYY')
})

const tipText = computed(() => {
  if (!orderDetail.value)
    return ""
  let text = "提示："
  switch (orderDetail.value.orderStatus) {
    case OrderStatus.VERIFICATION_FAILED:
      text += "已拒絕接受買家之前上傳的付款證明。請等待買家重新上傳付款證明。"
      break;
    case OrderStatus.PENDING:
      text += "請等待買家付款及上傳付款證明。"
      break;
    case OrderStatus.TB_VERIFIED:
      if (orderDetail.value.paymentMethodData.method === PaymentType.IN_PERSON) {
        text += "請聯絡買家相約交收時間及地點。交收後，請按「完成交易」。"
      }
      else {
        text += "請驗證買家上傳的付款證明。確認收到款項後，請按「接受證明」。"
      }
      break;
    case OrderStatus.VERIFIED:
      text += "請發貨。發貨後，請按「完成交易」。"
      break;
    case OrderStatus.MAILED:
      text += "已完成交易。"
      break;
  }
  return text
})

// Confirm Modal.
const showConfirmModal = ref(false)
const confirmModalTitle = ref("")
const confirmModalContent = ref("")
const onConfirm = ref(() => {})

// Settle order.
const isSettleLoading = ref(false)
async function clickSettle() {
  showConfirmModal.value = true
  confirmModalTitle.value = "你是否確定完成交易？"
  confirmModalContent.value = ""
  onConfirm.value = confirmSettle
}
async function confirmSettle() {
  showConfirmModal.value = false
  if (!order.value)
    return
  isSettleLoading.value = true
  const { error } = await patchStatus(OrderStatus.MAILED)
  isSettleLoading.value = false
  if (!!error.value) {
    nuxt.vueApp.$toast.error("完成交易失敗，請稍後再試", {position: "top"})
    return
  }
  nuxt.vueApp.$toast.success("已成功完成交易。", {position: "top"})
}

// Verify payment proof.
const isVerifyLoading = ref(false)
async function clickVerify() {
  showConfirmModal.value = true
  confirmModalTitle.value = "你是否確定接受證明？"
  confirmModalContent.value = "接受證明即代表你已經收到款項。"
  onConfirm.value = confirmVerify
}
async function confirmVerify() {
  showConfirmModal.value = false
  if (!order.value)
    return
  isVerifyLoading.value = true
  const { error } = await patchStatus(OrderStatus.VERIFIED)
  isVerifyLoading.value = false
  if (!!error.value) {
    nuxt.vueApp.$toast.error("接受證明失敗，請稍後再試", {position: "top"})
    return
  }
  nuxt.vueApp.$toast.success("已成功接受證明。", {position: "top"})
}
async function clickDeny() {
  showConfirmModal.value = true
  confirmModalTitle.value = "你是否確定拒絕接受證明？"
  confirmModalContent.value = "拒絕接受證明即代表買家需要重新上傳證明。"
  onConfirm.value = confirmDeny
}
async function confirmDeny() {
  showConfirmModal.value = false
  if (!order.value)
    return
  isVerifyLoading.value = true
  const { error } = await patchStatus(OrderStatus.VERIFICATION_FAILED)
  isVerifyLoading.value = false
  if (!!error.value) {
    nuxt.vueApp.$toast.error("拒絕接受證明失敗，請稍後再試", {position: "top"})
    return
  }
  nuxt.vueApp.$toast.success("已成功拒絕接受證明。", {position: "top"})
}

// Helper.
async function patchStatus(status: OrderStatus) {
  return useFetch(`/api/order/${order.value._id}/status`, { headers: headersToObject(await getAuthHeader()), method: 'PUT', body: {status}})
}

</script>
<style scoped>
</style>
