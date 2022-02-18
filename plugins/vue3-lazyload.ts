import {defineNuxtPlugin} from "#app";
import VueLazyload from '@jambonn/vue-lazyload';

export default defineNuxtPlugin((nuxtApp) => {

    console.log('use VueLazyLoad');
    nuxtApp.vueApp.use(VueLazyload);
});