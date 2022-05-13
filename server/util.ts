import {CompatibilityEvent, createError, H3Error, sendError} from "h3"
import {badRequest} from "~/utils/h3Error"
import type {DecodedIdToken} from "firebase-admin/auth"

export function noCache(event: CompatibilityEvent) {
    event.res.setHeader("Cache-Control", "no-cache")
}

export function assert(condition: any, error: H3Error = badRequest): asserts condition {
    if (!condition) throw error
}

export function guard(condition: any, error: H3Error = badRequest) {
    if (condition) throw error
}

export function getAuth(event: CompatibilityEvent, block = true) {
    if (!event.context.auth && block) throw createError({statusCode: 401, statusMessage: "Not Authorized"})
    return event.context.auth as DecodedIdToken
}
