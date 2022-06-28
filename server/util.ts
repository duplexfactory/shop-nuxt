import {CompatibilityEvent, createError, H3Error, sendError} from "h3"
import {badRequest, notFound} from "~/utils/h3Error"
import type {DecodedIdToken} from "firebase-admin/auth"
import {igAuthCollection, initMongo} from "~/server/mongodb";
import {getMediaByCode, initDynamo} from "~/server/dynamodb";
import IgMedia from "~/models/IgMedia";

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

export async function isOwnMedia(event: CompatibilityEvent, code: string): Promise<IgMedia | null> {
    const auth = getAuth(event)
    await initMongo()
    const igAuth = await igAuthCollection.findOne({
        userId: auth.uid
    })
    if (!igAuth) {
        return null
    }
    initDynamo()
    const media = await getMediaByCode(code)
    assert(media, notFound)
    if (media.pageId !== igAuth.pageId) {
        return null
    }
    return media
}