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
      <lazy-spr-select class="mr-4" v-model="active">
        <option :value="true">是</option>
        <option :value="false">否</option>
      </lazy-spr-select>
    </div>
    <div class="table-cell align-top">
      <lazy-spr-select class="mr-4" v-model="customPrice">
        <option :value="true">是</option>
        <option :value="false">否</option>
      </lazy-spr-select>
    </div>
    <div class="table-cell align-top">


    </div>
  </div>
</template>
<script setup lang="ts">

import {PropType} from "vue";
import IgMedia from "~/models/IgMedia";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";

const props = defineProps({
  media: Object as PropType<IgMedia>,
  mediaCommerceData: Object as PropType<IgMediaCommerceData>,
})
const {
  media,
  mediaCommerceData
} = toRefs(props)

const emit = defineEmits(["update:mediaCommerceData"])

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
