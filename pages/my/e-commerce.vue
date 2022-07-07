<template>
  <div>
    <template v-if="!commerceData">
      <div class="info-group flex justify-center">
        <div class="text-center w-full md:w-3/5">

          <template v-if="configCommerceDataStep == 0">
            <div class="">
              設定你的網店後，用戶便可直接在Shoperuse上下單購買你的產品！
            </div>
            <button class="mt-4 btn-primary" @click="configCommerceDataStep = 1">立即開始設定</button>
          </template>
          <template v-else-if="configCommerceDataStep == 1">
            <div class="text-2xl">
              郵寄方法
            </div>

            <div class="mt-4">

              <div class="flex items-center">
                <lazy-spr-select v-model="tempMailing.type" class="w-1/2 mr-2">
                  <option value="" disabled>郵寄類型</option>
                  <option v-for="method in mailingMethods" :key="'mailing-method-' + method" :value="method">{{ mailingTypeToText[method] }}</option>
                </lazy-spr-select>

                <div class="flex items-center justify-between w-1/2 rounded-md border py-2 px-4">
                  <div class="mr-2">到付</div>
                  <lazy-basic-toggle v-model="tempMailing.payOnArrive" @change="payOnArriveChanged"></lazy-basic-toggle>
                </div>
              </div>

              <div v-if="!tempMailing.payOnArrive" class="flex flex-1 mt-2">
                <div class="flex-0 text-input-prefix-primary">HK$</div>
                <input size="1" class="flex-1 w-full text-input-primary text-input-primary--prefixed" v-model.number="tempMailing.cost" type="number" name="mailing-cost" placeholder="郵寄費用（免費請填0）"/>
              </div>
              <input class="w-full text-input-primary mt-2"
                     v-model="tempMailing.title"
                     type="text"
                     name="mailing"
                     :placeholder="tempMailingTitlePlaceholder"/>
              <button class="btn-outline mt-2 ml-2" @click="addMailing">增加 +</button>
            </div>

            <hr class="my-4"/>

            <div class="p-6 bg-gray-100 rounded-md text-center">
              <div v-if="configCommerceData.mailing.length === 0">
                <div class="text-lg">沒有郵寄方法</div>
                <div class="my-1 text-sm text-gray-500">
                  請增加最少一種郵寄方法以繼續。
                </div>
              </div>
              <template v-else>
                <div v-for="(mailing, i) in configCommerceData.mailing"
                     :key="mailing.title"
                     :class="{'mt-2': i !== 0}"
                     class="flex items-center bg-white rounded-md p-2">
                  <div class="flex-1 text-left">
                    <div class="inline-block border text-sm bg-white rounded-md py-1 px-2 mr-2">{{ mailingTypeToText[mailing.type] }}</div>
                    <div class="inline-block">{{ mailing.title }}</div>
                  </div>
                  <div>
                    <div class="inline-block mr-2">
                      {{ formatMailingPrice(mailing) }}
                    </div>
                    <button @click="configCommerceData.mailing.splice(i, 1)"><i class="spr-cancel"></i></button>
                  </div>
                </div>
              </template>
            </div>

            <button class="mt-4 btn-primary" :disabled="configCommerceData.mailing.length === 0" @click="configCommerceDataStep = 2">下一步</button>

          </template>
          <template v-else-if="configCommerceDataStep == 2">
            <div class="text-2xl">
              付款方法
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

              <button class="btn-outline mt-2 ml-2" @click="addPayment">增加 +</button>
            </div>

            <hr class="my-4"/>

            <div class="p-6 bg-gray-100 rounded-md text-center">
              <div v-if="configCommerceData.paymentMethodData.length === 0">
                <div class="text-lg">沒有付款方法</div>
                <div class="my-1 text-sm text-gray-500">
                  請增加最少一種郵寄方法以繼續。
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

                  </div>
                  <div>
                    <button @click="configCommerceData.paymentMethodData.splice(i, 1)"><i class="spr-cancel"></i></button>
                  </div>
                </div>
              </template>
            </div>

            <button class="mt-4 btn-primary" @click="configCommerceDataStep = 3">下一步</button>

          </template>
          <template v-else-if="configCommerceDataStep == 3">
            <div class="text-2xl">
              店鋪折扣優惠
            </div>
            <LazyDiscountEditor v-model="tempDiscount">
            </LazyDiscountEditor>

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
  IgPageCommerceData,
  PaymentMethodData,
  PaymentType, QRCodePaymentMethodData
} from "~/models/IgPageCommerceData"
import {Mailing, MailingType} from "~/models/Order"
import {mailingMethods, mailingTypeToText, paymentMethods, paymentMethodsToText} from "~/data/commerce";
import {Discount, DiscountType, ThresholdType} from "~/models/Discount";

const commerceData: Ref<IgPageCommerceData | null> = ref(null)
const commerceDataLoaded = ref(false)

const configCommerceDataStep = ref(0)
const configCommerceData = ref({
  discount: null,
  mailing: [],
  paymentMethodData: []
})

// Mailing
const tempMailing: Ref<Mailing> = ref(null)
const tempMailingTitlePlaceholder = computed(() =>
  [MailingType.SF_STATION, MailingType.SF_LOCKER].includes(tempMailing.value.type) ?
      "郵寄説明（e.g. 參考運費 $16/kg）" :
      "郵寄方法（e.g. 面交、平郵）"
)
function payOnArriveChanged() {
  tempMailing.value.cost = tempMailing.value.payOnArrive ? 0 : null
}
function resetTempMailing() {
  tempMailing.value = {
    title: "",
    type: MailingType.SF_STATION,
    cost: null,
    payOnArrive: false
  }
}
function addMailing() {
  if (tempMailing.value.title == "") {
    return
  }
  if (tempMailing.value.cost == null) {
    return
  }
  configCommerceData.value.mailing.push(Object.assign({}, tempMailing.value))
  resetTempMailing()
}
function formatMailingPrice(mailing: Mailing) {
  if (mailing.payOnArrive) {
    return "到付"
  }
  return mailing.cost === 0 ? "免費" : `HK$ ${mailing.cost}`
}
resetTempMailing()

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
const tempDiscount: Ref<Discount> = ref({
  thresholdType: ThresholdType.COUNT, // COUNT, VALUE
  discountType: DiscountType.FLAT, // FLAT, RATIO
  threshold: 1,
  discount: 0,
})
// discount?: Discount;

</script>

<style scoped>
.info-group {
  @apply bg-white rounded-md border p-4 mb-4;
}
</style>