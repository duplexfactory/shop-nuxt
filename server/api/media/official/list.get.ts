import {defineEventHandler, getQuery} from "h3"
import {igAuthCollection, initMongo, pageSearchCollection} from "~/server/mongodb"
import {badRequest, notFound} from "~/utils/h3Error"
import {assert, getAuth} from "~/server/util"
import {fetchIgMedias, fetchIgProfile} from "~/server/instagram"
import {getMediasByCodes, getPageMedias, initDynamo, saveMedias} from "~/server/dynamodb"
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
        until,
        before,
        after
    } = getQuery(event) as { id: string, limit: string, since?: string, until?: string, before?: string, after?: string }

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
    // console.log(before)
    // console.log(after)
    // console.log(until)
    // console.log(since)

    let medias: IgMedia[]
    let paging: { cursors: {before: string, after: string} }

    if (!!p.invalid) {
        // Token is invalid.
        // Get use existing medias from dynamo.
        const existingMedias = await getPageMedias(
            id,
            limit ? Number(limit) : undefined,
            until ? Number(until) - 1 : undefined,
            since ? Number(since) + 1 : undefined,
        )
        medias = existingMedias
    }
    else {
        // Token is valid.
        // Get new medias from official api.
        const paginate = {
            limit: Number(limit)
        }
        if (!!before || !!after) {
            if (!!before) {
                paginate["before"] = before
            }
            if (!!after) {
                paginate["after"] = after
            }
        }
        else {
            paginate["until"] = until ? Number(until) - 1 : undefined
            paginate["since"] = since ? Number(since) + 1 : undefined
        }

        const res = await fetchIgMedias(id, p.accessToken, true, paginate)
        medias = res.medias
        paging = res.paging
        // const since: number | undefined = medias.length ? medias[0].takenAt : undefined

        const existingMedias = await getMediasByCodes(medias.map((m) => m.code))

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

        // console.log(newMedias.length)

        if (newMedias.length !== 0) {
            // Contains not crawled data. Process and save to db.
            const rmUrl = newMedias.map(m => {
                const {
                    mediaUrl,
                    mediaList,
                    ...props
                } = m
                return props
            })
            await saveMedias(rmUrl)
        }

        // Update media info of page.
        const lastMedia = Object.assign({}, medias[0])
        delete lastMedia.mediaUrl
        delete lastMedia.mediaList
        const page = await pageSearchCollection.findOne({_id: id})
        if (lastMedia.takenAt > page.lastMedia) {
            const {media_count} = await fetchIgProfile(p.accessToken)
            const update = {
                lastMedia: lastMedia.takenAt,
                lastActivity: lastMedia.takenAt,
                lastMediaData: lastMedia,
                mediaCount: media_count,
                mediaCodes: medias.slice(0, 3).map((m) => m.code),
                mediaIds: medias.slice(0, 3).map((m) => m.mediaId)
            }
            await pageSearchCollection.updateOne({_id: id}, {$set: update})
            await pageCollection().doc(id).update(update)
        }
    }

    return {
        medias,
        paging
    }
})
