<template>
  <div class="p-8 bg-white rounded-md text-left">
    <div class="mb-4 flex items-center">
      <lazy-spr-select @change="tempPaymentTypeChanged" v-model="tempPaymentType">
        <option value="" disabled>付款方法</option>
        <option v-for="method in paymentMethods" :key="'payment-method-' + method" :value="method">{{ paymentMethodsToText[method] }}</option>
      </lazy-spr-select>
    </div>

    <template v-if="tempPaymentType === PaymentType.BANK_TRANSFER">
      <div class="flex items-center">
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
      <div class="flex items-center">
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
      <div class="flex items-center">
        <span>描述</span>
        <input v-model="tempPaymentMethodData.description"
               size="1"
               class="w-full flex-1 ml-2 text-input-primary"
               type="text"
               name="in-person-description"
               placeholder="（e.g. 旺角門市付款、面交付款）"/>
      </div>
    </template>

    <template v-if="[PaymentType.PAYME, PaymentType.WECHAT_PAY_HK, PaymentType.ALIPAY_HK].includes(tempPaymentType)">
      <div>QR Code照片</div>
      <div class="mt-2">
        <img v-if="!!tempPaymentImageFileUrl || !!tempPaymentMethodData.qrCodeUrl"
             :src="tempPaymentImageFileUrl || tempPaymentMethodData.qrCodeUrl"
             class="mb-2"
             style="max-width: 150px; max-height: 150px;"/>
        <input ref="inputFile" type="file" @change="handleFileSelection( $event )"/>
      </div>
    </template>

    <div class="mt-8 flex justify-center w-full">
      <button class="btn-outline mr-8" @click="addPayment">增加 +</button>
      <button class="text-pink-400" @click="cancel">取消</button>
    </div>

  </div>
</template>

<script lang="ts" setup>

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

const props = defineProps<{paymentMethodData: PaymentMethodData}>()
const emit = defineEmits(["save", "cancel"])

const nuxt = useNuxtApp()
const {
  auth,
  getAuthHeader,
  headersToObject
} = useAuth()

const tempPaymentType = ref(PaymentType.BANK_TRANSFER)
const tempPaymentMethodData: Ref<PaymentMethodData> = ref({
  method: PaymentType.BANK_TRANSFER,
  bank: "",
  accountNumber: null,
  accountName: "",
})
const tempPaymentImageFile = ref(null)
const tempPaymentImageFileUrl = ref(null)

const inputFile = ref(null)

onMounted(() => {
  if (props.paymentMethodData !== null) {
    tempPaymentMethodData.value = Object.assign({}, props.paymentMethodData)
    tempPaymentType.value = tempPaymentMethodData.value.method
  }
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
  else if ([PaymentType.PAYME, PaymentType.WECHAT_PAY_HK, PaymentType.ALIPAY_HK].includes(tempPaymentType.value)) {
    tempPaymentMethodData.value = {
      method: tempPaymentType.value,
      qrCodeUrl: "",
    } as QRCodePaymentMethodData
  }
}


function handleFileSelection( event ){
  const uploadedFiles = event.target.files;
  if (uploadedFiles.length != 0) {
    tempPaymentImageFile.value = uploadedFiles[0]

    const reader = new FileReader();
    reader.onloadend = function() {
      tempPaymentImageFileUrl.value = reader.result;
    }
    reader.readAsDataURL(tempPaymentImageFile.value);
  }
}

async function addPayment() {
  if (tempPaymentType.value === PaymentType.BANK_TRANSFER) {
    const d = tempPaymentMethodData.value as BankTransferPaymentMethodData

    let errorText: string | undefined
    if (d.bank == "")
      errorText = errorText ?? "請填寫銀行名稱！"
    if (d.accountNumber == null)
      errorText = errorText ?? "請填寫戶口號碼！"
    if (d.accountName == "")
      errorText = errorText ?? "請填寫戶口名稱！"
    if (!!errorText) {
      nuxt.vueApp.$toast.error(errorText, {position: "top"})
      return
    }
  }
  else if (tempPaymentType.value === PaymentType.FPS) {
    const d = tempPaymentMethodData.value as FPSPaymentMethodData
    let errorText: string | undefined
    if (d.phone == "")
      errorText = errorText ?? "請填寫電話號碼！"
    if (d.account == "")
      errorText = errorText ?? "請填寫收款賬戶！"
    if (d.accountName == "")
      errorText = errorText ?? "請填寫戶口名稱！"
    if (!!errorText) {
      nuxt.vueApp.$toast.error(errorText, {position: "top"})
      return
    }
  }
  else if (tempPaymentType.value === PaymentType.IN_PERSON) {
    const d = tempPaymentMethodData.value as InPersonPaymentMethodData
    let errorText: string | undefined
    if (d.description == "")
      errorText = errorText ?? "請填寫描述！"
    if (!!errorText) {
      nuxt.vueApp.$toast.error(errorText, {position: "top"})
      return
    }
  }
  else if ([PaymentType.PAYME, PaymentType.WECHAT_PAY_HK, PaymentType.ALIPAY_HK].includes(tempPaymentType.value)) {
    const d = tempPaymentMethodData.value as QRCodePaymentMethodData
    let errorText: string | undefined
    if (tempPaymentImageFile.value == null)
      errorText = errorText ?? "請上載QR Code照片！"
    if (!!errorText) {
      nuxt.vueApp.$toast.error(errorText, {position: "top"})
      return
    }

    // Upload image first.
    let formData = new FormData();
    formData.append( 'image', tempPaymentImageFile.value);
    if (!!d.qrCodeUrl) {
      // Delete existing image.
      const splitted = d.qrCodeUrl.split("/")
      await useFetch(
          `/api/file/payment/${splitted[splitted.length - 1]}`,
          {
            headers: headersToObject(await getAuthHeader()),
            method: 'DELETE',
          }
      )
    }
    const {
      url
    } = await $fetch(
        '/api/file/payment',
        {
          headers: await getAuthHeader(),
          method: 'POST',
          params: {
            type: tempPaymentType.value
          },
          body: formData
        }
    );
    d.qrCodeUrl = url;

  }

  // Emit save
  emit('save', tempPaymentMethodData.value)

  // Reset data and UI
  tempPaymentMethodData.value = {
    method: PaymentType.BANK_TRANSFER,
    bank: "",
    accountNumber: null,
    accountName: "",
  } as BankTransferPaymentMethodData
  tempPaymentImageFile.value = null
  tempPaymentImageFileUrl.value = null
  if (!!inputFile.value)
    inputFile.value.value = null
}

function cancel() {
  // Emit cancel
  emit('cancel')
}

</script>