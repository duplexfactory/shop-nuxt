<template>
  <div>
    <input v-model="value.title"
           class="text-input-primary w-full"
           placeholder="優惠名稱（選填）"/>
    <div class="mt-4 text-left">
      <div class="mb-1">優惠條件</div>
      <div class="flex items-center">
        <lazy-spr-select class="mr-2" v-model="value.thresholdType">
          <option :value="ThresholdType.COUNT">數量</option>
          <option :value="ThresholdType.VALUE">價錢</option>
        </lazy-spr-select>
        <span>滿{{value.thresholdType === ThresholdType.VALUE ? " HK$" : ""}}</span>
        <input v-model.number="value.threshold"
               type="number"
               class="text-input-primary mx-2"
               :placeholder="value.thresholdType === ThresholdType.VALUE ? '金額' : '數量'"/>
        <span v-if="value.thresholdType === ThresholdType.COUNT">件</span>
        <span>免郵</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ThresholdType, DiscountType, Discount} from "~/models/Discount";
import {MailingDiscount} from "~/models/Discount";

const props = defineProps<{modelValue: MailingDiscount}>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

</script>