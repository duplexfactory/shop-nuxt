import {defineNuxtPlugin} from "#app";
import VueLazyload from '@jambonn/vue-lazyload';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueLazyload);
});