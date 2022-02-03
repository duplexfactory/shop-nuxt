import {IncomingMessage, ServerResponse} from "http";
import {reviewCollection} from "~/server/firebase/collections";
import IgPageReview from "~/models/IgPageReview";
import {useQuery} from 'h3';

export default async function (req: IncomingMessage, res: ServerResponse): Promise<{ reviews: IgPageReview[] }> {
    const {id} = await useQuery(req) as { id: string };

    const reviewSS = await reviewCollection()
        .where("pagePk", "==", id)
        .where("deleted", "==", false)
        .orderBy("created", "desc")
        .get();
    const reviews = reviewSS.data();

// .limit(21)
// .pick(...cardFields)

    return {
        reviews
    }
}
