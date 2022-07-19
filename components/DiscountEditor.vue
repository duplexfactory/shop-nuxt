<template>
  <div class="text-left">
    <div class="mb-1">折扣名稱（選填）</div>
    <input v-model="value.title"
           class="text-input-primary w-full"
           placeholder="聖誕大減價"/>

    <div class="mt-4">
      <div class="mb-1">折扣條件</div>
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
      </div>
    </div>

    <div class="mt-4">
      <div class="mb-1">折扣類型</div>
      <div class="flex items-center">
        <lazy-spr-select class="mr-2" v-model="value.discountType">
          <option :value="DiscountType.FLAT">實數</option>
          <option :value="DiscountType.RATIO">百分比</option>
        </lazy-spr-select>
        <div class="flex">
          <span v-if="value.discountType === DiscountType.FLAT" class="text-input-prefix-primary">- HK$</span>
          <input size="1"
                 v-model.number="value.discount"
                 type="number"
                 class="text-input-primary"
                 :class="{'text-input-primary--prefixed': value.discountType === DiscountType.FLAT, 'text-input-primary--suffixed': value.discountType === DiscountType.RATIO}"
                 placeholder="折扣"/>
          <span v-if="value.discountType === DiscountType.RATIO" class="text-input-suffix-primary">% off</span>
        </div>
      </div>

    </div>

    <div class="mt-4">
      <div class="mb-1">折扣限期（選填）</div>
      <!-- deadline?: number; -->
      <datepicker
          v-model="localDiscountDeadline"
          class="text-input-primary"
          :lowerLimit="new Date()"
          :clearable="true"
          minimumView="time"
          inputFormat="yyyy-MM-dd HH:mm"
      >
        <template v-slot:clear="{ onClear }">
          <button class="pr-2 right-0" @click="onClear">
            <i class="spr-cancel"></i>
          </button>
        </template>
      </datepicker>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ThresholdType, DiscountType, Discount} from "~/models/Discount";

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

<style>

.v3dp__clearable {
  left: -30px;
}

</style>