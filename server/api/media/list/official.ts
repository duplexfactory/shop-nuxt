import {defineEventHandler, JSONValue, useQuery} from "h3"
import {igAuthCollection, initMongo, pageSearchCollection} from "~/server/mongodb"
import {notFound} from "~/utils/h3Error"
import {assert} from "~/server/util"
import {fetchIgMedias, fetchIgProfile} from "~/server/instagram"
import {getPageMedias, initDynamo, saveMedias} from "~/server/dynamodb"
import {detectPrice} from "~/utils/from-crawler/detect-price"
import {pageCollection} from "~/server/firebase/collections"
import IgMedia from "~/models/IgMedia"

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

    let medias: IgMedia[] = []

    if (!until) {
        // Get new medias from official api.
        const since: number | undefined = existingMedias.length ? existingMedias[0].takenAt : undefined
        medias = await fetchIgMedias(id, p.accessToken, true, {
            limit: Number(limit),
            until: until ? Number(until) - 1 : undefined,
            since
        })
        if (medias.length !== 0) {
            // Contains not crawled data. Process and save to db.
            medias.forEach((m) => {
                if (!!m.caption) {
                    const price = detectPrice(m.caption)
                    if (price !== undefined)
                        m.price = price
                }
            })

            const rmUrl = medias.map(m => {
                const {mediaUrl, ...props} = m
                return props
            })
            await saveMedias(rmUrl)

            const {media_count} = await fetchIgProfile(p.accessToken)

            // Update media info of page.
            const lastMedia = rmUrl[0]
            const update = {
                lastMedia: lastMedia.takenAt,
                lastActivity: lastMedia.takenAt,
                lastMediaData: lastMedia,
                mediaCount: media_count,
                mediaCodes: medias.slice(0, 3).map((m) => m.code)
            }
            await pageSearchCollection.updateOne({_id: id}, {$set: update})
            await pageCollection().doc(id).update(update)
        }
    }

    return {
        medias: medias.concat(...existingMedias)
    } as unknown as JSONValue
    // { medias: IgMedia[] }
})
