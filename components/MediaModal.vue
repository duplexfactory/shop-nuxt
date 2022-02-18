<template>
  <LazyModal v-if="props.showModal" @close="$emit('update:showModal', false)">
    <template v-slot:body>
      <div class="md:grid grid-cols-8 gap-8">
        <div class="col-span-4">
          <MediaCardIGEmbed :post-id="showingMediaModalData.code" :fixed-aspect-ratio="0" :username="showingMediaModalData.username"></MediaCardIGEmbed>
        </div>
        <div class="col-span-4">
          <div class="mt-4 md:mt-0">
            <div class="text-lg md:text-2xl">評論</div>

            <template v-for="review in reviews">
              <ReviewCard :review="review">
              </ReviewCard>
              <hr/>
            </template>

            <LazyReviewStars v-model:rating="rating"></LazyReviewStars>

            <div class="mt-4 lg:flex items-start w-full">
              <textarea placeholder="撰寫評論" v-model="content" class="flex-1 w-full lg:mr-4 border rounded-md p-2" rows="4"></textarea>
              <button @click="sendComment" class="mt-2 lg:mt-0 btn btn-primary">發送</button>
            </div>


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
    }
)

</script>

<script lang="ts">

export default {
  // pagePk, ip
  data(): { content: string, rating: number } {
    return {
      content: "",
      rating: 0,
    };
  },
  methods: {
    async sendComment() {
      await $fetch('/api/review', { method: 'POST', body: {
        pagePk: this.showingMediaModalData.pagePk,
        mediaCode: this.showingMediaModalData.code,
        rating: this.rating,
        content: this.content,
      }})
    }
  }
}

</script>

