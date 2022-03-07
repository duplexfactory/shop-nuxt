import {defineNuxtPlugin} from "#app";
import VueLazyload from '@jambonn/vue-lazyload';

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