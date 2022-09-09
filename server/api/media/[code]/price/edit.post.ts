import {defineEventHandler} from "h3";
import {assert, guard, isOwnMedia, noCache} from "~/server/util";
import {patchMedia} from "~/server/dynamodb";

export default defineEventHandler(async (event) => {

    noCache(event);

    const {code} = event.context.params
    assert(code)

    const {
        price
    }: {
        price: number
    } = await readBody(event)
    guard(price == undefined)

    const media = await isOwnMedia(event, code)
    assert(media)

    await patchMedia(media.pageId, media.takenAt, {
        patchPrice: price
    })

    return {
        success: true
    };
})
