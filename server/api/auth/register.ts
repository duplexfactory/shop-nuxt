import {IncomingMessage, ServerResponse} from "http";
import bcrypt from "bcryptjs";
import {userCollection} from "~/server/firebase/collections";
import {useMethod, useBody} from 'h3';

export default async function (req: IncomingMessage, res: ServerResponse) {
    if (useMethod(req) != "POST") {
        res.statusCode = 405
        res.end()
        throw new Error()
    }

    const {email, password}: {email: string, password: string} = await useBody(req);

    const used = await userCollection().where("email", "==", email).get();

    if (!used.empty) {
        res.statusCode = 400
        res.end()
        throw new Error()
    }

    const created = await userCollection().add({
        email,
        password: await bcrypt.hash(password, 10)
    });

    await created.update({id: created.id});

    return {success: true}
}
