import {defineNuxtPlugin} from "nuxt/app";
import Notifications, {notify} from '@kyvg/vue3-notification'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Notifications);
    return {
        provide: {
            toast: {
                success: (message: string, dummy) => {
                    notify({
                        title: message,
                    });
                },
                error: (message: string, dummy) => {
                    notify({
                        title: message,
                        type: 'error',
                    });
                }
            }
        }
    }
});
