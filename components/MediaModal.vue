<template>
  <Modal v-if="showModal" @close="$emit('update:showModal', false)">
    <template v-slot:body>
      <div class="grid grid-cols-8">
        <div class="col-span-4">
          <MediaCardIGEmbed :post-id="mediaCode" :fixed-aspect-ratio="0"></MediaCardIGEmbed>
        </div>
        <div class="col-span-4">
          <div class="text-lg md:text-2xl px-5 py-2 md:px-6 md:py-3">評論</div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">

import Modal from "~/components/Modal.vue";

const {mediaCode, showModal} = defineProps({
  mediaCode: { type: String, default: "" },
  showModal: { type: Boolean, default: false },
})

</script>
