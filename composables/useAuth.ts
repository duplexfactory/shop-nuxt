import {getAuth, getIdToken, onAuthStateChanged, User} from "firebase/auth"
import {useCurrentUser} from "~/composables/states"

export default function useAuth() {
    const auth = computed(getAuth)
    const _getIdToken = async (forceRefresh?: boolean) => {
        if (useCurrentUser().value) return getIdToken(useCurrentUser().value, forceRefresh)

        return new Promise((resolve) =>
            onAuthStateChanged(auth.value, async (user?: User) => resolve(await getIdToken(user, forceRefresh)))
        )
    }
    const getAuthHeader = async (forceRefresh?: boolean) => new Headers({authorization: `Bearer ${await _getIdToken(forceRefresh)}`})
    const headersToObject = (h: Headers) => {
        const headers = {}
        h.forEach((value, key) => {headers[key] = value})
        return headers
    }
    return {
        auth,
        getIdToken: _getIdToken,
        getAuthHeader,
        headersToObject
    }
}
