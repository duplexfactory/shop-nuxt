<template>
  <LazyModal @close="close">
    <template v-slot:body>
      <div class="md:grid grid-cols-8 gap-8 pb-8 px-4">
        <div class="col-span-4">
          <MediaCardIGEmbed :post-id="showingMediaModalData.code" :fixed-aspect-ratio="0" :username="showingMediaModalData.username"></MediaCardIGEmbed>
        </div>
        <div class="col-span-4">
          <div class="mt-4 md:mt-0">
            <div class="flex items-center">
              <div class="text-xl md:text-2xl">評論</div>
              <button @click="isShowingCreateReview = true" class="ml-2 btn btn-sm btn-outline">撰寫評論</button>
            </div>

            <!-- Create Review -->
            <ReviewCreateCard v-model:show="isShowingCreateReview" isCollapsible v-model:rating="rating" v-model:content="content" :isCreatingReview="isCreatingReview" @create-review="sendReview()"></ReviewCreateCard>

            <!-- Reviews -->
            <template v-for="review in reviews">
              <ReviewCard :review="review"></ReviewCard>
              <hr/>
            </template>

            <!-- No Reviews -->
            <div v-if="reviews.length == 0" class="mt-2 p-6 bg-gray-100 rounded-md text-lg text-center">
              暫時沒有任何評論
            </div>

          </div>
        </div>
      </div>
    </template>
  </LazyModal>
</template>

<script setup lang="ts">

import IgPageReview from "~/models/IgPageReview";
import useCreateReview from "~/composables/useCreateReview";

import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";

// Media Modal
const showMediaModal =  useShowMediaModal();
const showingMediaModalData = useShowingMediaModalData();

// Create Review
const {
  reviewingCode,
  reviewingPagePk,
  isCreatingReview,
  rating,
  content,
  createReview,
  resetCreateReview
} = useCreateReview();
const isShowingCreateReview = ref<boolean>(false);
reviewingCode.value = showingMediaModalData.value.code;
reviewingPagePk.value = showingMediaModalData.value.pagePk;

const reviews = ref<IgPageReview[]>([]);
await fetchReviews();

watch(
    () => showingMediaModalData.value,
    async (show, prevShow) => {
      if (show) {
        reviewingCode.value = showingMediaModalData.value.code;
        reviewingPagePk.value = showingMediaModalData.value.pagePk;
        await fetchReviews();
      }
    }
)

async function fetchReviews() {
  reviews.value = (await $fetch('/api/reviews', { method: 'GET', params: {
      mediaCode: showingMediaModalData.value.code,
    }}))['reviews'];
}

async function sendReview() {
  await createReview();
  isShowingCreateReview.value = false;
  await fetchReviews();
}

function close() {
  resetCreateReview();
  isShowingCreateReview.value = false;
  reviews.value = [];

  showMediaModal.value = false;
}

</script>