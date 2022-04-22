import {defineNuxtPlugin} from "nuxt3/app";
import Toaster from "@meforma/vue-toaster";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Toaster, {
        position: "top-right",
    });
});