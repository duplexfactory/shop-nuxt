import {IncomingMessage, ServerResponse} from "http";
import {useBody, useMethod, useCookie, setCookie} from "h3";
import {getAuth} from "firebase-admin/auth";
import {secureMethod} from "~/server/secure-route/secure-route";

export default async function (req: IncomingMessage, res: ServerResponse) {

    await secureMethod(req, res, "POST");

    const {idToken} = await useBody(req);

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.

    try {
        const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
        // Set cookie policy for session cookie.
        setCookie(res, "session", sessionCookie, {maxAge: expiresIn, httpOnly: true, secure: true, path: "/"});
        return {success: true}
    }
    catch(e) {
        res.statusCode = 401
        res.end()
        throw new Error()
    }

    return {success: true}
}
