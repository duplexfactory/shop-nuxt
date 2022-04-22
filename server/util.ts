import {appendHeader, createError, CompatibilityEvent} from "h3";

// Error
export const notFound = createError({statusCode: 404, statusMessage: "Not Found"})
export const badRequest = createError({statusCode: 400, statusMessage: "Bad Request"})

export function noCache(event: CompatibilityEvent) {
    appendHeader(event, "Cache-Control", "no-cache")
}
