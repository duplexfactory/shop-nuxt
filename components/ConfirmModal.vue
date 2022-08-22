<template>
  <Modal>
    <template #container>
      <div class="container mx-auto flex justify-center">
        <div class="bg-white rounded-md overflow-hidden" style="min-width: 250px;">
          <slot name="body"></slot>

          <!--        <div class="flex justify-end mt-2">-->
          <!--          <button @click="submitPrice" class="btn-primary btn-sm mr-2">提交</button>-->
          <!--          <button @click="showPriceSuggestionModal = false" class="btn-outline btn-sm">取消</button>-->
          <!--        </div>-->

          <div>
            <button class="w-1/2 p-4" @click="$emit('close')">{{ cancelButtonTitle }}</button>
            <button class="w-1/2 p-4 bg-pink-400 text-white" @click="$emit('confirm')">{{ confirmButtonTitle }}</button>
          </div>

        </div>
      </div>

    </template>
  </Modal>
</template>

<script setup lang="ts">

const {
  cancelButtonTitle,
  confirmButtonTitle
} = defineProps({
  cancelButtonTitle: { type: String, default: "取消" },
  confirmButtonTitle: { type: String, default: "確定" },
})

</script>