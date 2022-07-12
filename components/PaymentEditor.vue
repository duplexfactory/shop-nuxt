<template>
  <div>
    <div>
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
      <div v-if="value.paymentMethodData.length === 0">
        <div class="text-lg">沒有付款方法</div>
        <div class="my-1 text-sm text-gray-500">
          請增加最少一種付款方法以繼續。
        </div>
      </div>
      <template v-else>
        <div v-for="(paymentMethodData, i) in value.paymentMethodData"
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
            <button @click="value.paymentMethodData.splice(i, 1)"><i class="spr-cancel"></i></button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">

// Payment Method
import {
  BankTransferPaymentMethodData,
  FPSPaymentMethodData,
  IgPageCommerceData,
  InPersonPaymentMethodData,
  PaymentMethodData,
  PaymentType,
  QRCodePaymentMethodData
} from "~/models/IgPageCommerceData";
import {paymentMethods, paymentMethodsToText} from "~/data/commerce";
import {Ref} from "vue";

const props = defineProps<{modelValue: IgPageCommerceData}>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

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

  value.value.paymentMethodData.push(tempPaymentMethodData.value)

  tempPaymentMethodData.value = {
    method: PaymentType.BANK_TRANSFER,
    bank: "",
    accountNumber: null,
    accountName: "",
  } as BankTransferPaymentMethodData
}

</script>