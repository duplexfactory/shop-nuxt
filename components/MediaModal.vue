<template>
  <Modal v-if="props.showModal" @close="$emit('update:showModal', false)">
    <template v-slot:body>
      <div class="grid grid-cols-8">
        <div class="col-span-4">
          <MediaCardIGEmbed :post-id="showingMediaModalData.code" :fixed-aspect-ratio="0"></MediaCardIGEmbed>
        </div>
        <div class="col-span-4">
          <div class="px-5 py-2 md:px-6 md:py-3">
            <div class="text-lg md:text-2xl">評論</div>

            <template v-for="review in reviews">
              <ReviewCard :review="review">
              </ReviewCard>
              <hr/>
            </template>

            <div @mouseenter="toggleHoverStars(true)" @mouseleave="toggleHoverStars(false)">
              <template v-for="(_, i) in Array(5)">
                <img v-if="hovering ? (i < hoverRating) : (i < rating)"
                     @mouseenter="hoverStar(i)"
                     @click="clickStar(i)"
                     class="inline-block"
                     src="~assets/icons/star_filled.png"/>
                <img v-else
                     @mouseenter="hoverStar(i)"
                     @click="clickStar(i)"
                     class="inline-block"
                     src="~assets/icons/star.png"/>
              </template>
            </div>

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
      hoverRating: 0,
      hovering: false
    };
  },
  methods: {
    toggleHoverStars(hovering: boolean) {
      this.hovering = hovering;
    },
    hoverStar(i: number) {
      this.hoverRating = i + 1;
    },
    clickStar(i: number) {
      this.rating = i + 1;
    },
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

