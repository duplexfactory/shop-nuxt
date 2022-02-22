<template>
  <LazyModal v-if="props.showModal" @close="$emit('update:showModal', false)">
    <template v-slot:body>
      <div class="md:grid grid-cols-8 gap-8">
        <div class="col-span-4">
          <MediaCardIGEmbed :post-id="showingMediaModalData.code" :fixed-aspect-ratio="0" :username="showingMediaModalData.username"></MediaCardIGEmbed>
        </div>
        <div class="col-span-4">
          <div class="mt-4 md:mt-0">
            <div class="flex items-center">
              <div class="text-lg md:text-2xl">評論</div>
              <button @click="isShowingCreateComment = true" class="ml-2 btn btn-sm btn-outline">撰寫評論</button>
            </div>

            <div class="overflow-hidden">
              <transition name="accordion">
                <div v-if="isShowingCreateComment" class="mt-2 bg-gray-100 p-4 rounded-md">
                  <div class="flex justify-between">
                    <LazyReviewStars v-model:rating="rating" :disabled="isSendingComment" class="inline"></LazyReviewStars>
                    <button :disabled="isSendingComment" @click="isShowingCreateComment = false">close</button>
                  </div>
                  <div class="mt-2 w-full">
                    <textarea :disabled="isSendingComment" placeholder="在此輸入你的評論" v-model="content" class="w-full border rounded-md p-2" rows="4"></textarea>
                    <button :disabled="isSendingComment" @click="sendComment" class="mt-2 btn btn-primary">{{ isSendingComment ? "發送中" : "發送" }}</button>
                  </div>
                </div>
              </transition>
            </div>


            <template v-for="review in reviews">
              <ReviewCard :review="review">
              </ReviewCard>
              <hr/>
            </template>


          </div>
        </div>
      </div>
    </template>
  </LazyModal>
</template>

<script setup lang="ts">

import {useShowingMediaModalData} from "~/composables/states";
import IgPageReview from "~/models/IgPageReview";

const showingMediaModalData = useShowingMediaModalData();

const props = defineProps({
  showModal: { type: Boolean, default: false },
});

const isSendingComment = ref<boolean>(false);
const isShowingCreateComment = ref<boolean>(false);
const rating = ref<number>(0);
const content = ref<string>("");

const reviews = ref<IgPageReview[]>([]);
watch(
    () => props.showModal,
    async (show, prevShow) => {
      if (show) {
        console.log('get reviews la');
        console.log(showingMediaModalData.value);

        reviews.value = (await $fetch('/api/reviews', { method: 'GET', params: {
            mediaCode: showingMediaModalData.value.code,
          }}))['reviews'];
      }
      else {
        // Reset.
        isSendingComment.value = false;
        isShowingCreateComment.value = false;
        rating.value = 0;
        content.value = "";
      }
    }
)

</script>

<script lang="ts">

export default {
  // pagePk, ip
  methods: {
    async sendComment() {
      this.isSendingComment = true;
      console.log(this.rating);
      console.log(this.content);
      // await $fetch('/api/review', { method: 'POST', body: {
      //   pagePk: this.showingMediaModalData.pagePk,
      //   mediaCode: this.showingMediaModalData.code,
      //   rating: this.rating,
      //   content: this.content,
      // }})
    }
  }
}

</script>

<style scoped>

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.5s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  transform: translateY(-100%);
}

</style>