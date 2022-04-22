<template>

  <div class="w-full">
    <div v-for="config in configs()" class="w-full" :class="`${config.classBreakpoint}flex ${config.nextClassBreakpoint}:hidden`">
      <template v-for="(_, i) of Array(Math.ceil(config.slidesPerView)).fill(0)">
        <div :style="slideStyle(config.spaceBetween, config.slidesPerView, i)">
          <slot></slot>
        </div>
      </template>
    </div>
  </div>



</template>

<script lang="ts">
import {PropType} from "vue";
import {SwiperOptions} from "swiper/types/swiper-options";

export default {
  components: {},
  props: {
    swiperOptions: Object as PropType<SwiperOptions>,
    slideAspectRatio: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },

  methods: {
    slideStyle: function (spaceBetween: number, slidesPerView: number, index: number) {
      const lastIndex = Math.ceil(slidesPerView) - 1;
      if (index == lastIndex) {
        return 'flex: 1;';
      }

      if (this.slideAspectRatio !== 0) {
        return `aspect-ratio: ${this.slideAspectRatio}; margin-right: ${spaceBetween}px; width: calc(${100 / slidesPerView}% - ${(spaceBetween * (slidesPerView - 1) / slidesPerView)}px);`;
      }
      else {
        return `margin-right: ${spaceBetween}px; height: ${this.height}px; flex: 1;`;
      }
    },

    configs(): { classBreakpoint: string; nextClassBreakpoint: string, spaceBetween: number; slidesPerView: number; }[] {
      // configs() {
      let spaceBetween: number | undefined = this.swiperOptions.spaceBetween;
      let slidesPerView: number | undefined = this.swiperOptions.slidesPerView;

      const a = [{
        classBreakpoint: '',
        nextClassBreakpoint: 'lg',
        spaceBetween,
        slidesPerView
      }];
      for (const key of Object.keys(this.swiperOptions.breakpoints)) {
        if (!isNaN(Number(key))) {
          const width = Number(key);
          spaceBetween = this.swiperOptions.breakpoints[Number(key)].spaceBetween;
          slidesPerView = this.swiperOptions.breakpoints[Number(key)].slidesPerView;
          let classBreakpoint;
          let nextClassBreakpoint;
          if (width == 1024) {
            classBreakpoint = 'hidden lg:';
            nextClassBreakpoint = 'xl';
          }
          else if (width == 1280) {
            classBreakpoint = 'hidden xl:';
            nextClassBreakpoint = '2xl';
          }
          else if (width == 1536) {
            classBreakpoint = 'hidden 2xl:';
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

<style scoped>

</style>
