<template>
  <div class="table-row">
    <div class="table-cell">
      <div class="image-container aspect-square rounded-md overflow-hidden"
           style="width: 90px"
           v-lazy:background-image="media.mediaUrl || $imageUrl(media.code)"></div>
    </div>
    <div class="table-cell align-top text-sm whitespace-pre-wrap break-words overflow-hidden">
      <div class="line-clamp-7">
        {{ media.caption }}
      </div>
    </div>
    <div class="table-cell align-top">
      <input size="1"
             v-model.number="price"
             class="text-input-primary"
             type="number"/>
    </div>
    <div class="table-cell align-top">
      <lazy-spr-select class="mr-4" style="min-width: 80px" v-model="active">
        <option :value="true">是</option>
        <option :value="false">否</option>
      </lazy-spr-select>
    </div>
    <div class="table-cell align-top">
      <lazy-spr-select class="mr-4" style="min-width: 80px" v-model="customPrice">
        <option :value="true">是</option>
        <option :value="false">否</option>
      </lazy-spr-select>
    </div>
    <div class="table-cell align-top whitespace-nowrap">

      <div v-if="!editing">
        <span class="mr-2">{{ currentDiscount }}</span>
        <button @click="editDiscount" class="hover:underline text-pink-600">修改</button>
      </div>

      <template v-else>

        <input v-model="localDiscount.title"
               class="text-input-primary w-full"
               placeholder="折扣名稱（選填）"/>

        <div class="mt-4">
          <span class="font-semibold mb-1">折扣條件</span>
          <div class="mb-1">
            <lazy-spr-select v-model="localDiscount.thresholdType">
              <option :value="ThresholdType.COUNT">數量</option>
              <option :value="ThresholdType.VALUE">價錢</option>
            </lazy-spr-select>
          </div>
          <div>
            <span>滿{{localDiscount.thresholdType === ThresholdType.VALUE ? " HK$" : ""}}</span>
            <input v-model.number="localDiscount.threshold"
                   type="number"
                   class="text-input-primary mx-2"
                   placeholder="折扣"/>
            <span v-if="localDiscount.thresholdType === ThresholdType.COUNT">件</span>
          </div>
          <!-- thresholdType: ThresholdType; // COUNT, VALUE -->
          <!-- threshold: number; -->
        </div>

        <div class="mt-4">
          <span class="font-semibold mb-1">折扣類型</span>
          <div class="mb-1">
            <lazy-spr-select v-model="localDiscount.discountType">
              <option :value="DiscountType.FLAT">實數</option>
              <option :value="DiscountType.RATIO">百分比</option>
            </lazy-spr-select>
            <!-- discountType: DiscountType; // FLAT, RATIO -->
          </div>
          <div>
            <span v-if="localDiscount.discountType === DiscountType.FLAT" class="mr-2">- HK$</span>
            <input size="1"
                   v-model.number="localDiscount.discount"
                   type="number"
                   class="text-input-primary"
                   placeholder="折扣"/>
            <span v-if="localDiscount.discountType === DiscountType.RATIO" class="ml-2">% off</span>
          </div>
        </div>

        <div class="mt-4">
          <span class="font-semibold">折扣限期（選填）</span>
          <!-- deadline?: number; -->
        </div>

        <div class="mt-4">
          <button @click="createDiscount" class="btn-primary btn-sm mr-2">儲存</button>
          <button @click="editing = false" class="btn-outline btn-sm">取消</button>
        </div>

      </template>

    </div>
  </div>
</template>
<script setup lang="ts">

import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {ThresholdType, DiscountType} from "~/models/Discount";

const props = defineProps({
  media: Object as PropType<IgMedia>,
  mediaCommerceData: Object as PropType<IgMediaCommerceData>,
})
const {
  media,
  mediaCommerceData
} = toRefs(props)

const emit = defineEmits(["update:mediaCommerceData"])

const editing = ref(false)
const localDiscount = ref(null)

const price = computed({
  get: () => media.value.patchPrice || media.value.price || 0,
  set: val => {
    media.value.patchPrice = val
  }
})

const active = computed({
  get: () => !!mediaCommerceData.value ? mediaCommerceData.value.active : false,
  set: val => {
    if (!mediaCommerceData.value) {
      const data: IgMediaCommerceData = {
        _id: media.value.code,
        active: val,
        customPrice: false,
      }
      emit("update:mediaCommerceData", data)
    }
    else {
      mediaCommerceData.value.active = val
    }
  }
})

const customPrice = computed({
  get: () => {
    return !!mediaCommerceData.value ? mediaCommerceData.value.customPrice : false
  },
  set: val => {
    if (!mediaCommerceData.value) {
      const data: IgMediaCommerceData = {
        _id: media.value.code,
        active: false,
        customPrice: val,
      }
      emit("update:mediaCommerceData", data)
    }
    else {
      mediaCommerceData.value.customPrice = val
    }
  }
})

function editDiscount() {
  editing.value = true
  if (mediaCommerceData.value && mediaCommerceData.value.discount) {
    localDiscount.value = Object.assign({}, mediaCommerceData.value.discount)
  }
  else {
    localDiscount.value = {
      thresholdType: ThresholdType.COUNT, // COUNT, VALUE
      discountType: DiscountType.FLAT, // FLAT, RATIO
      threshold: 1,
      discount: 0,
    }
  }
}

function createDiscount() {
  let data: IgMediaCommerceData
  if (!mediaCommerceData.value) {
   data = {
      _id: media.value.code,
      active: false,
      customPrice: false,
    }
  }
  else {
    data = Object.assign({}, mediaCommerceData.value)
  }
  data.discount = localDiscount.value
  emit("update:mediaCommerceData", data)
  editing.value = false
}


const currentDiscount = computed(() => {
  if (mediaCommerceData.value == null || mediaCommerceData.value.discount == null) {
    return "沒有折扣"
  }

  let text = ""
  if (mediaCommerceData.value.discount.thresholdType === ThresholdType.COUNT) {
    text += `滿 ${mediaCommerceData.value.discount.threshold}件`
  }
  else if (mediaCommerceData.value.discount.thresholdType === ThresholdType.VALUE) {
    text += `滿 HK$ ${mediaCommerceData.value.discount.threshold}`
  }

  if (mediaCommerceData.value.discount.discountType === DiscountType.FLAT) {
    text += `，- HK$ ${mediaCommerceData.value.discount.discount}`
  }
  else if (mediaCommerceData.value.discount.discountType === DiscountType.RATIO) {
    text += `，${mediaCommerceData.value.discount.discount}% off`
  }

  return text

})

</script>

<style scoped>

.table-cell {
  border-collapse: collapse;
  @apply border;
}

.table-cell {
  @apply p-2;
}

</style>
