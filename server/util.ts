import {CompatibilityEvent, createError, H3Error, sendError} from "h3";

export function noCache(event: CompatibilityEvent) {
    event.res.setHeader("Cache-Control", "no-cache");
}

export function assert(event: CompatibilityEvent, condition: any, error: H3Error = badRequest): asserts condition {
    if (!condition) {
        throw sendError(event, error)
    }
}
