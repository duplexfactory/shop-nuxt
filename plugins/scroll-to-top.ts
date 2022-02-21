import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.$router.options.scrollBehavior = (to, from, savedPosition) => {
        return { left: 0, top: 0 }
    };
});