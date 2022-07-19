<template>
  <div class="p-6 bg-gray-100 rounded-md text-center">
    <div v-for="(paymentMethodData, i) in value.paymentMethodData"
         :key="paymentMethodData.method + '-' + i" class="mb-2">
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
            <div class="mt-1">{{ "戶口名稱：" + paymentdMethodData.accountName }}</div>
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
          <button @click="editingPaymentMethodDataIndex = i" class="px-1"><i class="spr-edit"></i></button>
          <button @click="deletePayment(i)" class="px-1"><i class="spr-cancel"></i></button>
        </div>
      </div>

    </div>

    <div @click="editingPaymentMethodDataIndex = -1" class="p-6 rounded-md text-center border-dashed border-2 cursor-pointer">
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

    <Teleport to="body">
      <transition name="modal">
        <LazyConfirmModal v-if="showDeleteConfirmation"
                          cancelButtonTitle="取消"
                          confirmButtonTitle="確定"
                          @close="showDeleteConfirmation = false"
                          @confirm="confirmDelete">
          <template #body>
            <div class="p-4">你是否確定刪除？</div>
          </template>
        </LazyConfirmModal>
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
import {PropType, Ref} from "vue";

const props = defineProps({
  modelValue: { type: Object as PropType<IgPageCommerceData> },
  deleteConfirmation: { type: Boolean, default: false }
})
const emit = defineEmits(["update:modelValue", "save", "delete"])
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

// Deletion
const showDeleteConfirmation = ref(false)
const deletingIndex = ref(null)
function deletePayment(index: number) {
  deletingIndex.value = index
  if (props.deleteConfirmation) {
    showDeleteConfirmation.value = true
    return
  }
  confirmDelete()
}
function confirmDelete() {
  showDeleteConfirmation.value = false
  value.value.paymentMethodData.splice(deletingIndex.value, 1)
  emit("delete")
}

</script>