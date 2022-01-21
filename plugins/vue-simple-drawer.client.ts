import Drawer from 'vue-simple-drawer'
import {defineNuxtPlugin} from "#app";

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component('vue-simple-drawer', Drawer);
})
