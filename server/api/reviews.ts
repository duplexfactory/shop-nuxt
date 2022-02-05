import {IncomingMessage, ServerResponse} from "http";
import {reviewCollection} from "~/server/firebase/collections";
import IgPageReview from "~/models/IgPageReview";
import {useQuery} from 'h3';

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ reviews: (IgPageReview & {id: string}) [] }> {
    const {pagePk, mediaId} = await useQuery(req) as { pagePk: number | undefined, mediaId: string | undefined };

    let reviewSS;
    if (pagePk != undefined) {
        reviewSS = await reviewCollection()
            .where("pagePk", "==", pagePk)
            .where("deleted", "==", false)
            .orderBy("created", "desc")
            .get();
    }
    else if (mediaId != undefined) {
        reviewSS = await reviewCollection()
            .where("mediaId", "==", mediaId)
            .where("deleted", "==", false)
            .orderBy("created", "desc")
            .get();
    }
    else {
        res.statusCode = 400
        res.end()
        throw new Error()
    }

    const reviews = reviewSS.docs.map((d) => ({
        ...d.data(),
        id: d.id
    }))

// .limit(21)
// .pick(...cardFields)

    return {
        reviews
    }
}
