import {pageCollection} from "~/server/firebase/collections";
import IgPage from "~/models/IgPage";
import {fields} from "~/server/firebase/init";

const cardFields= [
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

export default async () => {
    const [hot, latest, active, physical] = await Promise.all([
        pageCollection()
            .where("deleted", "==", false)
            .where("private", "==", false)
            .orderBy("followerCount", "desc")
            .limit(21)
            .pick(...cardFields)
            .get()
            .then(ss => ss.data()),
        pageCollection()
            .orderBy("lastMedia", "desc")
            .limit(12)
            .pick("lastMediaData", "pk", "username", "fullName")
            .get()
            .then(ss => ss.data()),
        pageCollection()
            .where("deleted", "==", false)
            .where("private", "==", false)
            .orderBy("activeScore", "desc")
            .limit(30)
            .pick(...cardFields)
            .get()
            .then(ss => ss.data()),
        pageCollection()
            .where("deleted", "==", false)
            .where("private", "==", false)
            .where("brickAndMortar", "==", true)
            .orderBy("activeScore", "desc")
            .limit(21)
            .pick(...cardFields)
            .get()
            .then(ss => ss.data())
    ])

    return {
        hot,
        latest,
        active,
        physical,
    };
}
