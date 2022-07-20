<template>
  <div>
    <!-- First time set up -->
    <div v-if="!commerceData" class="info-group !pb-8">

      <!-- Stepper -->
      <div v-if="step !== Step.INIT && step !== Step.COMPLETE" class="flex items-center mb-4">
        <div v-for="(s, i) in steps.slice(1, steps.length - 1)"
             :key="s"
             class="h-1 mr-2"
             :class="currentStepIndex > i ? 'bg-pink-400' : 'bg-gray-200'"
             :style="'width: ' + (100 / (steps.length - 2)) + '%'"></div>
        <div class="text-xs text-gray-500">{{ currentStepIndex }}/{{ steps.length - 2 }}</div>
      </div>

      <!-- Loading -->
      <div v-if="savingConfig" class="text-center py-16">
        <i class="spr-spin4 animate-spin text-6xl text-pink-400"></i>
        <div class="mt-4 text-2xl text-pink-700 font-semibold">
          設定中
        </div>
      </div>

      <!-- Edit content -->
      <div v-else class="text-center w-full md:w-3/5 mx-auto">

        <template v-if="step == Step.INIT">
          <div class="text-xl mt-4">
            設定你的網店後，顧客便可直接在Shoperuse上下單購買你的產品！
          </div>
          <div class="mt-2 text-gray-600">
            首次設定時，我們將會一步一步引導你。在首次設定後，所有資料也可以隨時再次修改。
          </div>
          <button class="mt-4 btn-primary" @click="incrementStep">立即開始設定</button>
        </template>
        <template v-else-if="step == Step.MAILING">
          <div class="text-2xl">
            郵寄方法
          </div>
          <div class="text-gray-500">
            免郵優惠（e.g. 滿3件免郵）將在稍後步驟填寫，此步驟只需填寫郵寄原價。
          </div>

          <LazyMailingEditor class="mt-4" v-model="configCommerceData.mailing" :allowRemoveAll="true"></LazyMailingEditor>

          <button class="mt-4 btn-primary" :disabled="configCommerceData.mailing.length === 0" @click="incrementStep">下一步</button>
        </template>
        <template v-else-if="step == Step.PAYMENT">
          <div class="text-2xl">
            付款方法
          </div>
          <div class="text-gray-500">
            顧客將會直接付款給你，所有款項皆不會經過Shoperuse。
          </div>

          <LazyPaymentEditor class="mt-4" v-model="configCommerceData" :allowRemoveAll="true"></LazyPaymentEditor>

          <div class="flex justify-between">
            <button class="mt-4 mr-4 btn-outline" @click="decrementStep">上一步</button>
            <button class="mt-4 btn-primary" :disabled="configCommerceData.paymentMethodData.length === 0" @click="incrementStep">下一步</button>
          </div>

        </template>
        <template v-else-if="step == Step.DISCOUNT">
          <div class="text-2xl">
            優惠設定
          </div>

          <div class="flex justify-between items-center">
            <div class="text-left text-xl font-semibold">
              店鋪折扣優惠
            </div>
            <lazy-basic-toggle v-model="hasDiscount"></lazy-basic-toggle>
          </div>
          <div class="text-left text-gray-500">
            此優惠適用於你的店鋪内所有的產品。如果只想為特定產品設定優惠，請在「我的貼文」設定。
          </div>

          <LazyDiscountEditor class="mt-4" v-if="hasDiscount" v-model="tempDiscount"></LazyDiscountEditor>

          <hr class="my-4"/>

          <div class="flex justify-between items-center">
            <div class="text-left text-xl font-semibold">
              免郵優惠
            </div>
            <lazy-basic-toggle v-model="hasMailingDiscount"></lazy-basic-toggle>
          </div>
          <div class="text-left text-gray-500">
            在指定條件下免除郵費。
          </div>

          <LazyMailingDiscountEditor v-if="hasMailingDiscount" class="mt-4" v-model="tempMailingDiscount"></LazyMailingDiscountEditor>

          <div class="flex justify-between">
            <button class="mt-4 mr-4 btn-outline" @click="decrementStep">上一步</button>
            <button class="mt-4 btn-primary" @click="incrementStep">完成</button>
          </div>

        </template>
        <template v-else-if="step == Step.COMPLETE">
          <div>
            <i class="spr-ok text-6xl text-pink-700"></i>
            <div class="mt-2 text-2xl text-pink-700 font-semibold">
              設定完成
            </div>
          </div>
          <div class="mt-4">
            恭喜，顧客現在可直接在Shoperuse上下單購買你的產品！
          </div>
          <div class="mt-2">
            所有設定可於「網店設定」隨時修改
          </div>
          <div class="flex justify-center">
            <button class="mt-4 mr-4 btn-outline" @click="navigateToCommerceSettings">返回網店設定</button>
            <button class="mt-4 btn-primary" @click="navigateToOrderList">查看訂單列表</button>
          </div>
        </template>

      </div>

    </div>

    <div v-else>
      <div class="info-group">
        <div class="text-2xl">
          郵寄方法
        </div>
        <LazyMailingEditor class="mt-4" v-model="commerceData.mailing" :deleteConfirmation="true" @save="saveMailing" @delete="saveMailing"></LazyMailingEditor>
      </div>
      <div class="info-group">
        <div class="text-2xl">
          付款方法
        </div>
        <div class="text-gray-500">
          顧客將會直接付款給你，所有款項皆不會經過Shoperuse。
        </div>
        <LazyPaymentEditor class="mt-4" v-model="commerceData" :deleteConfirmation="true" @save="savePayment" @delete="savePayment"></LazyPaymentEditor>
      </div>
      <div class="info-group">
        <div class="text-2xl">
          優惠設定
        </div>

        <div class="mt-4 flex justify-between items-center">
          <div class="text-left text-xl font-semibold">
            店鋪折扣優惠
          </div>
          <lazy-basic-toggle v-model="hasDiscount"></lazy-basic-toggle>
        </div>
        <div class="text-left text-gray-500">
          此優惠適用於你的店鋪内所有的產品。如果只想為特定產品設定優惠，請在「我的貼文」設定。
        </div>
        <LazyDiscountEditor class="mt-4" v-if="hasDiscount" v-model="tempDiscount"></LazyDiscountEditor>


        <div class="mt-4 flex justify-between items-center">
          <div class="text-left text-xl font-semibold">
            免郵優惠
          </div>
          <lazy-basic-toggle v-model="hasMailingDiscount"></lazy-basic-toggle>
        </div>
        <div class="text-left text-gray-500">
          在指定條件下免除郵費。
        </div>

        <LazyMailingDiscountEditor v-if="hasMailingDiscount" class="mt-4" v-model="tempMailingDiscount"></LazyMailingDiscountEditor>

        <button class="mt-4 btn-primary" :disabled="savingDiscount" @click="saveDiscount">儲存</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

// Commerce
import {Ref} from "vue"
import {
  IgPageCommerceData, PaymentMethodData
} from "~/models/IgPageCommerceData"
import {Mailing} from "~/models/Order"
import {Discount, DiscountType, MailingDiscount, ThresholdType} from "~/models/Discount";

const {
  auth,
  getAuthHeader,
  headersToObject
} = useAuth()
const nuxt = useNuxtApp()
const igPageId = useIgPageId();

const commerceData: Ref<IgPageCommerceData | null> = ref(null)

const configCommerceData: Ref<Partial<Omit<IgPageCommerceData, "_id">>> = ref({
  discount: null,
  mailingDiscount: null,
  mailing: [],
  paymentMethodData: []
})
const savingConfig = ref(false)

// Steps
enum Step {
  INIT,
  MAILING,
  PAYMENT,
  DISCOUNT,
  COMPLETE
}
const steps = [
  Step.INIT,
  Step.MAILING,
  Step.PAYMENT,
  Step.DISCOUNT,
  Step.COMPLETE
]
const step = ref(Step.INIT)
const currentStepIndex = computed(() => steps.findIndex((s) => s === step.value))
function decrementStep() {
  step.value = steps[currentStepIndex.value - 1]
}
async function incrementStep() {
  if (currentStepIndex.value === steps.length - 2) {
    // Last step.
    let errorText: string | undefined
    if (hasDiscount.value) {
      if (!tempDiscount.value.threshold && (tempDiscount.value.threshold !== 0))
        errorText = errorText ?? "請填寫店鋪折扣條件！"
      if (!tempDiscount.value.discount && (tempDiscount.value.discount !== 0))
        errorText = errorText ?? "請填寫店鋪折扣！"
    }
    if (hasMailingDiscount.value) {
      if (!tempMailingDiscount.value.threshold && (tempMailingDiscount.value.threshold !== 0))
        errorText = errorText ?? "請填寫免郵優惠條件！"
    }

    if (!!errorText) {
      nuxt.vueApp.$toast.error(errorText, {position: "top"})
      return
    }

    savingConfig.value = true
    const {
      data,
      error
    } = await patchCommerce(configCommerceData.value);
    savingConfig.value = false

    if (error.value) {
      nuxt.vueApp.$toast.error("設定失敗，請重新嘗試！", {position: "top"})
      return
    }
  }
  step.value = steps[currentStepIndex.value + 1]
}

async function navigateToCommerceSettings() {
  await commerceDataRefresh()
  if (!!commerceRawData.value) {
    await init()
  }
}

function navigateToOrderList() {

}

// Discount
const hasDiscount = ref(false)
const tempDiscount: Ref<Discount> = ref({
  thresholdType: ThresholdType.COUNT, // COUNT, VALUE
  discountType: DiscountType.FLAT, // FLAT, RATIO
  threshold: 1,
  discount: 0,
})
// discount?: Discount;

// Mailing discount
const hasMailingDiscount = ref(false)
const tempMailingDiscount: Ref<MailingDiscount> = ref({
  thresholdType: ThresholdType.COUNT, // COUNT, VALUE
  threshold: 1,
})

// Init data
let commerceRawData;
let commerceDataRefresh;
let commerceDataRefreshError;
async function initCommerceData() {
  const {
    data,
    refresh,
    error
  } = await useFetch(`/api/shop/id/${igPageId.value}/commerce-data`)
  commerceRawData = data
  commerceDataRefresh = refresh
  commerceDataRefreshError = error

  if (!!commerceRawData.value) {
    await init()
  }
}
await initCommerceData()
if (!!commerceRawData.value) {
  await init()
}
else {
  watch(igPageId, initCommerceData)
}

async function init() {
  commerceData.value = commerceRawData.value["commerceData"]

  if (!!commerceData.value) {
    hasDiscount.value = !!commerceData.value.discount
    hasMailingDiscount.value = !!commerceData.value.mailingDiscount

    if (hasDiscount.value) {
      tempDiscount.value = commerceData.value.discount
    }
    if (hasMailingDiscount.value) {
      tempMailingDiscount.value = commerceData.value.mailingDiscount
    }
  }
}

// Individual part saving
const savingMailing = ref(false)
async function saveMailing() {
  savingMailing.value = true
  const {
    data,
    error
  } = await patchCommerce({
    mailing: commerceData.value.mailing
  });
  savingMailing.value = false
  if (error.value) {
    nuxt.vueApp.$toast.error("儲存失敗，請重新嘗試！", {position: "top"})
    return
  }
  nuxt.vueApp.$toast.success("儲存成功！", {position: "top"})
}
const savingPayment = ref(false)
async function savePayment() {
  savingPayment.value = true
  const {
    data,
    error
  } = await patchCommerce({
    paymentMethodData: commerceData.value.paymentMethodData
  });
  savingPayment.value = false
  if (error.value) {
    nuxt.vueApp.$toast.error("儲存失敗，請重新嘗試！", {position: "top"})
    return
  }
  nuxt.vueApp.$toast.success("儲存成功！", {position: "top"})
}
const savingDiscount = ref(false)
async function saveDiscount() {
  savingDiscount.value = true
  const {
    data,
    error
  } = await patchCommerce({
    discount: hasDiscount.value ? tempDiscount.value : null,
    mailingDiscount: hasMailingDiscount.value ? tempMailingDiscount.value : null,
  });
  savingDiscount.value = false
  if (error.value) {
    nuxt.vueApp.$toast.error("儲存失敗，請重新嘗試！", {position: "top"})
    return
  }
  nuxt.vueApp.$toast.success("儲存成功！", {position: "top"})
}

async function patchCommerce(patch: Partial<Omit<IgPageCommerceData, "_id">>) {
  return useFetch(
      '/api/shop/edit/self-commerce',
      {
        headers: headersToObject(await getAuthHeader()),
        method: 'PUT',
        body: patch
      }
  );
}

</script>

<style scoped>
.info-group {
  @apply bg-white rounded-md border p-4 mb-4;
}
</style>
