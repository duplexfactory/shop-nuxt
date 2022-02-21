import {defineNuxtPlugin, useRuntimeConfig} from "#app";
import cryptoJS from "crypto-js";
import Utf8 from 'crypto-js/enc-utf8.js';
import AES from 'crypto-js/aes.js';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    return {
        provide: {
            encryptImageUrl: (url: string) => {
                const code = AES.encrypt(url, config.IMAGE_KEY).toString().replace(/\//g, "-").replace(/\+/g, ".");
                return "/api/image?i=" + code;
            },
            imageUrl: (code: string) => {
                return nuxtApp.$encryptImageUrl('https://www.instagram.com/p/' + code + '/media/?size=m');
            }
        }
    }
});
