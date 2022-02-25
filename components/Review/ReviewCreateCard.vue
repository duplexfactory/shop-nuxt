<template>
  <div class="overflow-hidden">
    <transition name="accordion">
      <div v-if="!isCollapsible || show" class="mt-2 bg-gray-100 p-4 rounded-md">
        <div class="flex justify-between">
          <LazyReviewStars :rating="rating" @update:rating="$emit('update:rating', $event)" :disabled="isCreatingReview" class="inline"></LazyReviewStars>
          <button v-if="isCollapsible" :disabled="isCreatingReview" @click="$emit('update:show', false)">關閉</button>
        </div>
        <div class="mt-2 w-full">
          <textarea :value="content" @input="$emit('update:content', $event.target.value)" :disabled="isCreatingReview" placeholder="在此輸入你的評論" class="w-full border rounded-md p-2" rows="4"></textarea>
          <button :disabled="isCreatingReview" @click="$emit('create-review')" class="mt-2 btn btn-primary">{{ isCreatingReview ? "發送中" : "發送" }}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">

export default {
  props: {
    show: { type: Boolean, default: true },
    isCollapsible: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    content: { type: String, default: "" },
    isCreatingReview: { type: Boolean, default: false },
  },
  watch: {
    isCreatingReview: function (current, prev) {
      if (prev && !current) {
        // Toast success.
        this.$toast.success(`成功發送！`);
      }
    }
  }
}

</script>

<style scoped>

.accordion-enter-active,
.accordion-leave-active {
  @apply transition duration-500 ease-in-out;
}

.accordion-enter-from,
.accordion-leave-to {
  @apply transform -translate-y-full;
}

</style>