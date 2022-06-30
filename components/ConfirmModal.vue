<template>
  <Modal>
    <template #header>
      <slot name="header"></slot>
    </template>
    <template #body>
      <slot name="body"></slot>
    </template>
    <template #footer>
      <button class="w-1/2 p-4" @click="$emit('close')">{{ cancelButtonTitle }}</button>
      <button class="w-1/2 p-4 bg-pink-400 text-white" @click="$emit('confirm')">{{ confirmButtonTitle }}</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">

const {
  cancelButtonTitle,
  confirmButtonTitle
} = defineProps({
  cancelButtonTitle: { type: String, default: "" },
  confirmButtonTitle: { type: String, default: "" },
})

</script>