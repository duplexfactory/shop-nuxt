import VueLazyload from './lazy';
import {defineNuxtPlugin} from "nuxt3/app";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueLazyload, {
        lazyComponent: true,
        // set observer to true
        observer: true,

        // optional
        observerOptions: {
            rootMargin: '10px',
            threshold: 0.2
        }
    });
});
