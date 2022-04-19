import {IncomingMessage, ServerResponse} from "http";
import bcrypt from "bcryptjs";
import {userCollection} from "~/server/firebase/collections";
import {assertMethod, sendError, useBody} from 'h3';
import {emailUsed, register} from "~/server/firebase/auth";
import {noCache, notFound} from "~/server/util";

export default async function (req: IncomingMessage, res: ServerResponse) {
    noCache(res)
    assertMethod(req, "POST")

    const {email: _email, password}: { email: string, password: string } = await useBody(req);
    const email = _email.toLowerCase();

    if (await emailUsed(email)) {
        throw sendError(res, notFound)
    }

    const uid = await register(email, password);

    await userCollection().doc(uid).set({
        uid,
        email,
        password: await bcrypt.hash(password, 10)
    });

    return {success: true}
}
