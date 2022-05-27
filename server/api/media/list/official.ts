import {defineEventHandler, JSONValue, useQuery} from "h3"
import {igAuthCollection, initMongo} from "~/server/mongodb"
import {notFound} from "~/utils/h3Error"
import {assert} from "~/server/util"
import {fetchIgMedias} from "~/server/instagram"

export default defineEventHandler(async (event) => {
    let {
        id,
        limit,
        until
    } = await useQuery(event) as { id: string, limit: string, until?: string }

    await initMongo()
    const p = await igAuthCollection.findOne({pageId: id}, {projection: {accessToken: 1}})
    assert(p, notFound)

    const medias = await fetchIgMedias(id, p.accessToken, true, {
        limit: Number(limit),
        until: until? Number(until) - 1 : undefined
    })

    return {
        medias
    } as unknown as JSONValue
    // { medias: IgMedia[] }
})
