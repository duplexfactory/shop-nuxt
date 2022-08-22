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
      <lazy-basic-toggle v-model="active" @change="activeChanged"></lazy-basic-toggle>
    </div>
<!--    <div class="table-cell align-top">-->
<!--      <lazy-basic-toggle v-model="customPrice"></lazy-basic-toggle>-->
<!--    </div>-->
    <div class="table-cell align-top whitespace-nowrap">

      <template v-if="hasDiscount">
        <div>{{ mediaCommerceData.discount.title }}</div>
        <div>{{ currentDiscount }}</div>
        <div v-if="!!mediaCommerceData.discount.deadline">
          折扣限期：{{ format(new Date(mediaCommerceData.discount.deadline), "dd-MM-yyyy HH:mm") }}
        </div>
      </template>
      <div v-else>
        沒有折扣
      </div>

      <button @click="editDiscount" class="hover:underline text-pink-600 mr-2">修改</button>
      <button v-if="hasDiscount" @click="removeDiscount" class="hover:underline text-red-500">刪除折扣</button>

      <Teleport to="body">
        <transition name="modal">
          <LazyModal v-if="editingDiscount" @close="editingDiscount = false">
            <template #container>
              <div class="bg-white p-4 rounded-md">
                <LazyDiscountEditor v-model="localDiscount"></LazyDiscountEditor>
                <div class="mt-4">
                  <button @click="createDiscount" class="btn-primary btn-sm mr-2">儲存</button>
                  <button @click="editingDiscount = false" class="btn-outline btn-sm">取消</button>
                </div>
              </div>
            </template>
          </LazyModal>
        </transition>
      </Teleport>

    </div>
  </div>
</template>
<script setup lang="ts">

import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import {ThresholdType, DiscountType, Discount} from "~/models/Discount";
import useMediaPrice from "~/composables/useMediaPrice";
import {discountToText} from "~/utils/discountText";
const nuxt = useNuxtApp()
const {getAuthHeader, headersToObject} = useAuth()
import {format} from "date-fns"
import {mediaPrice} from  "~/utils/mediaPrice"

const props = defineProps({
  media: Object as PropType<IgMedia>,
  mediaCommerceData: Object as PropType<IgMediaCommerceData>,
})
const {
  media,
  mediaCommerceData
} = toRefs(props)

const emit = defineEmits(["update:mediaCommerceData", "showConfirmToggleActive"])

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
const price = computed(() => mediaPrice(media.value))
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
function activeChanged() {
  emit("showConfirmToggleActive", media.value.code)
}

const customPrice = computed({
  get: () => {
    return !!mediaCommerceData.value ? mediaCommerceData.value.customPrice : false
  },
  set: async val => {
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


    try {
      await useFetch(
          `/api/media/${media.value.code}/commerce-data/edit`,
          {
            method: 'PUT',
            headers: headersToObject(await getAuthHeader()),
            body: {
              customPrice: val
            } as Partial<IgMediaCommerceData>
          }
      );
      nuxt.vueApp.$toast.success("成功！", {position: "top"});
    }
    catch (e) {
      nuxt.vueApp.$toast.error("失敗！", {position: "top"});
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
    )

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
  return discountToText(mediaCommerceData.value.discount)
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
