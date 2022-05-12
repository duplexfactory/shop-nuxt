export default function useIgAuth() {

    function authorize() {
        const config = useRuntimeConfig();

        const url = new URL(`https://api.instagram.com/oauth/authorize`)

        url.searchParams.set("client_id", config.IG_APP_ID)
        url.searchParams.set("redirect_uri", config.DOMAIN + `/my/account`)
        url.searchParams.set("scope", "user_profile,user_media")
        url.searchParams.set("response_type", "code")

        window.location.assign(url.href)
    }

    return {
        authorize
    }
}