import {userCollection} from "~/server/firebase/collections";
import {defineEventHandler, sendError, useBody} from 'h3';
import {emailUsed, register} from "~/server/firebase/auth";
import {noCache} from "~/server/util";
import {notFound} from "~/utils/h3Error";

export default defineEventHandler(async (event) => {
    noCache(event)

    const {email: _email, password}: { email: string, password: string } = await useBody(event);
    const email = _email.toLowerCase();

    if (await emailUsed(email)) {
        throw sendError(event, notFound)
    }

    const uid = await register(email, password);

    await userCollection().doc(uid).set({
        uid,
        email
    });

    return {success: true}
})
