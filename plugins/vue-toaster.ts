import {defineNuxtPlugin} from "nuxt/app";
import Notifications, {notify} from '@kyvg/vue3-notification'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Notifications);
    return {
        provide: {
            toast: {
                success: (message: string) => {
                    notify({
                        title: message,
                        type: 'success',
                        duration: 4000
                    });
                },
                error: (message: string) => {
                    notify({
                        title: message,
                        type: 'error',
                        duration: 4000
                    });
                }
            }
        }
    }
});
