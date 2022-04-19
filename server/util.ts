import {createError} from "h3";
import {ServerResponse} from "http";

// Error
export const notFound = createError({statusCode: 404, statusMessage: "Not Found"})
export const badRequest = createError({statusCode: 400, statusMessage: "Bad Request"})

export function noCache(res: ServerResponse) {
    res.setHeader("Cache-Control", "no-cache")
}
