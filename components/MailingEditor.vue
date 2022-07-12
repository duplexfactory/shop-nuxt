<template>
  <div>
    <div>
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

      <button class="btn-outline mt-2 " @click="addMailing">增加 +</button>
    </div>

    <hr class="my-4"/>

    <div class="p-6 bg-gray-100 rounded-md text-center">
      <div v-if="value.mailing.length === 0">
        <div class="text-lg">沒有郵寄方法</div>
        <div class="my-1 text-sm text-gray-500">
          請增加最少一種郵寄方法以繼續。
        </div>
      </div>
      <template v-else>
        <div v-for="(mailing, i) in value.mailing"
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
            <button @click="value.mailing.splice(i, 1)"><i class="spr-cancel"></i></button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">

// Mailing
import {Ref} from "vue";
import {Mailing, MailingType} from "~/models/Order";
import {IgPageCommerceData} from "~/models/IgPageCommerceData";
import {mailingMethods, mailingTypeToText} from "~/data/commerce";

const props = defineProps<{modelValue: IgPageCommerceData}>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const tempMailing: Ref<Mailing> = ref(null)
const tempMailingTitlePlaceholder = computed(() =>
    [MailingType.SF_STATION, MailingType.SF_LOCKER].includes(tempMailing.value.type) ?
        "郵寄説明（e.g. 參考運費 $16/kg）" :
        "郵寄方法（e.g. 面交、平郵）"
)
// function payOnArriveChanged() {
//   tempMailing.value.cost = tempMailing.value.payOnArrive ? 0 : null
// }
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
  if (!tempMailing.value.cost && (tempMailing.value.cost !== 0) && !tempMailing.value.payOnArrive) {
    // Not pay on arrive but unknown cost.
    return
  }
  value.value.mailing.push(Object.assign({}, tempMailing.value))
  resetTempMailing()
}
function formatMailingPrice(mailing: Mailing) {
  if (mailing.cost === 0) {
    return "免費"
  }
  if (!mailing.cost) {
    return "到付"
  }
  if (mailing.payOnArrive) {
    return `到付 HK$ ${mailing.cost}`
  }
  return `HK$ ${mailing.cost}`
}
resetTempMailing()

</script>
