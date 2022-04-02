import {IncomingMessage, ServerResponse} from "http";
import bcrypt from "bcryptjs";
import {userCollection} from "~/server/firebase/collections";
import {useBody, useMethod} from 'h3';
import {emailUsed, register} from "~/server/firebase/auth";

export default async function (req: IncomingMessage, res: ServerResponse) {
    if (useMethod(req) != "POST") {
        res.statusCode = 405
        res.end()
        throw new Error()
    }

    const {email: _email, password}: { email: string, password: string } = await useBody(req);
    const email = _email.toLowerCase();

    if (await emailUsed(email)) {
        res.statusCode = 400
        res.end()
        throw new Error()
    }

    const uid = await register(email, password);

    await userCollection().doc(uid).set({
        uid: uid,
        email,
        password: await bcrypt.hash(password, 10)
    });

    return {success: true}
}