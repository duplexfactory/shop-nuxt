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
    <div class="table-cell align-top whitespace-nowrap" style="width: 150px">
      <div v-if="editingPrice">
        <input size="1"
               v-model.number="localPrice"
               class="text-input-primary mr-2"
               style="max-width: 120px"
               type="number"/>
        <div class="mt-2">
          <button @click="savePrice" :disabled="editPriceLoading" class="btn-primary btn-sm mr-2">儲存</button>
          <button @click="editingPrice = false" class="btn-outline btn-sm">取消</button>
        </div>
      </div>
      <div v-else class="flex">
        <div class="mr-2">{{ formatMediaPrice(price) }}</div>
        <button @click="localPrice = price; editingPrice = true" class="hover:underline text-pink-600">修改</button>
      </div>
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

      <div v-if="!editingDiscount">
        <div v-if="hasDiscount">{{ mediaCommerceData.discount.title }}</div>
        <div>{{ currentDiscount }}</div>
        <button @click="editDiscount" class="hover:underline text-pink-600 mr-2">修改</button>
        <button v-if="hasDiscount" @click="removeDiscount" class="hover:underline text-red-500">刪除折扣</button>
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
          <button @click="editingDiscount = false" class="btn-outline btn-sm">取消</button>
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
import useMediaPrice from "~/composables/useMediaPrice";

const nuxt = useNuxtApp()
const {getAuthHeader} = useAuth()

const props = defineProps({
  media: Object as PropType<IgMedia>,
  mediaCommerceData: Object as PropType<IgMediaCommerceData>,
})
const {
  media,
  mediaCommerceData
} = toRefs(props)

const emit = defineEmits(["update:mediaCommerceData"])

const editingDiscount = ref(false)
const localDiscount = ref(null)

// Media Price
const editingPrice = ref(false)
const editPriceLoading = ref(false)
const { formatMediaPrice } = useMediaPrice();
// const price = computed({
//   get: () => media.value.patchPrice || media.value.price || 0,
//   set: val => {
//     media.value.patchPrice = val
//   }
// })
const price = computed(() => media.value.patchPrice || media.value.price || 0)
const localPrice = ref(0)
async function savePrice() {
  editPriceLoading.value = true

  try {
    await $fetch(
        `/api/media/${media.value.code}/price/edit`,
        {
          method: 'POST',
          headers: await getAuthHeader(),
          body: {
            price: localPrice.value
          }
        }
    );

    nuxt.vueApp.$toast.success("成功！", {position: "top"});

    media.value.patchPrice = localPrice.value
    editingPrice.value = false
  }
  catch (e) {
    nuxt.vueApp.$toast.error("失敗！", {position: "top"});
  }

  editPriceLoading.value = false
}

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
  editingDiscount.value = true
  if (hasDiscount.value) {
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

async function removeDiscount() {
  if (hasDiscount.value) {
    try {
      await $fetch(
          `/api/media/${media.value.code}/commerce-data/discount`,
          {
            method: 'DELETE',
            headers: await getAuthHeader(),
          }
      );
      nuxt.vueApp.$toast.success("成功！", {position: "top"});

      const data = Object.assign({}, mediaCommerceData.value)
      delete data.discount
      emit("update:mediaCommerceData", data)
    }
    catch (e) {
      nuxt.vueApp.$toast.error("失敗！", {position: "top"});
    }
  }
}

async function createDiscount() {
  try {
    await $fetch(
      `/api/media/${media.value.code}/commerce-data/edit`,
      {
        method: 'PUT',
        headers: await getAuthHeader(),
        body: {
          discount: localDiscount.value
        }
      }
    );

    nuxt.vueApp.$toast.success("成功！", {position: "top"});

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

    editingDiscount.value = false
  }
  catch (e) {
    nuxt.vueApp.$toast.error("失敗！", {position: "top"});
  }
}

const hasDiscount = computed(() => mediaCommerceData.value && mediaCommerceData.value.discount)

const currentDiscount = computed(() => {
  if (!hasDiscount.value) {
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
