import {IncomingMessage, ServerResponse} from "http";
import {useQuery} from "h3";
import {initMongo, pageSearchCollection} from "~/server/mongodb";
import {Filter} from "mongodb";
import {PageSearch} from "~/models/PageSearch";

const cardFields = [
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
    "locations"
] as const

const cardProj = cardFields.reduce((obj, k) => Object.assign(obj, {[k]: 1}), {})
const extraProj = {...cardProj, extraData: 1}
const idToPk = (page: PageSearch) => ({...page, pk: page._id})

export default async (req: IncomingMessage, res: ServerResponse) => {
    await initMongo();

    const {
        adult
    } = await useQuery(req) as { adult: string };

    const f: Filter<PageSearch> = {};
    if (adult !== "true") {
        f.adult = false;
    }

    const [hot, latest, active, physical] = await Promise.all([
        pageSearchCollection.find(f).sort({followerCount: -1}).limit(21).project(extraProj).map(idToPk).toArray(),
        pageSearchCollection.find({...f, lastMedia:{$gt: 0}}).sort({lastMedia: -1}).limit(12).project({
            _id: 1,
            username: 1,
            fullName: 1,
            lastMediaData: 1
        }).map(idToPk).toArray(),
        pageSearchCollection.find(f).sort({activeScore: -1}).limit(30).project(cardProj).map(idToPk).toArray(),
        pageSearchCollection.find({
            ...f,
            brickAndMortar: true
        }).sort({activeScore: -1}).limit(21).project(extraProj).map(idToPk).toArray(),
    ])

    return {
        hot,
        latest,
        active,
        physical,
    };
}
