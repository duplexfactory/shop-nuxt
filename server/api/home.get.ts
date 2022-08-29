import {defineEventHandler, getQuery} from "h3"
import {initMongo, pageSearchCollection} from "~/server/mongodb"
import {Filter} from "mongodb"
import {PageSearch} from "~/models/PageSearch"

const cardFields = [
    "_id",
    "pk",
    "username",
    "fullName",
    "lastActivity",
    "followerCount",
    "mediaCount",
    "mediaUrls",
    "mediaCodes",
    "profilePicUrl",
    "tags",
    "locations",
    "igConnected"
] as ReadonlyArray<(keyof PageSearch)>

const cardProj = cardFields.reduce((obj, k) => Object.assign(obj, {[k]: 1}), {})
const extraProj = {...cardProj, extraData: 1}

export default defineEventHandler(async (event) => {
    await initMongo()

    const {
        adult
    } = await getQuery(event) as { adult: string }

    const f: Filter<PageSearch> = {}
    if (adult !== "true") {
        f.adult = false
    }

    const [
        hot,
        latest,
        active,
        // physical,
        featured
    ] = await Promise.all([
        pageSearchCollection.find(f).sort({followerCount: -1}).limit(21).project(extraProj).toArray(),
        pageSearchCollection.find({...f, lastMedia: {$gt: 0}, igConnected: true}).sort({lastMedia: -1}).limit(12).project({
            _id: 1,
            username: 1,
            fullName: 1,
            lastMediaData: 1,
        }).toArray(),
        pageSearchCollection.find(f).sort({activeScore: -1}).limit(30).project(cardProj).toArray(),
        // pageSearchCollection.find({
        //     ...f,
        //     brickAndMortar: true
        // }).sort({activeScore: -1}).limit(21).project(extraProj).toArray(),
        pageSearchCollection.find({
            ...f,
            igConnected: true
        }).sort({activeScore: -1}).limit(21).project(extraProj).toArray(),
    ])

    event.res.setHeader('Cache-Control', 'max-age=300');
    return {
        hot,
        latest,
        active,
        // physical,
        featured
    }
})

