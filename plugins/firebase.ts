import {defineNuxtPlugin, useRuntimeConfig} from "#app";
import {getApps, initializeApp} from "firebase/app";
import {useIsLoggedIn} from "~/composables/states";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
    // Import the functions you need from the SDKs you need

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    const config = useRuntimeConfig();
    const isLoggedIn = useIsLoggedIn();

    if (!getApps().length) {
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: config.FIREBASE_API_KEY,
            authDomain: config.FIREBASE_AUTH_DOMAIN,
            projectId: config.FIREBASE_PROJECT_ID,
            storageBucket: config.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
            appId: config.FIREBASE_APP_ID
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        // const auth = getAuth(app);
        // isLoggedIn.value = await new Promise((resolve: any, reject: any) =>
        //     onAuthStateChanged(auth, (user?: User) =>
        //         resolve(user !== null), (e: any) => reject(e)));


    }


});