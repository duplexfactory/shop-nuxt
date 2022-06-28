import {defineEventHandler} from "h3";
import {assert, isOwnMedia, noCache} from "~/server/util";
import {mediaCommerceDataCollection} from "~/server/mongodb";

export default defineEventHandler(async (event) => {
    noCache(event);
    const {code} = event.context.params
    assert(code)
    assert(await isOwnMedia(event, code))

    await mediaCommerceDataCollection.deleteOne({
        _id: code
    })

    return {
        success: true
    }
})