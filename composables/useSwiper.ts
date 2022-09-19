import {SwiperOptions} from "swiper/types/swiper-options"
import Swiper from "swiper"

// import Swiper and modules styles
import "swiper/css"

export default function (options: SwiperOptions = {}) {
    const swiper = ref(null)
    const swiperButtonPrev = ref(null)
    const swiperButtonNext = ref(null)
    const swiperLoaded = ref(false)
    const swiperReady = ref(false)
    const swiperOptions = ref<SwiperOptions>(options)
    const swiperObj = ref<Swiper | null>(null)

    function loadSwiper() {
        if (!swiperLoaded.value && swiper.value) {
            swiperLoaded.value = true

            // Navigation arrows
            swiperOptions.value.navigation = {
                nextEl: swiperButtonNext.value,
                prevEl: swiperButtonPrev.value,
            }

            swiperObj.value = new Swiper(swiper.value, swiperOptions.value)
        }
    }

    return {
        swiper,
        swiperButtonPrev,
        swiperButtonNext,
        swiperLoaded,
        swiperReady,
        swiperOptions,
        swiperObj,
        loadSwiper
    }
}
