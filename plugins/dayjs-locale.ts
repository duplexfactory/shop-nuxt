import dayjs from "dayjs";
import "dayjs/locale/zh-hk";
import relativeTime from "dayjs/plugin/relativeTime.js";
import {defineNuxtPlugin} from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
    // dayjs.locale('zh-hk');
    // dayjs.extend(relativeTime);
});
