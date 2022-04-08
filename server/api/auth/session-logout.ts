import {IncomingMessage, ServerResponse} from "http";
import {useBody, useCookie, useMethod} from "h3";
import {secureMethod} from "~/server/secure-route/secure-route";

export default async function (req: IncomingMessage, res: ServerResponse) {
    await secureMethod(req, res, "POST");


    // const sessionCookie = req.cookies.session || '';
    // res.clearCookie('session');
    // getAuth()
    //     .verifySessionCookie(sessionCookie)
    //     .then((decodedClaims) => {
    //         return getAuth().revokeRefreshTokens(decodedClaims.sub);
    //     })
    //     .then(() => {
    //         res.redirect('/login');
    //     })
    //     .catch((error) => {
    //         res.redirect('/login');
    //     });

}
