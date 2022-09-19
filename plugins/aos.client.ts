import {defineNuxtPlugin} from "nuxt/app";
import AOS from "aos";
import "aos/dist/aos.css";

export default defineNuxtPlugin((nuxtApp) => {
    AOS.init();
});