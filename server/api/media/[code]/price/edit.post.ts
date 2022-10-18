import {defineEventHandler} from "h3";
import {assert, guard, isOwnMedia, noCache} from "~/server/util";
import {patchMedia} from "~/server/dynamodb";
import {pageSearchCollection} from "~/server/mongodb"
import {pageCollection} from "~/server/firebase/collections"

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

    const pageSearch = await pageSearchCollection.findOneAndUpdate({
        _id: media.pageId,
        "lastMediaData.code": media.code
    }, {
        $set: {
            "lastMediaData.patchPrice": price
        }
    }, {
        returnDocument: "after"
    })
    if (pageSearch.value) {
        await pageCollection().doc(media.pageId).update({
            lastMediaData: pageSearch.value.lastMediaData
        })
    }

    return {
        success: true
    };
})
