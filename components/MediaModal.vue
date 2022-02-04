<template>
  <Modal v-if="showModal" @close="$emit('update:showModal', false)">
    <template v-slot:body>
      <div class="grid grid-cols-8">
        <div class="col-span-4">
          <MediaCardIGEmbed :post-id="mediaCode" :fixed-aspect-ratio="0"></MediaCardIGEmbed>
        </div>
        <div class="col-span-4">
          <div class="px-5 py-2 md:px-6 md:py-3">
            <div class="text-lg md:text-2xl">評論</div>
            <div class="mt-4 flex items-start w-full">
              <textarea v-model="content" class="flex-1 mr-4 border rounded-md p-2" rows="4"></textarea>
              <button @click="sendComment" class="btn btn-primary">發送</button>
            </div>

          </div>
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

<script lang="ts">

export default {
  // pagePk, ip
  data(): { content: string, rating: number } {
    return {
      content: "",
      rating: 0
    };
  },
  methods: {
    async sendComment() {
      await $fetch('/api/review', { method: 'POST', body: {

      }})
    }
  }
}

</script>

