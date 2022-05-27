import {defineEventHandler, JSONValue, useQuery} from "h3"
import {igAuthCollection, initMongo} from "~/server/mongodb"
import {notFound} from "~/utils/h3Error"
import {assert} from "~/server/util"
import {fetchIgMedias} from "~/server/instagram"

export default defineEventHandler(async (event) => {
    let {
        id,
        limit,
        token
    } = await useQuery(event) as { id: string, limit: string, token?: string }

    await initMongo()
    const p = await igAuthCollection.findOne({pageId: id}, {projection: {accessToken: 1}})
    assert(p, notFound)

    const {medias, nextToken} = await fetchIgMedias(p.accessToken, true, {
        limit: Number(limit),
        after: token
    })

    return {
        medias,
        nextToken: nextToken || ""
    } as unknown as JSONValue
    // { medias: IgMedia[] }
})
