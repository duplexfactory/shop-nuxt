<template>
  <div class="p-6 bg-gray-100 rounded-md text-center">
    <div v-for="(paymentMethodData, i) in value.paymentMethodData"
         :key="paymentMethodData.method + '-' + i"
         :class="{'mt-2': i !== 0}">
      <div class="flex bg-white rounded-md p-4">
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
          <template v-if="[PaymentType.PAYME, PaymentType.WECHAT_PAY_HK, PaymentType.ALIPAY_HK].includes(paymentMethodData.method)">
            <div class="mt-2">
              <img :src="paymentMethodData.qrCodeUrl" style="max-width: 150px; max-height: 150px;"/>
            </div>
          </template>
        </div>
        <div>
          <button @click="editingPaymentMethodDataIndex = i">edit</button>
          <button @click="remove(i)"><i class="spr-cancel"></i></button>
        </div>
      </div>

    </div>

    <div @click="editingPaymentMethodDataIndex = -1" class="mt-2 p-6 rounded-md text-center border-dashed border-2 cursor-pointer">
      <div class="text-6xl text-gray-500">+</div>
      <template v-if="value.paymentMethodData.length === 0">
        <div class="text-lg">沒有付款方法</div>
        <div class="my-1 text-sm text-gray-500">
          請增加最少一種付款方法以繼續。
        </div>
      </template>
      <div v-else class="text-lg">新增付款方法</div>
    </div>

    <Teleport to="body">
      <transition name="modal">
        <LazyModal v-if="editingPaymentMethodDataIndex !== null" @close="editingPaymentMethodDataIndex = null">
          <template #container>
            <div class="w-full md:w-1/2">
              <PaymentEditorItem :paymentMethodData="editingPaymentMethodDataIndex === -1 ? null : value.paymentMethodData[editingPaymentMethodDataIndex]"
                                 @save="savePaymentMethodData($event)"
                                 @cancel="editingPaymentMethodDataIndex = null"></PaymentEditorItem>
            </div>
          </template>
        </LazyModal>
      </transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">

// Payment Method
import {
  IgPageCommerceData,
  PaymentMethodData,
  PaymentType,
  QRCodePaymentMethodData
} from "~/models/IgPageCommerceData";
import {paymentMethods, paymentMethodsToText} from "~/data/commerce";
import {Ref} from "vue";

const props = defineProps<{modelValue: IgPageCommerceData}>()
const emit = defineEmits(["update:modelValue", "save"])
const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const nuxt = useNuxtApp()
const {
  auth,
  getAuthHeader,
  headersToObject
} = useAuth()

const editingPaymentMethodDataIndex: Ref<number | null> = ref(null)

function savePaymentMethodData(data) {
  if (editingPaymentMethodDataIndex.value === -1) {
    value.value.paymentMethodData.push(data)
  }
  else {
    value.value.paymentMethodData[editingPaymentMethodDataIndex.value] = data
  }
  editingPaymentMethodDataIndex.value = null
  emit("save")
}

function remove(i: number) {
  value.value.paymentMethodData.splice(i, 1)
  emit("save")
}

</script>