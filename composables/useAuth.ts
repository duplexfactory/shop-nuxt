import {getAuth, getIdToken} from "firebase/auth"
import {useCurrentUser} from "~/composables/states"

export default function useAuth() {
    const _getIdToken = (forceRefresh?: boolean) => getIdToken(useCurrentUser().value, forceRefresh)
    const getAuthHeader = async (forceRefresh?: boolean) => new Headers({authorization: `Bearer ${await _getIdToken(forceRefresh)}`})
    return {
        auth: getAuth(),
        getIdToken: _getIdToken,
        getAuthHeader
    }
}
