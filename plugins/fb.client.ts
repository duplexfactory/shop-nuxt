import {defineNuxtPlugin} from "nuxt3/app";

export default defineNuxtPlugin((nuxtApp) => {

    // Add Facebook SDK.
    (function (d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) {
            return
        }
        js = d.createElement(s)
        js.id = id
        js.src = '//connect.facebook.net/zh_HK/sdk.js'
        fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-js-sdk'))

    // Init Facebook SDK.
    window["fbAsyncInit"] = function onSDKInit() {
        FB.init({
            appId: process.env.FACEBOOK_ID,
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v9.0'
        })
    }
});
