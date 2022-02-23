<template>
  <div class="py-4">
    <template v-for="(_, i) in Array(5)">
      <img v-if="i < review.rating" class="inline-block black-to-yellow-filter" style="width: 28px; height: 28px;" src="~assets/icons/star_filled.png"/>
      <img v-else class="inline-block filter invert-70" style="width: 28px; height: 28px;" src="~assets/icons/star.png"/>
    </template>

    <div class="mt-2 text-lg md:text-xl">
      {{ review.content }}
    </div>
    <div class="mt-2 text-sm md:text-lg text-gray-400">
      {{ createdDateString }}
    </div>
  </div>
</template>
<!--<script lang="ts" setup>-->

<!--</script>-->
<script lang="ts">
  import {PropType} from "vue";
  import IgPageReview from "~/models/IgPageReview";
  import dayjs from "dayjs";

  export default {
    props: {
      review: Object as PropType<IgPageReview>
    },
    computed: {
      createdDateString: function () {
        return dayjs(this.review.created).format('DD/MM/YYYY');
      }
    }
  }
</script>
<style scoped>

</style>
