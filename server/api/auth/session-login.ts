import {IncomingMessage, ServerResponse} from "http";
import {useBody, useMethod, useCookie, setCookie} from "h3";
import {getAuth} from "firebase-admin/auth";

export default async function (req: IncomingMessage, res: ServerResponse) {
   console.log("hereeee")


    if (useMethod(req) != "POST") {
        res.statusCode = 405
        res.end()
        throw new Error()
    }

    // Get the ID token passed and the CSRF token.
    const {idToken, csrfToken} = await useBody(req);
    const csrfTokenCookie = useCookie(req, "csrfToken");
    console.log(csrfToken)
    console.log(csrfTokenCookie)
    console.log(typeof csrfToken);
    console.log(typeof csrfTokenCookie);
    console.log(csrfToken !== csrfTokenCookie)
    // Guard against CSRF attacks.
    if (String(csrfToken) !== csrfTokenCookie) {
        res.statusCode = 401
        res.end()
        throw new Error()
    }

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.

    try {
        console.log("hereeee@@")
        const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
        // Set cookie policy for session cookie.
        console.log("hereeee@@@")
        setCookie(res, "session", sessionCookie, {maxAge: expiresIn, httpOnly: true, secure: true});
        console.log("hereeee@@@@")
        return {success: true}
    }
    catch(e) {
        res.statusCode = 401
        res.end()
        throw new Error()
    }

    return {success: true}
}
