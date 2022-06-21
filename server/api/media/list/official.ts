import {defineEventHandler, JSONValue, useQuery} from "h3"
import {igAuthCollection, initMongo, pageSearchCollection} from "~/server/mongodb"
import {badRequest, notFound} from "~/utils/h3Error"
import {assert, getAuth} from "~/server/util"
import {fetchIgMedias, fetchIgProfile} from "~/server/instagram"
import {getPageMedias, initDynamo, saveMedias} from "~/server/dynamodb"
import {detectPrice} from "~/utils/from-crawler/detect-price"
import {pageCollection} from "~/server/firebase/collections"
import IgMedia from "~/models/IgMedia"
import IgAuth from "~/models/IgAuth";
import {WithId} from "mongodb";

export default defineEventHandler(async (event) => {
    let {
        id,
        limit,
        since,
        until
    } = await useQuery(event) as { id: string, limit: string, since?: string, until?: string }

    await initMongo()

    const auth = getAuth(event, false)
    let p: WithId<IgAuth>
    if (!!auth) {
        p = await igAuthCollection.findOne({userId: auth.uid}, {projection: {pageId: 1, accessToken: 1, invalid: 1, userId: 1}})
        id = p.pageId
    }
    else {
        p = await igAuthCollection.findOne({pageId: id}, {projection: {accessToken: 1, invalid: 1, userId: 1}})
    }
    assert(p, notFound)


    // Get existing medias from dynamo for price and patchPrice.
    initDynamo()
    const existingMedias = await getPageMedias(
        id,
        limit ? Number(limit) : undefined,
        until ? Number(until) - 1 : undefined,
        since ? Number(since) - 1 : undefined,
    )

    let medias: IgMedia[]
    if (!!p.invalid) {
        // Token is invalid.
        // Get use existing medias from dynamo.
        medias = existingMedias
    }
    else {
        // Token is valid.
        // Get new medias from official api.
        medias = await fetchIgMedias(id, p.accessToken, true, {
            limit: Number(limit),
            since: since ? Number(since) - 1 : undefined,
            until: until ? Number(until) - 1 : undefined,
        })
        // const since: number | undefined = medias.length ? medias[0].takenAt : undefined

        const newMedias: IgMedia[] = []
        medias.forEach((m) => {
            const existingMedia = existingMedias.find((em) => em.code === m.code)
            if (!!existingMedia) {
                m.price = existingMedia.price
                m.patchPrice = existingMedia.patchPrice
            }
            else {
                if (!!m.caption) {
                    const price = detectPrice(m.caption)
                    if (price !== undefined)
                        m.price = price
                }
                newMedias.push(m)
            }
        })
        if (newMedias.length !== 0) {
            // Contains not crawled data. Process and save to db.
            const rmUrl = newMedias.map(m => {
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
        medias
    } as unknown as JSONValue
    // { medias: IgMedia[] }
})
