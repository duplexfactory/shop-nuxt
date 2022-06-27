import {defineEventHandler} from "h3";
import {assert} from "~/server/util";
import {initMongo, mediaCommerceDataCollection} from "~/server/mongodb";

export default defineEventHandler(async (event) => {
    const {code} = event.context.params
    assert(code)

    await initMongo()
    await mediaCommerceDataCollection.deleteOne({
        _id: code
    })

    return {
        success: true
    }
})