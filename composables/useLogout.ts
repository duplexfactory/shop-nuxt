import {getAuth} from "firebase/auth";

export default function useCreateReview() {

    const isLoggedIn = useIsLoggedIn();

    async function logout() {
        const auth = getAuth()
        await auth.signOut()
        isLoggedIn.value = false
    }

    return {
        logout
    }
}
