import {pageCollection} from "~/server/firebase/collections";
import IgPage from "~/models/IgPage";
import {fields} from "~/server/firebase/init";
import {IncomingMessage, ServerResponse} from "http";
import {useQuery} from "h3";
import {Query, DocumentData} from "@google-cloud/firestore";

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

export default async (req: IncomingMessage, res: ServerResponse) => {

    const {
        adult
    } = await useQuery(req) as { adult: string };

    let q: Query<DocumentData> = pageCollection()
        .where("deleted", "==", false)
        .where("private", "==", false);
    if (adult !== "true") {
        q = q.where("adult", "==", false)
    }

    const [hot, latest, active, physical] = await Promise.all([
        q
            .orderBy("followerCount", "desc")
            .limit(21)
            .pick(...cardFields, "extraData")
            .get()
            .then(ss => ss.data()),
        q
            .orderBy("lastMedia", "desc")
            .limit(12)
            .pick("lastMediaData", "pk", "username", "fullName")
            .get()
            .then(ss => ss.data()),
        q
            .orderBy("activeScore", "desc")
            .limit(30)
            .pick(...cardFields)
            .get()
            .then(ss => ss.data()),
        q
            .where("brickAndMortar", "==", true)
            .orderBy("activeScore", "desc")
            .limit(21)
            .pick(...cardFields, "extraData")
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
