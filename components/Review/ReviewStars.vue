<template>
  <div @mouseenter="toggleHoverStars(true)" @mouseleave="toggleHoverStars(false)">
    <template v-for="(_, i) in Array(5)">
      <img v-if="hovering ? (i < hoverRating) : (i < rating)"
           @mouseenter="hoverStar(i)"
           @click="clickStar(i)"
           class="inline-block black-to-yellow-filter"
           src="~assets/icons/star_filled.png"
           style="width: 28px; height: 28px;"/>
      <img v-else
           @mouseenter="hoverStar(i)"
           @click="clickStar(i)"
           class="inline-block filter invert-70"
           src="~assets/icons/star.png"
           style="width: 28px; height: 28px;"/>
    </template>
  </div>
</template>

<script lang="ts">

export default {
  props: {
    rating: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false }
  },
  data(): { hoverRating: number, hovering: boolean } {
    return {
      hoverRating: 0,
      hovering: false
    };
  },
  methods: {
    toggleHoverStars(hovering: boolean) {
      if (this.disabled) return;
      this.hovering = hovering;
    },
    hoverStar(i: number) {
      if (this.disabled) return;
      this.hoverRating = i + 1;
    },
    clickStar(i: number) {
      if (this.disabled) return;
      this.$emit('update:rating', i + 1);
    },
  }
}

</script>
