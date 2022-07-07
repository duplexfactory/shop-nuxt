<template>
  <div>
    <input v-model="value.title"
           class="text-input-primary w-full"
           placeholder="折扣名稱（選填）"/>

    <div class="mt-4">
      <span class="font-semibold mb-1">折扣條件</span>
      <div class="mb-1">
        <lazy-spr-select v-model="value.thresholdType">
          <option :value="ThresholdType.COUNT">數量</option>
          <option :value="ThresholdType.VALUE">價錢</option>
        </lazy-spr-select>
      </div>
      <div>
        <span>滿{{value.thresholdType === ThresholdType.VALUE ? " HK$" : ""}}</span>
        <input v-model.number="value.threshold"
               type="number"
               class="text-input-primary mx-2"
               placeholder="折扣"/>
        <span v-if="value.thresholdType === ThresholdType.COUNT">件</span>
      </div>
      <!-- thresholdType: ThresholdType; // COUNT, VALUE -->
      <!-- threshold: number; -->
    </div>

    <div class="mt-4">
      <span class="font-semibold mb-1">折扣類型</span>
      <div class="mb-1">
        <lazy-spr-select v-model="value.discountType">
          <option :value="DiscountType.FLAT">實數</option>
          <option :value="DiscountType.RATIO">百分比</option>
        </lazy-spr-select>
        <!-- discountType: DiscountType; // FLAT, RATIO -->
      </div>
      <div>
        <span v-if="value.discountType === DiscountType.FLAT" class="mr-2">- HK$</span>
        <input size="1"
               v-model.number="value.discount"
               type="number"
               class="text-input-primary"
               placeholder="折扣"/>
        <span v-if="value.discountType === DiscountType.RATIO" class="ml-2">% off</span>
      </div>
    </div>

    <div class="mt-4">
      <span class="font-semibold mb-1">折扣限期（選填）</span>
      <!-- deadline?: number; -->
      <datepicker
          v-model="localDiscountDeadline"
          class="text-input-primary"
          :lowerLimit="new Date()"
          :clearable="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import {ThresholdType, DiscountType, Discount} from "~/models/Discount";

// const localDiscount = ref(null)
const localDiscountDeadline = computed({
  get: () => {
    return value.value.deadline ? new Date(value.value.deadline) : null
  },
  set: val => {
    if (val == null) {
      value.value.deadline = undefined
    }
    else {
      value.value.deadline = (val as Date).getTime()
    }
  }
})

ref(null)

// const props = defineProps({
//   discount: Object as PropType<Discount>,
// })
// const {
//   discount,
// } = toRefs(props)
//

const props = defineProps<{modelValue: Discount}>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val)
  }
})

</script>

<script lang="ts">

import Datepicker from 'vue3-datepicker';

export default {
  components: { Datepicker }
}

</script>

<style scoped>

</style>