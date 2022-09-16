import {defineEventHandler} from "h3"
import {assert} from "~/server/util"
import {notFound} from "~/utils/h3Error"
import {fetchIgMedia} from "~/server/instagram"
import {igAuthCollection, initMongo} from "~/server/mongodb"

export default defineEventHandler(async (event) => {
    const {id, pageId} = event.context.params
    assert(id)
    assert(pageId)

    await initMongo()

    const p = await igAuthCollection.findOne({pageId}, {projection: {accessToken: 1, invalid: 1}})
    assert(p, notFound)

    const media = await fetchIgMedia(pageId, id, p.accessToken)

    assert(media, notFound)

    return {media}
})
