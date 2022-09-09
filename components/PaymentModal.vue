<template>
  <LazyModal modalContainerClass="!w-full" @close="emit('close')">
    <template #body>
      <div class="p-4 w-full">
        <div class="text-xl">
          {{ "付款 " }}<span class="text-pink-600">{{ formatMediaPrice(amount) }}</span>{{ " 給 " + receiver }}
        </div>
        <div class="mt-4 grid grid-cols-12 gap-8">

          <div class="col-span-12 md:col-span-6">
            <div class="p-4 rounded-md bg-gray-100">
              <div class="font-semibold">付款指示</div>
              <ol class="list-decimal list-inside">
                <li>選擇付款方法。</li>
                <li>根據「轉賬資料」，付款給店鋪。</li>
                <li>上傳付款證明（轉賬截圖/收據/入數紙）。</li>
                <li>按「完成付款」提交。</li>
              </ol>

              <div class="mt-4 text-sm">
                <div>{{ "*如選擇" + paymentMethodsToText[PaymentType.IN_PERSON] + "請跳過第3步。按「完成付款」後等店鋪聯絡即可。" }}</div>
                <div>*按「完成付款」後，付款狀態會變爲「待確認」。</div>
                <div>*如忘記取回入數紙，請到銀行補回，否則有機會被視為付款失敗。</div>
              </div>

            </div>
          </div>

          <div v-if="pageCommerceData" class="col-span-12 md:col-span-6">
            <div class="flex">
              <lazy-spr-select v-model="selectedPaymentMethodData">
                <option :value="null" disabled>請選擇付款方法</option>
                <option v-for="paymentMethodData in pageCommerceData.paymentMethodData"
                        :key="'payment-method-' + paymentMethodData.method"
                        :value="paymentMethodData">{{ paymentMethodsToText[paymentMethodData.method] }}</option>
              </lazy-spr-select>
            </div>

            <div v-if="!!selectedPaymentMethodData">
              <div class="flex-1 text-left mt-4">
                <div class="font-semibold">轉賬資料</div>
                <template v-for="d in paymentInfos" :key="'payment-info-' + d.title">
                  <div v-if="!!d.value" class="mt-1">{{ `${d.title}：${d.value}` }}</div>
                  <div v-if="!!d.imageUrl" class="mt-2">
                    <img :src="d.imageUrl" style="max-width: 150px; max-height: 150px;"/>
                  </div>
                </template>
              </div>
<!--              <div v-if="selectedPaymentMethodData.method !== PaymentType.IN_PERSON" class="mt-4">-->
<!--                <div class="p-6 rounded-md text-center border-dashed border-2">-->
<!--                  <div class="text-6xl text-gray-500">+</div>-->
<!--                  <img v-if="!!tempProofImageFileUrl"-->
<!--                       :src="tempProofImageFileUrl"-->
<!--                       class="mb-2"-->
<!--                       style="max-width: 150px; max-height: 150px;"/>-->
<!--                  <input ref="inputFile" type="file" @change="handleFileSelection( $event )"/>-->
<!--                </div>-->
<!--              </div>-->

              <div v-if="selectedPaymentMethodData.method !== PaymentType.IN_PERSON" class="mt-4">
                <file-selector v-model="files"
                               :allowMultiple="false">
                  <dropzone v-slot="{ hovered }">
                    <div class="block w-full rounded-lg border border-dashed border-gray-400 transition-colors duration-150 flex flex-col py-4 justify-center items-center"
                        :class="{ 'border-blue-200': hovered }">

                      <img v-for="preview in previews" :key="preview" :src="preview" style="max-width: 150px; max-height: 150px;"/>
                      <ul v-if="files.length" class="mb-4">
                        <li v-for="file in files" :key="file.name">
                          {{ file.name }}
                        </li>
                      </ul>
                      <dialog-button class="btn-primary">
                        選擇證明照片
                      </dialog-button>
                      <div class="my-1 text-sm text-gray-500">
                        付款後請上傳證明。
                      </div>
                    </div>
                  </dropzone>
                </file-selector>
              </div>
            </div>

            <button class="btn-primary mt-4"
                    :disabled="isSubmitting || !selectedPaymentMethodData || (selectedPaymentMethodData.method !== PaymentType.IN_PERSON && !files.length)"
                    @click="clickSubmit">完成付款</button>
          </div>


        </div>
      </div>
    </template>
  </LazyModal>
</template>

<script setup lang="ts">

import {IgPageCommerceData, PaymentType, PaymentMethodData} from "~/models/IgPageCommerceData";
import {paymentMethods, paymentMethodsToText} from "~/data/commerce";
import {formatMediaPrice} from "~/utils/mediaPrice";
import type {Ref} from "vue";
import {structurePaymentMethodData} from "~/utils/paymentMethodData";
import {imageUrlFromFile} from "~/utils/imageUrl"

const nuxt = useNuxtApp()

const props = defineProps({
  pageId: { type: String, default: "" },
  orderId: { type: String, default: "" },
  amount: { type: Number, default: 0 },
  receiver: { type: String, default: "" },
})
const {
  pageId,
  orderId,
  amount,
  receiver
} = toRefs(props)

const emit = defineEmits(["close", "submit"])

const pageCommerceData: Ref<IgPageCommerceData | null> = ref(null)
const selectedPaymentMethodData: Ref<PaymentMethodData> = ref(null)
const paymentInfos = computed(() => {
  if (!selectedPaymentMethodData.value)
    return []
  return structurePaymentMethodData(selectedPaymentMethodData.value);
})

const files = ref([])
const previews = ref([])
watch(files, async () => {
  if (files.value.length > 1)
    files.value.splice(0, files.value.length - 1)
  previews.value = await Promise.all(files.value.map(imageUrlFromFile))
})

// const tempPaymentImageFile = ref(null)
// const tempProofImageFileUrl = ref(null)
// function handleFileSelection( event ){
//   const uploadedFiles = event.target.files;
//   if (uploadedFiles.length != 0) {
//     tempPaymentImageFile.value = uploadedFiles[0]
//
//     const reader = new FileReader();
//     reader.onloadend = function() {
//       tempProofImageFileUrl.value = reader.result;
//     }
//     reader.readAsDataURL(tempPaymentImageFile.value);
//   }
// }


onMounted(async () => {
  const {
    data,
    error
  } = await useContentKeyedFetch(`/api/shop/id/${pageId.value}/commerce-data`)
  if (!!data.value) {
    pageCommerceData.value = data.value["commerceData"]
  }
})

const isSubmitting = ref(false)
async function clickSubmit() {
  isSubmitting.value = true
  const body = {
    pageId: pageId.value,
    paymentMethodData: selectedPaymentMethodData.value
  }

  try {
    if (selectedPaymentMethodData.value.method !== PaymentType.IN_PERSON) {
      // Upload image first.
      let formData = new FormData()
      formData.append( 'image', files.value[0])
      const {
        url
      } = await $fetch(
          '/api/file/payment-proof',
          {
            method: 'POST',
            params: {
              orderId: orderId.value,
              pageId: pageId.value
            },
            body: formData
          }
      )
      body["url"] = url
    }

    await $fetch(
        `/api/order/${orderId.value}/payment-proof`,
        {
          method: 'POST',
          body
        })

    isSubmitting.value = false
    nuxt.$toast.success("成功提交！")
    emit("submit")
    emit("close")
  }
  catch (e) {
    isSubmitting.value = false
    nuxt.$toast.error("提交失敗！")
  }

}

</script>

<script lang="ts">

import { FileSelector, Dropzone, DialogButton } from 'vue3-file-selector'

export default {
  components: {
    FileSelector,
    Dropzone,
    DialogButton
  }
}

</script>

<style scoped>

</style>
