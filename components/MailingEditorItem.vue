<template>
  <div class="p-8 bg-white rounded-md text-center">
    <div class="flex items-center">
      <lazy-spr-select v-model="tempMailing.type" class="w-1/2 mr-2">
        <option value="" disabled>郵寄類型</option>
        <option v-for="method in mailingMethods" :key="'mailing-method-' + method" :value="method">{{ mailingTypeToText[method] }}</option>
      </lazy-spr-select>

      <div class="flex items-center justify-between w-1/2 rounded-md border py-2 px-4">
        <div class="mr-2">到付</div>
        <lazy-basic-toggle v-model="tempMailing.payOnArrive"></lazy-basic-toggle>
      </div>
    </div>

    <input class="w-full text-input-primary mt-2"
           v-model="tempMailing.title"
           type="text"
           name="mailing"
           :placeholder="tempMailingTitlePlaceholder"/>
    <div class="flex flex-1 mt-2">
      <div class="flex-0 text-input-prefix-primary">HK$</div>
      <input size="1" class="flex-1 w-full text-input-primary text-input-primary--prefixed" v-model.number="tempMailing.cost" type="number" name="mailing-cost" placeholder="郵寄費用（免費請填0）"/>
    </div>
    <div class="mt-1 text-sm text-gray-700 w-full text-left">
      *到付而且不知道運費請留空。
    </div>

    <div class="mt-8 flex justify-center w-full">
      <button class="btn-outline mr-8" @click="addMailing">增加 +</button>
      <button class="text-pink-400" @click="cancel">取消</button>
    </div>

  </div>
</template>

<script setup lang="ts">

import {Mailing, MailingType} from "~/models/Order";
import {Ref} from "vue";
import {mailingMethods, mailingTypeToText} from "~/data/commerce";
import {PaymentMethodData} from "~/models/IgPageCommerceData";

const props = defineProps<{mailing: Mailing}>()
const emit = defineEmits(["save", "cancel"])

const nuxt = useNuxtApp()
const {
  auth,
  getAuthHeader,
  headersToObject
} = useAuth()

const tempMailing: Ref<Mailing> = ref(null)
const tempMailingTitlePlaceholder = computed(() =>
    [MailingType.SF_STATION, MailingType.SF_LOCKER].includes(tempMailing.value.type) ?
        "郵寄説明（e.g. 參考運費 $16/kg）" :
        "郵寄方法（e.g. 面交、平郵）"
)
// function payOnArriveChanged() {
//   tempMailing.value.cost = tempMailing.value.payOnArrive ? 0 : null
// }

onMounted(() => {
  if (props.mailing !== null) {
    tempMailing.value = Object.assign({}, props.mailing)
  }
})

function resetTempMailing() {
  tempMailing.value = {
    title: "",
    type: MailingType.SF_STATION,
    cost: null,
    payOnArrive: false
  }
}

resetTempMailing()

function addMailing() {
  if (tempMailing.value.title == "") {
    nuxt.vueApp.$toast.error(
        `請填寫${[MailingType.SF_STATION, MailingType.SF_LOCKER].includes(tempMailing.value.type) ? "郵寄説明" : "郵寄方法"}！`,
        {position: "top"}
    );
    return
  }
  if (!tempMailing.value.cost && (tempMailing.value.cost !== 0) && !tempMailing.value.payOnArrive) {
    // Not pay on arrive but unknown cost.
    nuxt.vueApp.$toast.error("請填寫郵寄費用！", {position: "top"});
    return
  }

  // Emit save
  emit('save', tempMailing.value)

  resetTempMailing()
}

function cancel() {
  // Emit cancel
  emit('cancel')
}



</script>
