<script lang="ts">
    import Swiper, { Navigation, Pagination } from 'swiper';
    // import Swiper and modules styles
    import 'swiper/css';
    import 'swiper/css/navigation';
    import 'swiper/css/pagination';
    import {PropType} from "vue";
    import IgPage from '~/models/IgPage';

    // configure Swiper to use modules
    Swiper.use([Navigation, Pagination]);

    export default {
        props: {
            shops: Array as PropType<IgPage[]>
        },
        mounted() {
            const swiper = new Swiper(this.$refs.swiper, {
                // Optional parameters
                // direction: 'vertical',
                // loop: true,

                spaceBetween: 16,
                slidesPerView: 2,
                slidesPerGroup: 2,

                breakpoints: {
                    1024: {
                        // spaceBetween: 32,
                        // slidesPerView: 2,
                        // slidesPerGroup: 2,

                        spaceBetween: 16,
                        slidesPerView: 2.2,
                        slidesPerGroup: 2,
                    },
                    1280: {
                        spaceBetween: 16,
                        slidesPerView: 2.5,
                        slidesPerGroup: 2,
                    },
                    1536: {
                        spaceBetween: 16,
                        slidesPerView: 3,
                        slidesPerGroup: 3,
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
            });
        }
    }
</script>

<template>
    <!-- Slider main container -->
    <div class="swiper" ref="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper pb-8">
            <!-- Slides -->
            <StoreCardSquare v-for="shop in shops"
                             class="swiper-slide"
                             :shop="shop"
                             :key="shop.ig_username + '-store-card-sq'"></StoreCardSquare>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination" style="bottom: 0px !important;"></div>

        <!-- If we need navigation buttons -->
        <div ref="swiperButtonPrev" class="swiper-button-prev"></div>
        <div ref="swiperButtonNext" class="swiper-button-next"></div>

        <!--        &lt;!&ndash; If we need scrollbar &ndash;&gt;-->
        <!--        <div class="swiper-scrollbar"></div>-->
    </div>
</template>
<style>
    .swiper-pagination .swiper-pagination-bullet-active {
        /*background-color: black;*/
        @apply bg-pink-400;
    }

    .swiper-button-next, .swiper-button-prev {
        @apply text-pink-400;
    }
</style>
