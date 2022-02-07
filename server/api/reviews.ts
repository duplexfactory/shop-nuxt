import {IncomingMessage, ServerResponse} from "http";
import {reviewCollection} from "~/server/firebase/collections";
import IgPageReview from "~/models/IgPageReview";
import {useQuery} from 'h3';
import {QuerySnapshot} from "firebase-admin/firestore";

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ reviews: (IgPageReview & {id: string}) [] }> {
    const {pagePk, mediaCode} = await useQuery(req) as { pagePk: number | undefined, mediaCode: string | undefined };

    let reviewSS: QuerySnapshot<IgPageReview>;
    if (mediaCode != undefined) {
        reviewSS = await reviewCollection()
            .where("mediaCode", "==", mediaCode)
            .where("deleted", "==", false)
            .orderBy("created", "desc")
            .get();
    }
    else if (pagePk != undefined) {
        reviewSS = await reviewCollection()
            .where("pagePk", "==", pagePk)
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
