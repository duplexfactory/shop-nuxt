import {defineEventHandler, JSONValue, useQuery} from "h3"
import {igAuthCollection, initMongo, pageSearchCollection} from "~/server/mongodb"
import {notFound} from "~/utils/h3Error"
import {assert} from "~/server/util"
import {fetchIgMedias} from "~/server/instagram"
import {getPageMedias, initDynamo} from "~/server/dynamodb";
import dayjs from "dayjs";
import {detectPrice} from "~/utils/from-crawler/detect-price";

export default defineEventHandler(async (event) => {
    let {
        id,
        limit,
        until
    } = await useQuery(event) as { id: string, limit: string, until?: string }

    await initMongo()
    const p = await igAuthCollection.findOne({pageId: id}, {projection: {accessToken: 1}})
    assert(p, notFound)

    // Get existing medias from dynamo for price and patchPrice.
    initDynamo()
    const existingMedias = await getPageMedias(
        id,
        limit ? Number(limit) : undefined,
        until ? Number(until) - 1 : undefined,
    )
    let since: number | undefined;
    if (existingMedias.length) {
        since = existingMedias[0].takenAt
    }

    const medias = await fetchIgMedias(id, p.accessToken, true, {
        limit: Number(limit),
        until: until ? Number(until) - 1 : undefined,
        since
    })
    medias.forEach((m) => {
        if (!!m.caption)
            m.price = detectPrice(m.caption)
    })

    return {
        medias: medias.concat(...existingMedias)
    } as unknown as JSONValue
    // { medias: IgMedia[] }
})
