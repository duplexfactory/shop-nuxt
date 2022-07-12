<template>
  <div>
    <template v-if="!commerceData">
      <div class="info-group">

        <!-- Stepper -->
        <div v-if="step != Step.INIT" class="flex items-center mb-4">
          <div v-for="(s, i) in steps.slice(1)"
               :key="s"
               class="h-1 mr-2"
               :class="currentStepIndex > i ? 'bg-pink-400' : 'bg-gray-200'"
               :style="'width: ' + (100 / (steps.length - 1)) + '%'"></div>
          <div class="text-xs text-gray-500">{{ currentStepIndex }}/{{ steps.length - 1 }}</div>
        </div>

        <div class="text-center w-full md:w-3/5 mx-auto">
          <template v-if="step == Step.INIT">
            <div class="">
              設定你的網店後，顧客便可直接在Shoperuse上下單購買你的產品！
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

            <LazyMailingEditor class="mt-4" v-model="configCommerceData"></LazyMailingEditor>

            <button class="mt-4 btn-primary" :disabled="configCommerceData.mailing.length === 0" @click="incrementStep">下一步</button>
          </template>
          <template v-else-if="step == Step.PAYMENT">
            <div class="text-2xl">
              付款方法
            </div>
            <div class="text-gray-500">
              顧客將會直接付款給你，所有款項皆不會經過Shoperuse。
            </div>

            <div class="mt-4">
              <div class="flex items-center">
                <lazy-spr-select @change="tempPaymentTypeChanged" v-model="tempPaymentType">
                  <option value="" disabled>付款方法</option>
                  <option v-for="method in paymentMethods" :key="'payment-method-' + method" :value="method">{{ paymentMethodsToText[method] }}</option>
                </lazy-spr-select>
              </div>

              <template v-if="tempPaymentType === PaymentType.BANK_TRANSFER">
                <div class="mt-2 flex items-center">
                  <span>銀行名稱</span>
                  <input v-model="tempPaymentMethodData.bank"
                         size="1"
                         class="w-full flex-1 ml-2 text-input-primary"
                         type="text"
                         name="bank"
                         placeholder="（e.g. HSBC）"/>
                </div>
                <div class="mt-2 flex items-center">
                  <div>戶口號碼</div>
                  <input v-model.number="tempPaymentMethodData.accountNumber"
                         size="1"
                         class="w-full flex-1 ml-2 text-input-primary"
                         type="number"
                         name="bank"
                         placeholder=""/>
                </div>
                <div class="mt-2 flex items-center">
                  <div>戶口名稱</div>
                  <input v-model="tempPaymentMethodData.accountName"
                         size="1"
                         class="w-full flex-1 ml-2 text-input-primary"
                         type="text"
                         name="account-name"
                         placeholder="（e.g. Chan Tai Man）"/>
                </div>
              </template>

              <template v-if="tempPaymentType === PaymentType.FPS">
                <div class="mt-2 flex items-center">
                  <span>電話號碼</span>
                  <input v-model="tempPaymentMethodData.phone"
                         size="1"
                         class="w-full flex-1 ml-2 text-input-primary"
                         type="text"
                         name="phone"
                         placeholder="（e.g. 91234567）"/>
                </div>
                <div class="mt-2 flex items-center">
                  <div>收款賬戶</div>
                  <input v-model="tempPaymentMethodData.account"
                         size="1"
                         class="w-full flex-1 ml-2 text-input-primary"
                         type="text"
                         name="account"
                         placeholder=""/>
                </div>
                <div class="mt-2 flex items-center">
                  <div>戶口名稱</div>
                  <input v-model="tempPaymentMethodData.accountName"
                         size="1"
                         class="w-full flex-1 ml-2 text-input-primary"
                         type="text"
                         name="account-name"
                         placeholder="（e.g. Chan Tai Man）"/>
                </div>
              </template>

              <template v-if="tempPaymentType === PaymentType.IN_PERSON">
                <div class="mt-2 flex items-center">
                  <span>描述</span>
                  <input v-model="tempPaymentMethodData.description"
                         size="1"
                         class="w-full flex-1 ml-2 text-input-primary"
                         type="text"
                         name="in-person-description"
                         placeholder="（e.g. 旺角門市付款、面交付款）"/>
                </div>
              </template>

              <button class="btn-outline mt-2 ml-2" @click="addPayment">增加 +</button>
            </div>

            <hr class="my-4"/>

            <div class="p-6 bg-gray-100 rounded-md text-center">
              <div v-if="configCommerceData.paymentMethodData.length === 0">
                <div class="text-lg">沒有付款方法</div>
                <div class="my-1 text-sm text-gray-500">
                  請增加最少一種付款方法以繼續。
                </div>
              </div>
              <template v-else>
                <div v-for="(paymentMethodData, i) in configCommerceData.paymentMethodData"
                     :key="paymentMethodData.method + '-' + i"
                     :class="{'mt-2': i !== 0}"
                     class="flex bg-white rounded-md p-4">
                  <div class="flex-1 text-left">
                    <div class="inline-block border text-lg bg-white rounded-md py-1 px-2">{{ paymentMethodsToText[paymentMethodData.method] }}</div>
                    <template v-if="paymentMethodData.method === PaymentType.BANK_TRANSFER">
                      <div class="mt-1">{{ "銀行名稱：" + paymentMethodData.bank }}</div>
                      <div class="mt-1">{{ "戶口號碼：" + paymentMethodData.accountNumber }}</div>
                      <div class="mt-1">{{ "戶口名稱：" + paymentMethodData.accountName }}</div>
                    </template>
                    <template v-if="paymentMethodData.method === PaymentType.FPS">
                      <div class="mt-1">{{ "電話號碼：" + paymentMethodData.phone }}</div>
                      <div class="mt-1">{{ "收款賬戶：" + paymentMethodData.account }}</div>
                      <div class="mt-1">{{ "戶口名稱：" + paymentMethodData.accountName }}</div>
                    </template>
                    <template v-if="paymentMethodData.method === PaymentType.IN_PERSON">
                      <div class="mt-1">{{ "描述：" + paymentMethodData.description }}</div>
                    </template>

                  </div>
                  <div>
                    <button @click="configCommerceData.paymentMethodData.splice(i, 1)"><i class="spr-cancel"></i></button>
                  </div>
                </div>
              </template>
            </div>

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
              此優惠適用於你的店鋪内所有的產品。如果只想為特定產品設定優惠，請稍後在「我的貼文」設定。
            </div>

            <LazyDiscountEditor class="mt-4" v-if="hasDiscount" v-model="tempDiscount">
            </LazyDiscountEditor>

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

            <div v-if="hasMailingDiscount" class="mt-4">
              <input v-model="tempMailingDiscount.title"
                     class="text-input-primary w-full"
                     placeholder="優惠名稱（選填）"/>
              <div class="mt-4 text-left">
                <div class="mb-1">優惠條件</div>
                <div class="flex items-center">
                  <lazy-spr-select class="mr-2" v-model="tempMailingDiscount.thresholdType">
                    <option :value="ThresholdType.COUNT">數量</option>
                    <option :value="ThresholdType.VALUE">價錢</option>
                  </lazy-spr-select>
                  <span>滿{{tempMailingDiscount.thresholdType === ThresholdType.VALUE ? " HK$" : ""}}</span>
                  <input v-model.number="tempMailingDiscount.threshold"
                         type="number"
                         class="text-input-primary mx-2"
                         :placeholder="tempMailingDiscount.thresholdType === ThresholdType.VALUE ? '金額' : '數量'"/>
                  <span v-if="tempMailingDiscount.thresholdType === ThresholdType.COUNT">件</span>
                  <span>免郵</span>
                </div>
              </div>
            </div>

            <div class="flex justify-between">
              <button class="mt-4 mr-4 btn-outline" @click="decrementStep">上一步</button>
              <button class="mt-4 btn-primary" @click="incrementStep">完成</button>
            </div>

          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

// Commerce
import {Ref} from "vue"
import {
  BankTransferPaymentMethodData, FPSPaymentMethodData,
  IgPageCommerceData, InPersonPaymentMethodData,
  PaymentMethodData,
  PaymentType, QRCodePaymentMethodData
} from "~/models/IgPageCommerceData"
import {Mailing} from "~/models/Order"
import {paymentMethods, paymentMethodsToText} from "~/data/commerce";
import {Discount, DiscountType, MailingDiscount, ThresholdType} from "~/models/Discount";

const {
  auth,
  getAuthHeader,
  headersToObject
} = useAuth()
const nuxt = useNuxtApp()

const commerceData: Ref<IgPageCommerceData | null> = ref(null)
const commerceDataLoaded = ref(false)

const configCommerceData: Ref<Partial<Omit<IgPageCommerceData, "_id">>> = ref({
  discount: null,
  mailingDiscount: null,
  mailing: [],
  paymentMethodData: []
})

// Steps
enum Step {
  INIT,
  MAILING,
  PAYMENT,
  DISCOUNT
}
const steps = [
  Step.INIT,
  Step.MAILING,
  Step.PAYMENT,
  Step.DISCOUNT
]
const step = ref(Step.INIT)
const currentStepIndex = computed(() => steps.findIndex((s) => s === step.value))
function decrementStep() {
  step.value = steps[currentStepIndex.value - 1]
}
async function incrementStep() {
  if (currentStepIndex.value === steps.length - 1) {
    // Last step.
    let errorText: string | undefined
    if (hasDiscount.value) {
      if (!tempDiscount.value.threshold && (tempDiscount.value.threshold !== 0))
        errorText = errorText ?? "請填寫店鋪折扣條件"
      if (!tempDiscount.value.discount && (tempDiscount.value.discount !== 0))
        errorText = errorText ?? "請填寫店鋪折扣"
    }
    if (hasMailingDiscount.value) {
      if (!tempMailingDiscount.value.threshold && (tempMailingDiscount.value.threshold !== 0))
        errorText = errorText ?? "請填寫免郵優惠條件"
    }

    if (!!errorText) {
      nuxt.vueApp.$toast.error(errorText, {position: "top"});
      return
    }

    const {
      data,
      error
    } = await useFetch(
      '/api/shop/edit/self-commerce',
      { headers: headersToObject(await getAuthHeader()), method: 'PUT', body: configCommerceData.value}
    )
    return
  }
  step.value = steps[currentStepIndex.value + 1]
}

// Payment Method
const tempPaymentType = ref(PaymentType.BANK_TRANSFER)
const tempPaymentMethodData: Ref<PaymentMethodData> = ref({
  method: PaymentType.BANK_TRANSFER,
  bank: "",
  accountNumber: null,
  accountName: "",
})

function tempPaymentTypeChanged() {
  if (tempPaymentType.value === PaymentType.BANK_TRANSFER) {
    tempPaymentMethodData.value = {
      method: PaymentType.BANK_TRANSFER,
      bank: "",
      accountNumber: null,
      accountName: "",
    } as BankTransferPaymentMethodData
  }
  else if (tempPaymentType.value === PaymentType.FPS) {
    tempPaymentMethodData.value = {
      method: PaymentType.FPS,
      phone: "",
      account: "",
      accountName: "",
    } as FPSPaymentMethodData
  }
  else if (tempPaymentType.value === PaymentType.IN_PERSON) {
    tempPaymentMethodData.value = {
      method: PaymentType.IN_PERSON,
      description: ""
    } as InPersonPaymentMethodData
  }
  else {
    tempPaymentMethodData.value = {
      method: tempPaymentType.value,
      qrCodeUrl: "",
    } as QRCodePaymentMethodData
  }
}

function addPayment() {
  if (tempPaymentType.value === PaymentType.BANK_TRANSFER) {
    const d = tempPaymentMethodData.value as BankTransferPaymentMethodData
    if (d.accountNumber == null || d.bank == "" || d.accountName == "") {
      return
    }
  }
  else if (tempPaymentType.value === PaymentType.FPS) {
    const d = tempPaymentMethodData.value as FPSPaymentMethodData
    if (d.phone == "" || d.account == "" || d.accountName == "") {
      return
    }
  }
  else if (tempPaymentType.value === PaymentType.IN_PERSON) {
    const d = tempPaymentMethodData.value as InPersonPaymentMethodData
    if (d.description == "") {
      return
    }
  }
  else {
    const d = tempPaymentMethodData.value as QRCodePaymentMethodData
    if (d.qrCodeUrl == "") {
      return
    }
  }

  configCommerceData.value.paymentMethodData.push(tempPaymentMethodData.value)

  tempPaymentMethodData.value = {
    method: PaymentType.BANK_TRANSFER,
    bank: "",
    accountNumber: null,
    accountName: "",
  } as BankTransferPaymentMethodData
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

</script>

<style scoped>
.info-group {
  @apply bg-white rounded-md border p-4 mb-4;
}
</style>