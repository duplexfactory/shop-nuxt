<template>
  <div>
    <!-- First time set up -->
    <template v-if="!commerceData">
      <template v-if="step == Step.INIT">

        <div class="grid grid-cols-3">
          <div v-for="(point, i) in points"
               data-aos="fade-up"
               data-aos-anchor-placement="top-bottom"
               data-aos-duration="1000"
               class="col-span-1 rounded bg-white md:text-center p-4">
            <div class="text-pink-400 text-2xl font-semibold">{{point.title}}</div>
            <!--                <div class="mt-4">{{point.subtitle}}</div>-->
            <div class="mt-4 text-sm">{{point.content}}</div>
          </div>
        </div>

        <div class="flex">
          <div class="w-1/2">

          </div>
          <div class="w-1/2">
            <div class="text-pink-400 font-bold">"迎合你的推廣需要"</div>
            <div class="text-2xl md:text-4xl font-bold mt-1">隨意設定折扣</div>
            <div>你可以在我們的系統上設定折扣類型、折扣條件、折扣期限等等。讓你可以隨心所欲地推廣你的產品。</div>
          </div>
        </div>
        <div class="flex">
          <div class="w-1/2">
            <div class="text-pink-400 font-bold">""</div>
            <div class="text-2xl md:text-4xl font-bold mt-1">方便郵寄</div>
            <div>内置順豐站、順便智能櫃地點，讓顧客可以輕鬆選擇。同時支援面交、到付等郵寄設定。</div>
          </div>
          <div class="w-1/2">

          </div>
        </div>
        <div class="flex">
          <div class="w-1/2">

          </div>
          <div class="w-1/2">
            <div class="text-pink-400 font-bold">""</div>
            <div class="text-2xl md:text-4xl font-bold mt-1">付款方法</div>
            <div></div>
          </div>
        </div>



        <div class="text-xl mt-4">
          設定你的網店後，顧客便可直接在Shoperuse下單購買你的產品！
        </div>
        <div class="mt-2 text-gray-600">
          首次設定時，我們將會逐步指引你設定。設定後，所有資料也可隨時再次修改。
        </div>
        <button class="mt-4 btn-primary" @click="incrementStep">立即開始設定</button>



      </template>
      <div v-else class="info-group !pb-8">

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

          <template v-if="step == Step.MAILING">
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
    </template>

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
const router = useRouter()
const igPageId = useIgPageId()

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
      configCommerceData.value.discount = tempDiscount.value
    }
    if (hasMailingDiscount.value) {
      if (!tempMailingDiscount.value.threshold && (tempMailingDiscount.value.threshold !== 0))
        errorText = errorText ?? "請填寫免郵優惠條件！"
      configCommerceData.value.mailingDiscount = tempMailingDiscount.value
    }

    if (!!errorText) {
      nuxt.$toast.error(errorText)
      return
    }

    savingConfig.value = true
    try {
      await patchCommerce(configCommerceData.value);
      step.value = steps[currentStepIndex.value + 1]
    }
    catch (e) {
      nuxt.$toast.error("設定失敗，請重新嘗試！")
    }
    savingConfig.value = false
  }
  else {
    step.value = steps[currentStepIndex.value + 1]
  }
}

async function navigateToCommerceSettings() {
  if (!!fetchRefresh.value)
    await fetchRefresh.value()
}

function navigateToOrderList() {
  router.push(`/my/order-list`)
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
const {
  pageCommerceData: commerceData,
  fetchPageCommerceData,
  fetchRefresh,
} = useOwnCommerceData()
watch(igPageId, fetchPageCommerceData, {immediate: true})
watch(commerceData, async () => {
  if (!commerceData.value)
    return
  await init()
}, {immediate: true})

async function init() {
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
  try {
    await patchCommerce({
      mailing: commerceData.value.mailing
    })
    nuxt.$toast.success("儲存成功！")
  }
  catch (e) {
    nuxt.$toast.error("儲存失敗，請重新嘗試！")
  }
  savingMailing.value = false
}
const savingPayment = ref(false)
async function savePayment() {
  savingPayment.value = true
  try {
    await patchCommerce({
      paymentMethodData: commerceData.value.paymentMethodData
    });
    nuxt.$toast.success("儲存成功！")
  }
  catch (e) {
    nuxt.$toast.error("儲存失敗，請重新嘗試！")
  }
  savingPayment.value = false
}
const savingDiscount = ref(false)
async function saveDiscount() {
  savingDiscount.value = true
  try {
    await patchCommerce({
      discount: hasDiscount.value ? tempDiscount.value : null,
      mailingDiscount: hasMailingDiscount.value ? tempMailingDiscount.value : null,
    });
    nuxt.$toast.success("儲存成功！")
  }
  catch (e) {
    nuxt.$toast.error("儲存失敗，請重新嘗試！")
  }
  savingDiscount.value = false
}

async function patchCommerce(patch: Partial<Omit<IgPageCommerceData, "_id">>) {
  return $fetch(
      '/api/shop/edit/self-commerce',
      {
        headers: await getAuthHeader(),
        method: 'PUT',
        body: patch
      }
  );
}

// Selling points.
const points = [
  {title: "一店兩用", subtitle: "", content: "Shoperuse與IG上的貼文自動同步，IG發文後可即時在Shoperuse上發售！減省大量設置時間！"},
  {title: "直接收款", subtitle: "", content: "顧客付款時，所有款項不經Shoperuse。顧客直接過數或透過QR Code付款給你。"},
  {title: "訂單管理", subtitle: "", content: "設有訂單管理系統，輕鬆管理訂單狀態及聯絡顧客。"},
]

</script>

<style scoped>
.info-group {
  @apply bg-white rounded-md border p-4 mb-4;
}
</style>
