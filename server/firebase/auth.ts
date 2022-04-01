import {getAuth} from "firebase-admin/auth";
import {initFirebase} from "~/server/firebase/init";

initFirebase();

export async function register(email: string, password: string) {
    const res = await getAuth().createUser({email, password})
    return res.uid;
}

export async function emailUsed(email: string) {
    return getAuth().getUserByEmail(email).then(() => true).catch(() => false)
}
