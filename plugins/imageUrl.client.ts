import {defineNuxtPlugin, useRuntimeConfig} from "#app";
import {AES} from "crypto-js";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    return {
        provide: {
            encryptImageUrl: (url: string) => {
                const code = AES.encrypt(url, config.IMAGE_KEY).toString().replace(/\//g, "-").replace(/\+/g, ".");
                return "api/image?i=" + code;
            },
        }
    }
});
