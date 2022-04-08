import {IncomingMessage, ServerResponse} from "http";
import bcrypt from "bcryptjs";
import {userCollection} from "~/server/firebase/collections";
import {sendError, useBody} from 'h3';
import {notFound} from "~/server/util";
import {emailUsed, register} from "~/server/firebase/auth";
import {secureMethod} from "~/server/secure-route/secure-route";

export default async function (req: IncomingMessage, res: ServerResponse) {

    await secureMethod(req, res, "POST");

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
