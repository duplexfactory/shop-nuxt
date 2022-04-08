import {IncomingMessage, ServerResponse} from "http";
import {useBody, useCookie, useMethod, assertMethod} from "h3";
declare type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE';

export async function secureMethod (req: IncomingMessage, res: ServerResponse, method: HTTPMethod) {
    assertMethod(req, method);
    if (method === 'POST') {
        // Guard against CSRF attacks for post requests.
        await secureCSRFToken(req, res);
    }
}

export async function secureCSRFToken (req: IncomingMessage, res: ServerResponse) {
    const body = await useBody(req);
    if (!req.headers["x-requested-with"]) {
        const csrfTokenCookie = useCookie(req, "csrfToken");
        // Guard against CSRF attacks.
        if (!body.csrfToken || String(body.csrfToken) !== csrfTokenCookie) {
            res.statusCode = 401
            res.end()
            throw new Error()
        }
    }
}
