import {defineEventHandler, JSONValue, useQuery} from "h3"
import {igAuthCollection, initMongo, pageSearchCollection} from "~/server/mongodb"
import {notFound} from "~/utils/h3Error"
import {assert} from "~/server/util"
import {fetchIgMedias} from "~/server/instagram"
import {getPageMedias, initDynamo, saveMedias} from "~/server/dynamodb";
import dayjs from "dayjs";
import {detectPrice} from "~/utils/from-crawler/detect-price";
import {pageCollection} from "~/server/firebase/collections";

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

    // Get new medias from official api.
    const since: number | undefined = existingMedias.length ? existingMedias[0].takenAt : undefined
    const medias = await fetchIgMedias(id, p.accessToken, true, {
        limit: Number(limit),
        until: until ? Number(until) - 1 : undefined,
        since
    })
    if (medias.length !== 0) {
        // Contains not crawled data. Process and save to db.
        medias.forEach((m) => {
            if (!!m.caption)
                m.price = detectPrice(m.caption)
        })
        await saveMedias(medias)

        // Update media info of page.
        const lastMedia = medias[0]
        const update = {
            lastMedia: lastMedia.takenAt,
            lastActivity: lastMedia.takenAt,
            lastMediaData: lastMedia,
            mediaCount: medias.length + existingMedias.length,
            mediaCodes: medias.slice(0, 3).map((m) => m.code)
        }
        await pageSearchCollection.updateOne({_id: id}, {$set: update})
        await pageCollection().doc(id).update(update)
    }

    return {
        medias: medias.concat(...existingMedias)
    } as unknown as JSONValue
    // { medias: IgMedia[] }
})
