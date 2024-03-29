<template>
  <div class="table-row">
    <div class="table-cell">
      <div class="image-container aspect-square rounded-md overflow-hidden cursor-pointer"
           style="width: 90px"
           @click="clickMedia"
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
        <div class="mr-8">{{ formatMediaPrice(price) }}</div>
        <div class="">
          <button @click="localPrice = price; editingPrice = true" class="btn-text">
            <i class="spr-edit iconbox mr-2"></i>修改
          </button>
        </div>
      </div>
    </div>
    <div v-if="commerceEditable" class="table-cell align-top">
      <lazy-basic-toggle v-model="active" @change="activeChanged"></lazy-basic-toggle>
    </div>
<!--    <div class="table-cell align-top">-->
<!--      <lazy-basic-toggle v-model="customPrice"></lazy-basic-toggle>-->
<!--    </div>-->
    <div v-if="commerceEditable" class="table-cell align-top whitespace-nowrap">

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

      <button @click="editDiscount" class="hover:underline text-pink-600 mr-2">
        修改
      </button>
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
    <div class="table-cell align-top">
      <div>
        <nuxt-link :to="`/product/${media.code}`" target="_blank">
          <i class="spr-link-ext iconbox mr-2"></i>查看貼文頁面
        </nuxt-link>
      </div>
      <div class="mt-2">
        <button class="btn-text" @click="clickCopyProductLink">
          <i class="spr-docs iconbox mr-2"></i>複製貼文網址
        </button>
      </div>
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

import {format} from "date-fns"
import {mediaPrice} from  "~/utils/mediaPrice"
import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";

const nuxt = useNuxtApp()
const config = useRuntimeConfig()
const {getAuthHeader, headersToObject} = useAuth()

const props = defineProps({
  media: Object as PropType<IgMedia>,
  mediaCommerceData: Object as PropType<IgMediaCommerceData>,
  commerceEditable: { type: Boolean, default: false },
})
const {
  media,
  mediaCommerceData,
  commerceEditable
} = toRefs(props)

const emit = defineEmits(["update:mediaCommerceData", "showConfirmToggleActive"])

// Composables.
const igPageId = useIgPageId()

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

    nuxt.$toast.success("成功！");

    media.value.patchPrice = localPrice.value
    editingPrice.value = false
  }
  catch (e) {
    nuxt.$toast.error("失敗！");
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
      await $fetch(
          `/api/media/${media.value.code}/commerce-data/edit`,
          {
            method: 'PUT',
            headers: await getAuthHeader(),
            body: {
              customPrice: val
            } as Partial<IgMediaCommerceData>
          }
      );
      nuxt.$toast.success("成功！");
    }
    catch (e) {
      nuxt.$toast.error("失敗！");
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
      nuxt.$toast.success("成功！");

      const data = Object.assign({}, mediaCommerceData.value)
      delete data.discount
      emit("update:mediaCommerceData", data)
    }
    catch (e) {
      nuxt.$toast.error("失敗！");
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

    nuxt.$toast.success("成功！");

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
    nuxt.$toast.error("失敗！");
  }
}

const hasDiscount = computed(() => mediaCommerceData.value && mediaCommerceData.value.discount)

const currentDiscount = computed(() => {
  if (!hasDiscount.value) {
    return "沒有折扣"
  }
  return discountToText(mediaCommerceData.value.discount)
})

// Media interaction.
const showMediaModal = useShowMediaModal()
const showingMediaModalData = useShowingMediaModalData()
function clickMedia() {
  // showMediaModal.value = true;
  // showingMediaModalData.value = {
  //   media: media.value,
  //   pageId: igPageId.value
  // };
  window.open(config.DOMAIN + `/product/${media.value.code}`, '_blank').focus()
}

function clickCopyProductLink() {
  navigator.clipboard.writeText(config.DOMAIN + `/product/${media.value.code}`)
  nuxt.$toast.success("已複製此產品的下單網址，可發送給顧客！");
}

</script>

<style scoped>

.table-cell {
  border-collapse: collapse;
  @apply border;
}

.table-cell {
  @apply p-2;
}

a {
  transition: .3s;
  @apply text-gray-600 hover:text-pink-400
}

.btn-text {
  transition: .3s;
  @apply text-gray-600 hover:text-pink-400
}

</style>
