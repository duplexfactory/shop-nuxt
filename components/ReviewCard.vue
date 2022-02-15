<template>
  <div class="p-4">
    <div v-for="_ in review.rating" class="inline-block">
      x
    </div>
    <div class="mt-2 text-xl">
      {{ review.content }}
    </div>
    <div class="mt-2 text-gray-400">
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
