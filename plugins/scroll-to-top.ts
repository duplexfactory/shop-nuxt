import {defineNuxtPlugin} from "nuxt3/app";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.$router.options.scrollBehavior = (to, from, savedPosition) => {
        return { left: 0, top: 0 }
    };
});