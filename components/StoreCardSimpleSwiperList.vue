<script lang="ts">
    import Swiper, { Navigation, Pagination } from 'swiper';
    // import Swiper and modules styles
    import 'swiper/css';
    import 'swiper/css/navigation';
    import 'swiper/css/pagination';
    import {PropType} from "vue";
    import IgPage from '~/models/IgPage';
    import {SwiperOptions} from "swiper/types/swiper-options";

    // configure Swiper to use modules
    Swiper.use([Navigation, Pagination]);

    export default {
        data() : {
          swiperLoaded: boolean,
          swiperReady: boolean,
          swiperOptions: SwiperOptions
        } {
          return {
            swiperLoaded: false,
            swiperReady: false,
            swiperOptions: {
              // Optional parameters
              // direction: 'vertical',
              // loop: true,

              on: {
                init: () => {
                  console.log("simple init");
                  this.swiperReady = true;
                },
              },

              observer: true,

              spaceBetween: 16,
              slidesPerView: 2,
              slidesPerGroup: 2,

              breakpoints: {
                1024: {
                  spaceBetween: 16,
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                },
                1280: {
                  spaceBetween: 16,
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                },
                1536: {
                  spaceBetween: 16,
                  slidesPerView: 5,
                  slidesPerGroup: 5,
                }
              },

              // If we need pagination
              pagination: {
                el: '.swiper-pagination',
              },

              // Navigation arrows
              navigation: {
                nextEl: this.$refs.swiperButtonNext,
                prevEl: this.$refs.swiperButtonPrev,
              },

              // // And if we need scrollbar
              // scrollbar: {
              //   el: '.swiper-scrollbar',
              // },
            }
          };
        },
        props: {
            shops: Array as PropType<IgPage[]>
        },
        methods: {
          loadSwiper() {
            if (!this.swiperLoaded && this.$refs.swiper) {

              this.swiperLoaded = true;

              // Navigation arrows
              this.swiperOptions.navigation = {
                nextEl: this.$refs.swiperButtonNext,
                prevEl: this.$refs.swiperButtonPrev,
              };

              const swiper = new Swiper(this.$refs.swiper, this.swiperOptions);
            }
          }
        }
    }
</script>

<template>
    <div>
      <swiper-slides-placeholder v-if="!swiperReady || shops.length === 0" :height="268" :swiper-options="swiperOptions" class="pb-8">
        <template v-slot:default="slotProps">
          <div class="h-full w-full bg-loading"></div>
        </template>
      </swiper-slides-placeholder>
      <lazy-component @show="loadSwiper">
        <!-- Slider main container -->
        <div :class="{'hidden': !swiperReady || shops.length === 0}"  class="swiper" ref="swiper">
          <!-- Additional required wrapper -->
          <div class="swiper-wrapper pb-8">
            <!-- Slides -->
            <StoreCardSimple v-for="shop in shops"
                             class="swiper-slide"
                             :shop="shop"
                             :key="shop.username + '-store-card-simple'"></StoreCardSimple>
          </div>
          <!-- If we need pagination -->
          <div class="swiper-pagination" style="bottom: 0px !important;"></div>

          <!-- If we need navigation buttons -->
          <div ref="swiperButtonPrev" class="swiper-button-prev"></div>
          <div ref="swiperButtonNext" class="swiper-button-next"></div>

          <!--        &lt;!&ndash; If we need scrollbar &ndash;&gt;-->
          <!--        <div class="swiper-scrollbar"></div>-->
        </div>
      </lazy-component>
    </div>
</template>