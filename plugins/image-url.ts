import {defineNuxtPlugin, useRuntimeConfig} from "nuxt/app";
import AES from 'crypto-js/aes.js';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    return {
        provide: {
            encryptImageUrl: (url: string) => {
                const code = AES.encrypt(url, config.IMAGE_KEY).toString().replace(/\//g, "-").replace(/\+/g, ".");
                return "/api/image?i=" + code;
            },
            imageUrl: (code: string, size: string = "m") => {
                // Size allow m or l
                // return nuxtApp.$encryptImageUrl('https://www.instagram.com/p/' + code + '/media/?size=m');
                return `${config.IMG_PROXY}/image/${code}/?size=${size}`;
            }
        }
    }
});
