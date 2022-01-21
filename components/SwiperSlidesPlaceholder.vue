<script lang="ts">
import {PropType} from "vue";
import {SwiperOptions} from "swiper/types/swiper-options";

export default {
  components: {},
  props: {
    swiperOptions: Object as PropType<SwiperOptions>,
    slideAspectRatio: Number
  },

  methods: {
    slideStyle: function (spaceBetween: number, slidesPerView: number, index: number) {
      const lastIndex = Math.ceil(slidesPerView) - 1;
      if (index == lastIndex) {
        return 'flex: 1;';
      }
      return `aspect-ratio: ${this.slideAspectRatio}; margin-right: ${spaceBetween}px; width: calc(${100 / slidesPerView}% - ${(spaceBetween * (slidesPerView - 1) / slidesPerView)}px);`;
    },

    configs(): { classBreakpoint: string; nextClassBreakpoint: string, spaceBetween: number; slidesPerView: number; }[] {
    // configs() {
      let spaceBetween: number | undefined = this.swiperOptions.spaceBetween;
      let slidesPerView: number | undefined = this.swiperOptions.slidesPerView;

      const a = [];
      for (const key of Object.keys(this.swiperOptions.breakpoints)) {
        if (!isNaN(Number(key))) {
          const width = Number(key);
          spaceBetween = this.swiperOptions.breakpoints[Number(key)].spaceBetween;
          slidesPerView = this.swiperOptions.breakpoints[Number(key)].slidesPerView;
          let classBreakpoint = '';
          let nextClassBreakpoint = '';
          if (width == 1024) {
            classBreakpoint = 'lg';
            nextClassBreakpoint = 'xl';
          }
          else if (width == 1280) {
            classBreakpoint = 'xl';
            nextClassBreakpoint = '2xl';
          }
          else if (width == 1536) {
            classBreakpoint = '2xl';
            nextClassBreakpoint = '';
          }
          a.push({
            classBreakpoint,
            nextClassBreakpoint,
            spaceBetween,
            slidesPerView
          });
        }
      }
      return a;
    }
  }
}
</script>

<template>

  <div class="w-full">
    <div v-for="config in configs()" class="w-full" :class="`hidden ${config.classBreakpoint}:flex ${config.nextClassBreakpoint}:hidden`">
      <template v-for="(_, i) of Array(Math.ceil(config.slidesPerView)).fill(0)">
        <div class="bg-red-300"
             :style="slideStyle(config.spaceBetween, config.slidesPerView, i)">
          <slot></slot>
        </div>
      </template>
    </div>
  </div>



</template>

<style scoped>

</style>
