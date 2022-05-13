import {CompatibilityEvent, createError, H3Error, sendError} from "h3"
import {badRequest} from "~/utils/h3Error"
import type {DecodedIdToken} from "firebase-admin/auth"

export function noCache(event: CompatibilityEvent) {
    event.res.setHeader("Cache-Control", "no-cache")
}

export function assert(event: CompatibilityEvent, condition: any, error: H3Error = badRequest): asserts condition {
    if (!condition) {
        sendError(event, error)
        throw new Error("assertion failure")
    }
}

export function getAuth(event: CompatibilityEvent, block = true) {
    if (!event.context.auth && block) sendError(event, createError({statusCode: 401, statusMessage: "Not Authorized"}))
    return event.context.auth as DecodedIdToken
}
